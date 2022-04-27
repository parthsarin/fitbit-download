import forceDownload from './Generic';

interface RestingHeartData {
  date: string;
  value: number;
}

export default async function downloadRestingHeart(
  token: string,
  startDate: string, endDate: string,
  giveFeedback: (message: string) => void
) {
  let output: RestingHeartData[] = [];

  await fetch(`https://api.fitbit.com/1/user/-/activities/heart/date/${startDate}/${endDate}.json`, {
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
    json['activities-heart'].forEach((day: any) => {
      output.push({
        date: day.dateTime,
        value: day.value.restingHeartRate,
      });
    })
  })
  .catch(err => {
    alert(`Error: ${err.message}`);
  })

  if (output.length > 0) {
    forceDownload(output, `rhr_daily_${startDate}_${endDate}.csv`);
  } else {
    giveFeedback("There is no data for the specified date range");
  }
}