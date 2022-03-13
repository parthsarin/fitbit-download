import React, { useContext, useState } from "react";
import { TokenContext } from "../App";
import { downloadSleep } from "./DownloadUtils";

const DownloadSleepData = () => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const token = useContext(TokenContext);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        downloadSleep(token, startDate, endDate);
    }

    return (
        <div className="bg-slate-800 p-4 rounded-md">
            <h2 className="text-2xl mb-6">Download sleep data</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="start-date">
                        <span className="text-gray-200 text-xl">Start date</span>
                    </label>
                    <input
                        type="text"
                        className="input"
                        name="start-date"
                        value={startDate}
                        placeholder="yyyy-mm-dd"
                        onChange={(e) => setStartDate(e.target.value)}
                    ></input>
                </div>
                <div className="mb-4">
                    <label htmlFor="end-date">
                        <span className="text-gray-200 text-xl">End date</span>
                    </label>
                    <input
                        type="text"
                        className="input"
                        name="end-date"
                        value={endDate}
                        placeholder="yyyy-mm-dd"
                        onChange={(e) => setEndDate(e.target.value)}
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
                        Download
                    </button>
                </div>

            </form>
        </div>
    )
}

export default DownloadSleepData;