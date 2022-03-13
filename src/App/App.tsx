import { useEffect, useState } from 'react';

import getHashParams from './UrlParser';
import TokenContext from './TokenContext';
import './App.css';

import MainPage from '../MainPage';
import {OAuthConfig} from '../Auth';


function App() {
  const [token, setToken] = useState<string>("");
  const [oaConfig, setOAConfig] = useState<OAuthConfig>(
    localStorage.getItem("oaConfig")
    ? JSON.parse(localStorage.getItem("oaConfig")!)
    : { clientId: "", clientSecret: "" }
  )

  // Reroute OA updates through localStorage
  const handleOAUpdate = (newOAConfig: OAuthConfig) => {
    localStorage.setItem("oaConfig", JSON.stringify(newOAConfig));
    setOAConfig(newOAConfig);
  }

  // Set the token on a redirect
  useEffect(() => {
    let newToken: string | null;

    // First check local storage
    newToken = localStorage.getItem("token");
    if (newToken && localStorage.getItem("expiresAt")) {
      // Is it expired?
      const expiration = parseInt(localStorage.getItem("expiresAt")!);
      const d = new Date();
      const t = d.getTime();

      if (t > expiration) {
        newToken = null;
        localStorage.removeItem("token");
        localStorage.removeItem("expiresAt");
      }
    }

    // Next check the URL
    const url = getHashParams();
    if (url.access_token) {
      newToken = url.access_token;
    }

    // Update the token
    if (newToken && token !== newToken) {
      setToken(newToken);

      if (url.expires_in) {
        const d = new Date();
        const t = d.getTime();
        const expiresAt = parseInt(url.expires_in) + t;
        localStorage.setItem("expiresAt", expiresAt.toString());
      }

      localStorage.setItem("token", newToken);
    }
  }, []);

  return (
    <TokenContext.Provider value={token}>
      <div className="app flex justify-center items-center h-full w-full">
        <MainPage oaConfig={oaConfig} setOAConfig={handleOAUpdate} />
      </div>
    </TokenContext.Provider>
  );
}

export default App;
