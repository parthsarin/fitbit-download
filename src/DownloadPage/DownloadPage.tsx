import { useState } from "react";

import BackButton from "../BackButton";
import Loading from "../Loading";
import {PageState} from "../MainPage";

import DownloadIntradayData from "./DownloadComponents/DownloadIntradayData";
import DownloadRestingData from "./DownloadComponents/DownloadRestingData";
import DownloadSleepData from "./DownloadComponents/DownloadSleepData";
import styles from './DownloadPage.module.css';

interface DownloadPageProps {
    setPageState: (ps: PageState) => void,
}

const DownloadPage = ({ setPageState }: DownloadPageProps) => {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <>
        { loading ? <Loading /> : null }
        <BackButton onClick={() => setPageState(PageState.MainPage)} />
        <div className={`w-4/5 absolute top-20 pb-20 ${styles['download-page']}`}>
            <h1 className="text-3xl mb-4">Download data</h1>
            <DownloadIntradayData setLoading={setLoading} />
            <DownloadSleepData />
            <DownloadRestingData />
        </div>
        </>
    );
}

export default DownloadPage;