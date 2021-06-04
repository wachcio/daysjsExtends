import dayjsExtends from './modules/dayjsExtends.js';

const dayInWork = {
  //if date will be empty string date = today
  date: '2021-06-4',
  startTimeOfWork: '7',
  endTimeOfWork: '15:00',
};

// console.log(dayjsExtends.getInfoOfWeek(dayInWork.date)); //?

console.log(
  'Łącznie przebywałeś w pracy:',
  dayjsExtends.getHoursWorked(dayInWork.startTimeOfWork, dayInWork.endTimeOfWork, false),
); //?
console.log(
  'Godziny za które dostaniesz wynagrodzenie:',
  dayjsExtends.getHoursWorkedWithoutBreaks(
    dayInWork.startTimeOfWork,
    dayInWork.endTimeOfWork,
    false,
  ),
); //?
console.log(
  'Nadgodziny:',
  dayjsExtends.getOvertimes(dayInWork.startTimeOfWork, dayInWork.endTimeOfWork, dayInWork.date),
);
