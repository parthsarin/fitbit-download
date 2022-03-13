import { useContext, useState } from 'react';

import { TokenContext } from '../App';
import { OAuthConfig } from '../Auth';
import PageState from './PageState';
import SettingsPage from '../SettingsPage';
import DownloadPage from '../DownloadPage';

import styles from './MainPage.module.css';
import settings from '../img/settings.svg';
import download from '../img/download.svg';

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
        className={styles["route-button"]}
        onClick={handleClick(PageState.SettingsPage, false)}
      >
        <img src={settings} alt="" />
        <h1 className="text-3xl md:text-6xl">Configure settings</h1>
      </div>
      <div 
        className={`${styles["route-button"]} ${ token ? "" : styles["rb-disabled"]}`} 
        onClick={ handleClick(PageState.DownloadPage, !Boolean(token)) }
      >
        <img src={download} alt="" />
        <h1 className="text-3xl md:text-6xl">Download data</h1>
      </div>
    </div>
  );
}

export default MainPage;