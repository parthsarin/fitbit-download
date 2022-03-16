import moment, { Moment } from 'moment';
import forceDownload from './Generic';

interface DateTimeAlpha {
  date: string,
  time: string,
  [key: string]: string
}


function hash(x: DateTimeAlpha): string {
  return `${x.date} ${x.time}`;
}


/**
 * Merges arrays matching their date and time values
 * 
 * @param a The array of DateTimeAlpha arrays
 * @param ignoreBlank If true, only uses the keys from heart rate
 * @returns The merged array
 */
function merge(a: Array<DateTimeAlpha[]>, ignoreBlank: boolean): DateTimeAlpha[] {
  let datetimes: Set<string> = new Set();
  
  // Convert each of the DateTimeAlpha arrays into a map
  const hashedArrays = a.map(ls => {
    let o: any = {};

    ls.forEach(x => {
      o[hash(x)] = x;          // Index each of the objects by the datetime hash
      datetimes.add(hash(x));  // Add the hash to the overall keys list
    });

    return o;
  });

  // Merge the arrays
  let output: DateTimeAlpha[] = [];
  datetimes.forEach(datetime => {
    const allMeasurements = hashedArrays.map(o => o[datetime]);
    output.push(
      allMeasurements.reduce(
        (a: DateTimeAlpha, b: DateTimeAlpha) => ({ ...a, ...b })
      )
    );
  });

  // Optionally remove the keys that are blank
  if (ignoreBlank) {
    output = output.filter(x => 'heart' in x);
  }
  
  return output;
}


async function downloadIntraday(
  token: string,
  startDate: string | Moment, endDate: string | Moment,
  resources: string[],
  ignoreBlank: boolean,
  giveFeedback: (message: string) => void,
  setLoading: (loading: boolean) => void
) {
  setLoading(true);
  startDate = moment(startDate, "YYYY-MM-DD");
  endDate = moment(endDate, "YYYY-MM-DD");
  let output: Array<any> = [];
  let failed: string[] = [];

  for (var m = startDate.clone(); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
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
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          throw new Error(`${res.status} ${res.statusText}`);
        }
      })
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
      })
      .catch(err => {
        failed.push(`${r}, ${date}, ${err}`);
      });

      dayOutput.push(resOutput);
    }

    // Merge together the day
    dayOutput = merge(dayOutput, ignoreBlank);
    output = output.concat(dayOutput);
  }

  if (output.length > 0) {
    forceDownload(output, `activity_${startDate.format('YYYY-MM-DD')}_${endDate.format('YYYY-MM-DD')}.csv`);
  } else {
    giveFeedback("There is no data for the specified date range");
  }

  if (failed.length > 0) {
    giveFeedback(`Failed to download: ${failed.join(', ')}`);
  }
  setLoading(false);
}

export default downloadIntraday;