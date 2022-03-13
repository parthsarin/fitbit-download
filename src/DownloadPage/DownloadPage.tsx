import { useContext } from "react";

import { TokenContext } from "../App";
import BackButton from "../BackButton";
import {PageState} from "../MainPage";

import DownloadSleepData from "./DownloadSleepData";
import styles from './DownloadPage.module.css';

interface DownloadPageProps {
    setPageState: (ps: PageState) => void,
}

const DownloadPage = ({ setPageState }: DownloadPageProps) => {
    const token = useContext(TokenContext);

    return (
        <>
        <BackButton onClick={() => setPageState(PageState.MainPage)} />
        <div className={`w-4/5 absolute top-20 pb-20 ${styles['download-page']}`}>
            <h1 className="text-3xl mb-4">Download data</h1>
            <DownloadSleepData />
        </div>
        </>
    );
}

export default DownloadPage;