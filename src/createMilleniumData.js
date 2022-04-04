/* eslint-disable no-param-reassign */
// Couln't think of a flaw reassigning can have in our use case
import { parseISO, isEqual } from 'date-fns';

const createMilleniumData = data => {
  const areEqual = (one, two) => {
    const dateOne = parseISO(one);
    const dateTwo = parseISO(two);
    return isEqual(dateOne, dateTwo);
  };
  // Captures cases where there is a change in sleep stage
  const isSleepContinued = (end, nextStart) => areEqual(end, nextStart);
  const isSleepLengthZero = (start, end) => areEqual(start, end);
  let i = 0;
  let hasBadSleepEpisode = false;
  while (i < data.length) {
    if (typeof data[i + 1] === 'undefined') break;
    const isZeroSecond = isSleepLengthZero(
      data[i].sleepEpisodeStart,
      data[i].sleepEpisodeEnd
    );
    if (isZeroSecond) {
      data.splice(i, 1);
      hasBadSleepEpisode = true;
    }
    const hasStartEndConflict = isSleepContinued(
      data[i].sleepEpisodeEnd,
      data[i + 1].sleepEpisodeStart
    );
    // Merge cases where sleep continues but sleep stage changes
    if (hasStartEndConflict) {
      data[i].sleepEpisodeEnd = data[i + 1].sleepEpisodeEnd;
      data.splice(i + 1, 1);
      hasBadSleepEpisode = true;
    }
    // When block is carried to next date just continue the prev block
    // if (data[i].isCarry) {
    //   console.log(data[i], data[i + 1]);
    // }
    i += 1;
  }
  // What if the resolved bad sleep episode has conflicts with prev or next
  // sleep episode? Recurse just to be sure
  if (hasBadSleepEpisode) createMilleniumData(data);
  return data;
};

export default createMilleniumData;
