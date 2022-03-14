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

async function downloadSleep(
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

  if (output.length > 0) {
    forceDownload(output, `sleep_${startDate}_${endDate}.csv`);
  } else {
    giveFeedback("There is no data for the specified date range");
  }
}


interface DateTimeAlpha {
  date: string,
  time: string,
  [key: string]: string
}

/**
 * Merges two arrays by matching their date and time values
 * Warning: This function is slow. There's probably a better way to implement
 * this, but I'm feeling lazy right now.
 * 
 * @param a The first array to merge
 * @param b The second array to merge
 * @returns The merged array
 */
function merge(a: DateTimeAlpha[], b: DateTimeAlpha[]): DateTimeAlpha[] {
  // Get the keys
  let keys: Set<{ date: string, time: string }> = new Set();

  a.forEach((x: DateTimeAlpha) => {
    keys.add({ date: x.date, time: x.time });
  })

  b.forEach((x: DateTimeAlpha) => {
    keys.add({ date: x.date, time: x.time });
  })

  // Merge the arrays
  let output: DateTimeAlpha[] = [];
  keys.forEach((x: { date: string, time: string }) => {
    let a_match = a.find((y: DateTimeAlpha) => y.date === x.date && y.time === x.time);
    let b_match = b.find((y: DateTimeAlpha) => y.date === x.date && y.time === x.time);

    // Combine both of the matches, if they exist
    let merged = {};
    if (a_match) {
      merged = { ...a_match };
    } 
    if (b_match) {
      merged = { ...merged, ...b_match };
    }

    if (merged) {
      output.push(merged as DateTimeAlpha);
    }
  })

  return output;

}


async function downloadIntraday(
  token: string,
  startDate: string | Moment, endDate: string | Moment,
  resources: string[],
  giveFeedback: (message: string) => void,
  setLoading: (loading: boolean) => void
) {
  setLoading(true);
  startDate = moment(startDate, "YYYY-MM-DD");
  endDate = moment(endDate, "YYYY-MM-DD");
  let output: Array<any> = [];

  for (var m = startDate; m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
    let dayOutput: Array<any> = []; // merge together days
    const date = m.format('YYYY-MM-DD');

    for (const r of resources) {
      let resOutput: Array<any> = [];

      await fetch(
        `https://api.fitbit.com/1/user/-/activities/${r}/date/${m.format('YYYY-MM-DD')}/1d/1min.json`, 
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      )
      .then(res => res.json())
      .then(json => {
        if ('success' in json && !json.success) {
          alert(json.errors[0].message);
          return;
        }

        json[`activities-${r}-intraday`].dataset.forEach((x: any) => {
          const val = x.value;
          delete x.value;

          resOutput.push({
            ...x,
            date,
            [r]: val
          });
        })
      });
      console.log(r, date, resOutput);

      dayOutput.push(resOutput);
    }

    // Merge together the day
    // TODO: Doesn't work (more complicated merging needed -- match date & time)
    dayOutput = dayOutput.reduce(merge)
    output = output.concat(dayOutput);
  }

  if (output.length > 0) {
    forceDownload(output, `intraday_${startDate.format('YYYY-MM-DD')}_${endDate.format('YYYY-MM-DD')}.csv`);
  } else {
    giveFeedback("There is no data for the specified date range");
  }
  setLoading(false);
}

export { downloadSleep, downloadIntraday };