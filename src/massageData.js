import { formatDistanceStrict, addSeconds, parseISO } from 'date-fns';

const sleepDuration = (time, duration) => {
  const sleepEpisodeStart = new Date(`${time}Z`).toISOString();
  // TODO Why does Date keep picking my timezone even when I'm explicitly
  // passing nothing? Have to do .toISOString() as a fix
  const sleepEpisodeEnd = addSeconds(
    parseISO(sleepEpisodeStart),
    duration
  ).toISOString();
  const isCarry =
    sleepEpisodeEnd.substring(0, 10) !== sleepEpisodeStart.substring(0, 10);
  const day = sleepEpisodeStart.substring(0, 10);
  const getMillieniumDay = date => {
    const mil = formatDistanceStrict(parseISO(date), parseISO('1999-12-31'), {
      roundingMethod: 'floor',
      unit: 'day',
    });
    return parseInt(mil, 10); // coz 'formatDistanceStrict' returns 'x days'
  };
  const millieniumDay = getMillieniumDay(day);
  return {
    day,
    millieniumDay,
    sleepEpisodeStart,
    sleepEpisodeEnd,
    isCarry,
  };
};

// TODO Airbnb style guide slapped my hand when I used for...of and for...in
// Why? coz apparently this ^ breaks their immutability rule
// Do MTI for this (https://github.com/airbnb/javascript#iterators-and-generators)
const massageData = data => {
  const levels = ['restless', 'awake', 'wake'];
  const dayLog = Object.values(data);
  const newData = []; // array because order will matter now
  dayLog.forEach(log => {
    const sleepEps = log.levels.data; // Zooming in on levels and ignoring rest
    sleepEps.forEach(episode => {
      if (!levels.includes(episode.level)) {
        const result = sleepDuration(episode.dateTime, episode.seconds);
        newData.push(result);
      }
    });
  });
  return newData;
};

export default massageData;
