const axios = require("axios").default;
const fs = require("fs");
const path = require("path");

const startDate = '2022-01-07';
const endDate = '2022-01-23';
const accessToken = require('./config').accessToken;

/**
 * TODO
 * - Fix timeline block conflict
 */

const milleniumDayDiff = (date) => {
  // Millenium Day: 1st Jan 2000
  const milleniumDay = new Date('1999-12-31');  // Y-M-D NOT D-M-Y or M-D-Y
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  date = new Date(date);
  const dateDiff = Date.parse(milleniumDay) - Date.parse(date);
  return Math.ceil(Math.abs( dateDiff / millisecondsInDay));
}

const sleepDuration = (dateTime, seconds) => {
  const formatTime = (time) => {
      const getHours = ('0' + time.getHours()).slice(-2);
      const getMinutes = ('0' + time.getMinutes()).slice(-2);
      const getSeconds = ('0' + time.getSeconds()).slice(-2);
      return getHours + ':' + getMinutes + ':' + getSeconds;
  }
  const sleepStart = new Date(dateTime);
  const sleepEnd = new Date(Date.parse(sleepStart) + (seconds * 1000))
  return [formatTime(sleepStart), formatTime(sleepEnd)]
}

axios.get(`https://api.fitbit.com/1.2/user/-/sleep/date/${startDate}/${endDate}.json`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
.then((res) => {
  let csvData = [];
  for(let sleepData of res.data.sleep){
    for(let sleep of sleepData.levels.data) {
      let {dateTime, level, seconds} = sleep;
      if(level !== 'restless' && level !== 'awake' && level !== 'wake'){
        let row = milleniumDayDiff(dateTime) + ',' + sleepDuration(dateTime, seconds)[0] + ',' + sleepDuration(dateTime, seconds)[1];
        console.log(row);
        csvData.push(row);
      }
    }
  }
  fs.writeFileSync(path.join(__dirname, '../src/sleep.csv'), csvData.join('\n'));
})