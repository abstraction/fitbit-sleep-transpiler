import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createCSV = data => {
  let status;
  const currDate = new Date().toISOString().substring(0, 10); // yyyy-MM-dd
  const writeStream = fs.createWriteStream(
    path.join(__dirname, `../data/${currDate}.csv`)
  );

  data.forEach(el => {
    const day = el.millieniumDay;
    // getting HH:mm from yyyy-MM-ddTHH:mm:ss.SSSZ
    // sadly SM doesn't take ss
    const start = el.sleepEpisodeStart.slice(11, 16);
    const end = el.sleepEpisodeEnd.slice(11, 16);
    const row = `${day},${start},${end}`;
    writeStream.write(`${row}\n`);
  });

  // the finish event is emitted when all data has been flushed from the stream
  writeStream.on('finish', () => {
    console.log('✅ Done.');
  });

  // handle the errors on the write process
  writeStream.on('error', err => {
    throw new Error('Error.');
  });

  // close the stream
  writeStream.end();
};

export default createCSV;
