const _ = require('lodash');
const dayjs = require('dayjs');

const createLessons = ({
  title, days, firstDate, lessonsCount, lastDate,
}) => {
  const sortDays = days.sort();
  const startDate = dayjs(Date.parse(firstDate));
  const maxCountLessons = 300;
  const maxFinishDate = startDate.add(1, 'year');
  let currentDate = startDate;
  let createdLessonsCount = 0;

  const lessons = [];

  if (!_.isUndefined(lessonsCount)) {
    while (
      currentDate <= maxFinishDate
      && createdLessonsCount < maxCountLessons
      && createdLessonsCount < lessonsCount
    ) {
      sortDays.forEach((day) => {
        const date = currentDate.set('day', day);
        if (
          createdLessonsCount >= lessonsCount
          || createdLessonsCount >= maxCountLessons
          || date > maxFinishDate
        ) return;
        if (date < startDate) return;

        createdLessonsCount += 1;
        lessons.push({
          title,
          date: date.toISOString(),
        });
      });

      currentDate = currentDate.add(1, 'week').set('day', 0);
    }
    return lessons;
  }

  const finishDate = dayjs(Date.parse(lastDate));
  while (
    currentDate <= finishDate
    && createdLessonsCount < maxCountLessons
    && currentDate <= maxFinishDate
  ) {
    sortDays.forEach((day) => {
      const date = currentDate.set('day', day);
      if (
        date > finishDate
        || createdLessonsCount >= maxCountLessons
        || date > maxFinishDate
      ) return;

      if (date < startDate) return;

      createdLessonsCount += 1;
      lessons.push({
        title,
        date: date.toISOString(),
      });
    });
    currentDate = currentDate.add(1, 'week').set('day', 0);
  }
  return lessons;
};

module.exports = createLessons;
