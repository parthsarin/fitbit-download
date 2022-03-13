import { useContext, useState } from 'react';

import { TokenContext } from '../App';
import { OAuthConfig } from '../Auth';
import PageState from './PageState';
import SettingsPage from '../SettingsPage';
import './MainPage.css';
import DownloadPage from '../DownloadPage';

interface MainPageProps {
  oaConfig: OAuthConfig,
  setOAConfig: (oa: OAuthConfig) => void,
}

const MainPage = ({ oaConfig, setOAConfig }: MainPageProps) => {
  const token = useContext(TokenContext);
  const [pageState, setPageState] = useState<PageState>(PageState.MainPage);


  const handleClick = (nextPage: PageState, disabled: boolean) => {
    if (disabled) return () => {}
    return () => setPageState(nextPage);
  }

  if (pageState === PageState.SettingsPage) {
    return (
      <SettingsPage 
        setPageState={setPageState} 
        oaConfig={oaConfig} 
        setOAConfig={setOAConfig}
      />
    );
  }

  if (pageState === PageState.DownloadPage) {
    return (
      <DownloadPage
        setPageState={setPageState}
      />
    );
  }

  return (
    <div className="w-3/5 h-3/5 flex flex-col justify-between">
      <div 
        className="route-button" 
        onClick={handleClick(PageState.SettingsPage, false)}
      >
        <img src="/img/settings.svg" alt="" />
        <h1 className="text-3xl md:text-6xl">Configure settings</h1>
      </div>
      <div 
        className={`route-button ${ token ? "" : "rb-disabled"}`} 
        onClick={ handleClick(PageState.DownloadPage, !Boolean(token)) }
      >
        <img src="/img/download.svg" alt="" />
        <h1 className="text-3xl md:text-6xl">Download data</h1>
      </div>
    </div>
  );
}

export default MainPage;