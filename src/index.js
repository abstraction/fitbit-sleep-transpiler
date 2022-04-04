import getSleepData from './getSleepData.js';
import massageData from './massageData.js';
import createMilleniumData from './createMilleniumData.js';
import createCSV from './createCSV.js';

console.log('♻️ Fetching data from Fitbit...');
getSleepData('2022-01-23', '2022-04-04')
  .then(dataJSON => {
    console.log('✨ Doing stuff with the data...');
    const data = dataJSON.sleep.reverse(); // sort dates in ascending order
    const newData = massageData(data);
    const withMillenium = createMilleniumData(newData);
    console.log('🤞 Attempting to write results to file...');
    const result = createCSV(withMillenium);
    if (result) console.log('✅ Done!');
  })
  .catch(err => {
    throw new Error(
      'An error has occured while fetching data from Fitbit',
      err
    );
  });
