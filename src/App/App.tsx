import { useEffect, useState } from 'react';

import getHashParams from './UrlParser';
import TokenContext from './TokenContext';
import './App.css';

import MainPage from '../MainPage';


function App() {
  const [token, setToken] = useState<string>("");

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
        <MainPage />
      </div>
    </TokenContext.Provider>
  );
}

export default App;
