"use strict";
exports.__esModule = true;
var dayjsExtends_js_1 = require("./modules/dayjsExtends.js");
var dayInWork = {
    //if date will be empty string date = today
    date: '2021-06-6',
    startTimeOfWork: '7',
    endTimeOfWork: '19'
};
var hoursInWeek = [
    { date: '2021-06-07', startTimeOfWork: '7', endTimeOfWork: '19' },
    { date: '2021-06-08', startTimeOfWork: '7', endTimeOfWork: '19' },
    { date: '2021-06-09', startTimeOfWork: '7', endTimeOfWork: '19' },
    { date: '2021-06-10', startTimeOfWork: '7', endTimeOfWork: '19' },
    { date: '2021-06-11', startTimeOfWork: '7', endTimeOfWork: '22' },
    { date: '2021-06-12', startTimeOfWork: '7', endTimeOfWork: '19' },
    { date: '2021-06-13', startTimeOfWork: '7', endTimeOfWork: '19' },
];
console.log(dayjsExtends_js_1.getInfoOfWeek(dayInWork.date)); //?
console.log('Łącznie przebywałeś w pracy:', dayjsExtends_js_1.getHoursInWork(dayInWork.startTimeOfWork, dayInWork.endTimeOfWork, false)); //?
// console.log(
//   'Godziny za które dostaniesz wynagrodzenie:',
//   getHoursWorkedWithoutBreaks(dayInWork.startTimeOfWork, dayInWork.endTimeOfWork, false),
// ); //?
// console.log(
//   'Nadgodziny:',
//   getHoursToPay(dayInWork.startTimeOfWork, dayInWork.endTimeOfWork, dayInWork.date),
// );
// console.dir(getHoursToPayInWeek(hoursInWeek), { depth: 5 });
