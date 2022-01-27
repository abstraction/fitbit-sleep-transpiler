const addSeconds = require('date-fns/addSeconds');
const formatDistanceStrict = require('date-fns/formatDistanceStrict');
const format = require('date-fns/format');
const axios = require('axios').default;
const fs = require('fs');
const path = require('path');

const startDate = '2022-01-07';
const endDate = '2022-01-27';
const accessToken = require('./config').accessToken;

const resolve = (p) => path.join(__dirname, p);

const getMilleniumDiff = (date) => {
  const milDay = new Date('1999-12-31'); // 2000-01-01 (To include end date)
  return parseInt(
    formatDistanceStrict(date, milDay, {
      roundingMethod: 'floor', // by defaut 23:45 of a day will be converted to the next day
      unit: 'day',
    })
  );
};

// TODO - Remove date-fns
const wrangleData = (data) => {
  const sleep = [];
  const awake = ['restless', 'awake', 'wake'];
  for (let sleepData of data) {
    const day = [];
    const sleepTimeline = sleepData.levels.data;
    for (let sleepBlock of sleepTimeline) {
      if (!awake.includes(sleepBlock.level)) {
        const startBlock = new Date(sleepBlock.dateTime + 'Z'); // "Z" to make timezone offset complete otherwise js will infer timezone
        const endBlock = new Date(addSeconds(startBlock, sleepBlock.seconds));
        const daysFromMillenium = getMilleniumDiff(startBlock);
        let startTime = startBlock.toJSON().slice(11, 16); // date-fns format parses in my timezone, experiment later
        let endTime = endBlock.toJSON().slice(11, 16);
        const block = [daysFromMillenium, startTime, endTime];
        day.push(block);
      }
    }
    sleep.unshift(day);
  }
  return sleep;
};

// TODO - edge case of midnight conflict is yet to be fix
/**
 * [ 8045, '22:12', '00:01' ],
 * [ 8046, '00:01', '00:53' ],
 */

const fixTimeline = (sleep) => {
  let fixed = [];
  let flag = true;
  sleep = sleep.flat();
  let i = 0;
  while (flag) {
    flag = false;
    while (sleep.length > 1 && sleep[1] !== undefined) {
      if (sleep[0][1] === sleep[0][2]) sleep.splice(0, 1);
      else if (sleep[0][0] === sleep[1][0] && sleep[0][2] === sleep[1][1]) {
        fixed.push([sleep[0][0], sleep[0][1], sleep[1][2]]);
        if (i > 0) fixed.splice(0, 2);
        sleep.splice(0, 2);
        flag = true;
      } else {
        fixed.push(sleep[0]);
        if (i > 0) fixed.splice(0, 1);
        sleep.splice(0, 1);
      }
    }
    sleep = [...fixed];
    i++;
  }
  return fixed;
};

axios
  .get(
    `https://api.fitbit.com/1.2/user/-/sleep/date/${startDate}/${endDate}.json`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  .then((res) => {
    const sleep = wrangleData(res.data.sleep);

    fs.writeFileSync(
      path.join(__dirname, '../data/fixed.csv'),
      fixTimeline(sleep).join('\n')
    );
  })
  .catch((e) => {
    console.log('Error getting sleep data');
  });
