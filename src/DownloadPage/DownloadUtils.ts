import moment, { Moment } from 'moment';
import Papa from 'papaparse';

interface SleepData {
    datetime: string;
    event: string;
    value: number;
}


const forceDownload = (data: Array<any>, filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

async function downloadSleep(token: string, startDate: string | Moment, endDate: string | Moment) {
    let output: Array<SleepData> = [];

    await fetch(`https://api.fitbit.com/1.2/user/-/sleep/date/${startDate}/${endDate}.json`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        }
    })
    .then(res => res.json())
    .then(json => {
        if ('success' in json && !json.success) {
            alert(json.errors[0].message);
            return;
        }

        // Summary information at the top
        json.sleep.forEach((day: any) => {
            for (const evt of ["minutesAsleep", "minutesToFallAsleep", "minutesAwake", "timeInBed"]) {
                output.push({
                    datetime: day.dateOfSleep,
                    event: evt,
                    value: day[evt],
                });
            }

            const granular = day.levels.data;
            granular.forEach((log: any) => {
                output.push({
                    datetime: moment(log.dateTime).format("YYYY-MM-DD HH:MM:SS A"),
                    event: log.level,
                    value: log.seconds,
                });
            })
        })
    })

    forceDownload(output, `sleep_${startDate}_${endDate}.csv`);
}

export { downloadSleep };