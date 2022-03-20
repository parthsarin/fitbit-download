import moment, { Moment } from 'moment';
import forceDownload from './Generic';

const SleepGranularity  = [
  "Daily",
  "Hourly"
]

interface SleepData {
  datetime?: string;
  date?: string;
  event: string;
  value: number;
}

async function downloadSleepDaily(
  token: string,
  startDate: string | Moment, endDate: string | Moment,
  giveFeedback: (message: string) => void
) {
  let output: Array<SleepData> = [];

  await fetch(`https://api.fitbit.com/1.2/user/-/sleep/date/${startDate}/${endDate}.json`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  })
  .then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  })
  .then(json => {
    if ('success' in json && !json.success) {
      alert(json.errors[0].message);
      return;
    }

    console.log(json);
    json.sleep.forEach((day: any) => {
      for (const evt of ["minutesAsleep", "minutesToFallAsleep", "minutesAwake", "timeInBed"]) {
        output.push({
          date: day.dateOfSleep,
          event: evt,
          value: day[evt],
        });
      }
    })
  })
  .catch((err: Error) => {
    alert(`Error: ${err.message}`);
  })

  if (output.length > 0) {
    forceDownload(output, `sleep_daily_${startDate}_${endDate}.csv`);
  } else {
    giveFeedback("There is no data for the specified date range");
  }
}

async function downloadSleepHourly(
  token: string,
  startDate: string | Moment, endDate: string | Moment,
  giveFeedback: (message: string) => void
) {
  let output: Array<SleepData> = [];

  await fetch(`https://api.fitbit.com/1.2/user/-/sleep/date/${startDate}/${endDate}.json`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  })
  .then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  })
  .then(json => {
    if ('success' in json && !json.success) {
      alert(json.errors[0].message);
      return;
    }

    json.sleep.forEach((day: any) => {
      const granular = day.levels.data;
      granular.forEach((log: any) => {
        output.push({
          datetime: moment(log.dateTime).format("YYYY-MM-DD HH:MM"),
          event: log.level,
          value: log.seconds,
        });
      })
    })
  })
  .catch(err => {
    alert(`Error: ${err.message}`);
  })

  if (output.length > 0) {
    forceDownload(output, `sleep_hourly_${startDate}_${endDate}.csv`);
  } else {
    giveFeedback("There is no data for the specified date range");
  }
}


function downloadSleep(
  token: string,
  startDate: string | Moment, endDate: string | Moment,
  granularity: string,
  giveFeedback: (message: string) => void
) {
  if (granularity === SleepGranularity[0]) {
    downloadSleepDaily(token, startDate, endDate, giveFeedback);
  }

  else if (granularity === SleepGranularity[1]) {
    downloadSleepHourly(token, startDate, endDate, giveFeedback);
  }
}

export default downloadSleep;
export { SleepGranularity };