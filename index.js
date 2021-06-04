import {
  getInfoOfWeek,
  getHoursInWork,
  getHoursWorkedWithoutBreaks,
  getHoursToPay,
} from './modules/dayjsExtends.js';

const dayInWork = {
  //if date will be empty string date = today
  date: '2021-06-6',
  startTimeOfWork: '7',
  endTimeOfWork: '19',
};

console.log(getInfoOfWeek(dayInWork.date)); //?

console.log(
  'Łącznie przebywałeś w pracy:',
  getHoursInWork(dayInWork.startTimeOfWork, dayInWork.endTimeOfWork, false),
); //?
console.log(
  'Godziny za które dostaniesz wynagrodzenie:',
  getHoursWorkedWithoutBreaks(dayInWork.startTimeOfWork, dayInWork.endTimeOfWork, false),
); //?
console.log(
  'Nadgodziny:',
  getHoursToPay(dayInWork.startTimeOfWork, dayInWork.endTimeOfWork, dayInWork.date),
);
