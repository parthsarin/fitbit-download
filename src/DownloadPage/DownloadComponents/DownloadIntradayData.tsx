import React, { useContext, useState } from "react";
import { TokenContext } from "../../App";
import styles from '../DownloadPage.module.css';
import { downloadIntraday } from "../DownloadUtils";

interface DownloadIntradayDataProps {
  setLoading: (l: boolean) => void
}

const DownloadIntradayData = ({ setLoading }: DownloadIntradayDataProps) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [resources, setResources] = useState<string[]>(['heart']);
  const [ignoreBlank, setIgnoreBlank] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string>("");
  const token = useContext(TokenContext);

  const allResources = ["heart", "calories", "distance", "elevation", "floors", "steps"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    downloadIntraday(
      token, 
      startDate, endDate, 
      resources, 
      ignoreBlank,
      setFeedback, setLoading);
  }

  const handleType = (fn: (s: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      fn(e.target.value);
      if (feedback) {
        setFeedback("");
      }
    }
  }

  const handleCheck = (r: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      if (r === 'heart' && ignoreBlank && (!e.target.checked)) {
        // Don't allow them to uncheck heart if we're ignoring blank
        e.preventDefault();
        return;
      }

      if (e.target.checked) {
        // Add to resources
        setResources([...resources, r])
      } else {
        // Remove from resources
        setResources(resources.filter(x => x !== r));
      }
    }
  }

  const handleIgnoreCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Add 'heart' to the resources as well
      setIgnoreBlank(true);
      if (!resources.find(x => x === 'heart')) {
        setResources([...resources, 'heart']);
      }
    } else {
      setIgnoreBlank(false);
    }
  } 
  
  return (
    <div className="bg-slate-800 p-4 rounded-md mb-6">
      <h2 className="text-2xl">Download activity data</h2>
      <p className="text-teal-500 mb-6">{feedback}</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="start-date">
            <span className="text-gray-200 text-xl">Start date</span>
          </label>
          <input
            type="text"
            className={styles.input}
            name="start-date"
            value={startDate}
            placeholder="yyyy-mm-dd"
            onChange={handleType(setStartDate)}
          ></input>
        </div>
        <div className="mb-4">
          <label htmlFor="end-date">
            <span className="text-gray-200 text-xl">End date</span>
          </label>
          <input
            type="text"
            className={styles.input}
            name="end-date"
            value={endDate}
            placeholder="yyyy-mm-dd"
            onChange={handleType(setEndDate)}
          ></input>
        </div>
        <div className="mt-6">
          <span className="text-gray-200 text-xl">Variables</span>
          {
            allResources.map((r, i) => (
              <div key={r} className={i === 0 ? "mt-2" : ""}>
                <input 
                  className={styles.checkboxInput} 
                  type="checkbox"
                  key={`input-${r}`} id={r} name={r} 
                  checked={resources.includes(r)}
                  onChange={handleCheck(r)}
                />
                <label className="inline-block ml-1" key={`label-${r}`} htmlFor={r}>{r}</label>
              </div>
            ))
          }
        </div>
        <div className="mt-6">
          <span className="text-gray-200 text-xl">Blank measurements</span>
            <div className="mt-2">
              <input 
                className={styles.checkboxInput} 
                type="checkbox"
                checked={ignoreBlank}
                id="ignoreBlank"
                name="ignoreBlank"
                onChange={handleIgnoreCheck}
              />
            <label className="inline-block ml-1" htmlFor="ignoreBlank">Ignore measurements when the device was likely not being worn (no heartrate)</label>
            </div>
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
            Download
          </button>
        </div>
      </form>
    </div>
  );
}

export default DownloadIntradayData;