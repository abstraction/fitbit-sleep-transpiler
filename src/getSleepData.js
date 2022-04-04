import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import secrets from '../../../.config/secrets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const token = secrets.FITBIT_TOKEN;

const getSleepData = async (start, end) => {
  try {
    const response = await fetch(
      `https://api.fitbit.com/1.2/user/-/sleep/date/${start}/${end}.json`,
      {
        headers: { Authorization: 'Bearer ' + token },
      }
    );
    const data = await response.json(); // JSON.parse basically
    const currDate = new Date().toISOString().substring(0, 10); // YYYY-mm-DD
    try {
      await fs.writeFile(
        path.join(__dirname, `../data/${start}_${end}.json`),
        JSON.stringify(data)
      );
    } catch (e) {
      throw new Error(e);
    }
    return data;
  } catch (e) {
    throw new Error(e);
  }
};

export default getSleepData;
