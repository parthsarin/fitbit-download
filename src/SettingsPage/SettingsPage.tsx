import BackButton from './../BackButton';
import { PageState } from "../MainPage";
import './SettingsPage.css';
import { OAuthConfig } from '../Auth';
import React from 'react';

interface SettingsPageProps {
  setPageState: (ps: PageState) => void,
  oaConfig: OAuthConfig,
  setOAConfig: (oa: OAuthConfig) => void
}

const SettingsPage = ({ setPageState, oaConfig, setOAConfig }: SettingsPageProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const URL = `https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=${oaConfig.clientId}&redirect_uri=https%3A%2F%2Fdev.parthsarin.com%2Fbiometric&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800`;
    window.location.href = URL;
  }

  return (
    <>
      <BackButton onClick={() => setPageState(PageState.MainPage)} />
      <div className="w-4/5 absolute top-20 pb-20" id="settings-page">
        <h1 className="text-3xl mb-4">Configure settings</h1>
        <p>To configure this application, you'll need to create a developer account with Fitbit. To get started, visit <a className="text-indigo-400 hover:underline" href="https://dev.fitbit.com/apps">https://dev.fitbit.com/apps</a> and log in if needed. After logging in, you should see a webpage that looks like this:</p>
        <img
          src="/img/fitbit-auth/fb-auth-1.png"
          alt="The main page for the Fitbit developer applications, showing no registered applications"
          className="w-3/5 mx-auto"
        />  
        <p>Click <b>Register a new app</b> in the top right and input the following information:</p>     
        <dl className="mt-2 bg-slate-800 p-4 rounded-md">
          <div className="grid grid-cols-3 mt-1">
            <dt className="font-bold italic">Application Name</dt>
            <dd>BiometricData</dd>
          </div>
          <div className="grid grid-cols-3 mt-1">
            <dt className="font-bold italic">Description</dt>
            <dd>Download biometric data as a CSV</dd>
          </div>
          <div className="grid grid-cols-3 mt-1">
            <dt className="font-bold italic">Application Website URL</dt>
            <dd>https://dev.parthsarin.com/biometric</dd>
          </div>
          <div className="grid grid-cols-3 mt-1">
            <dt className="font-bold italic">Organization</dt>
            <dd>Stanford</dd>
          </div>
          <div className="grid grid-cols-3 mt-1">
            <dt className="font-bold italic">Organization Website URL</dt>
            <dd>https://dev.parthsarin.com/biometric</dd>
          </div>
          <div className="grid grid-cols-3 mt-1">
            <dt className="font-bold italic">Terms of Service URL</dt>
            <dd>https://dev.parthsarin.com/biometric</dd>
          </div>
          <div className="grid grid-cols-3 mt-1">
            <dt className="font-bold italic">Privacy Policy URL</dt>
            <dd>https://dev.parthsarin.com/biometric</dd>
          </div>
          <div className="grid grid-cols-3 mt-1">
            <dt className="font-bold italic">OAuth 2.0 Application Type</dt>
            <dd>Personal</dd>
          </div>
          <div className="grid grid-cols-3 mt-1">
            <dt className="font-bold italic">Redirect URL</dt>
            <dd>https://dev.parthsarin.com/biometric</dd>
          </div>
          <div className="grid grid-cols-3 mt-1">
            <dt className="font-bold italic">Default Access Type</dt>
            <dd>Read Only</dd>
          </div>
        </dl>
        <p className="mt-5 mb-5">After finishing this step, the application should look like this:</p>
        <img
          src="/img/fitbit-auth/fb-auth-2.png"
          alt="The setup for this application, with the information above filled in"
          className="w-2/5 mx-auto"
        />
        <p className="mt-5 mb-5">Click "Register" and copy your credentials into this website. Then, click Authorize below. </p>                
        <form className="bg-slate-800 p-4 rounded-md" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="client-id">
              <span className="text-gray-200 text-xl">OAuth 2.0 Client ID</span>
            </label>
            <input
              type="text"
              className="input"
              name="client-id"
              value={oaConfig.clientId}
              onChange={(e) => setOAConfig({...oaConfig, clientId: e.target.value})}
            ></input>
          </div>
          <div className="mb-4">
            <label htmlFor="client-secret">
              <span className="text-gray-200 text-xl">Client Secret</span>
            </label>
            <input
              type="text"
              className="input"
              name="client-secret"
              value={oaConfig.clientSecret}
              onChange={(e) => setOAConfig({ ...oaConfig, clientSecret: e.target.value })}
            ></input>
          </div>                    
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="
                  border border-transparent
                  text-base font-medium
                  rounded-md text-white
                  bg-indigo-500 hover:bg-indigo-700
                  md:py-2 md:text-lg md:px-6
              "
            >
              Authorize
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default SettingsPage;