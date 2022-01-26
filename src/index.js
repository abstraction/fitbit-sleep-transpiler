const fs = require('fs');
const path = require('path');
const axios = require('axios').default;
const addSeconds = require('date-fns/addSeconds');
const formatDistanceStrict = require('date-fns/formatDistanceStrict');
const format = require('date-fns/format');

const dataCSV = [];
const dataPath = path.join(__dirname, '../src/');
const log = (...args) => console.log(args);
const milleniumDay = '1999-12-31'; // 2000-01-01

const dataBuffer = fs.readFileSync(dataPath + 'data.json');
const dataJSON = JSON.parse(dataBuffer);

for (sleep of dataJSON.sleep) {
  const dayLog = [];
  for (sleepLog of sleep.levels.data) {
    const timestamp = sleepLog.dateTime;
    const sleepState = sleepLog.level;
    const sleepDuration = sleepLog.seconds;

    if (sleepState !== 'restless' && sleepState !== 'awake' && sleepState !== 'wake') {
      const milleniumDate = parseInt(
        formatDistanceStrict(new Date(milleniumDay), new Date(timestamp), {
          unit: 'day',
        })
      );
      const sleepStartHhMm = format(new Date(timestamp), 'HH:mm');
      const sleepEnd = addSeconds(new Date(timestamp), sleepDuration);
      const sleepEndHhMm = format(new Date(sleepEnd), 'HH:mm');
      const row = milleniumDate + ',' + sleepStartHhMm + ',' + sleepEndHhMm;
      dayLog.push(row);
    }
  }
  dataCSV.unshift(dayLog);
}

// const dataCSVb = dataCSV;

// const fixTimeline = () => {
//   newTimeline = [];
//   for(day of dataCSVb) {
//     // day.forEach((block, idx, day) => {
//     for(let log in day){
//       const segment = day[log].split(',');
//       const prevSegment = (day[log - 1] !== undefined) ? day[log - 1].split(',') : null;
//       if (prevSegment !== null && segment[1] === prevSegment[2] && segment[0] === prevSegment[0]) {
//         day.shift();
//         newTimeline.push(segment[0] + ',' + prevSegment[1] + ',' + segment[2]);
//       } else {
//         newTimeline.push(day[log]);
//         // day.shift();
//       }
//     }
//     // })
//   }
//   return dataCSVb;
// }



// const sleepCSV = fixTimeline();

const tempCSVf = () => {
  newTimeline = [];
  for(day of dataCSV) {
    day.forEach((block) => {
      newTimeline.push(block);
    })
  }
  return newTimeline;
}

const tempCSV = tempCSVf();

// console.log(dataCSV);
// fs.writeFileSync(path.join(__dirname, '../src/sleepCSV.csv'), sleepCSV.join('\n'));
fs.writeFileSync(path.join(__dirname, '../src/tempCSV.csv'), tempCSV.join('\n'));

