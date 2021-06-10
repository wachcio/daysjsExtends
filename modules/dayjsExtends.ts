import dayjs from 'dayjs';
import 'dayjs/locale/pl.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import updateLocale from 'dayjs/plugin/updateLocale.js';
import AdvancedFormat from 'dayjs/plugin/advancedFormat.js';
import WeekOfYear from 'dayjs/plugin/weekOfYear.js';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import duration from 'dayjs/plugin/duration.js';
import objectSupport from 'dayjs/plugin/objectSupport.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import weekday from 'dayjs/plugin/weekday.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(updateLocale);
dayjs.extend(AdvancedFormat);
dayjs.extend(WeekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(duration);
dayjs.extend(objectSupport);
dayjs.extend(relativeTime);
dayjs.extend(weekday);

dayjs.tz.setDefault('Europe/Warsaw');
dayjs.locale('pl');

const timeStringToFloat = (time: string): number => {
  const hoursMinutes: string[] = time.split(/[.:]/);
  const hours: number = parseInt(hoursMinutes[0], 10);
  const minutes: number = hoursMinutes[1] ? parseFloat(hoursMinutes[1]) : 0;
  return hours + minutes / 60;
};
//Returns an object that contains the provided date (string or Date object)
const getInfoOfWeek = (date: string | Date = new Date()): object | boolean => {
  //If user not provide data set today
  if (date === '') date = new Date();
  //If user provide wrong date return false
  if (dayjs(date).toString() == 'Invalid Date') return false;
  interface GetInfoOfWeek {
    daysWhitWeekNames: Array<object>;
    days: Array<string>;
    weekNumber: number;
    dayNumber: number;
    dayName: string;
  }
  const obj: GetInfoOfWeek = {
    daysWhitWeekNames: [],
    days: [],
    weekNumber: -1,
    dayNumber: -1,
    dayName: '',
  };

  for (let i = 0; i <= 6; i++) {
    const dayOfWeek = dayjs(dayjs(date).startOf('w').add(i, 'day')).format('DD MMMM YYYY');
    const dayName = dayjs(dayjs(date).startOf('w').add(i, 'day')).format('dddd');

    obj.daysWhitWeekNames.push({ [dayName]: dayOfWeek });
  }

  for (let i = 0; i <= 6; i++) {
    obj.days.push(dayjs(dayjs(date).startOf('w').add(i, 'day')).format('DD MMMM YYYY'));
  }

  obj.weekNumber = dayjs(date).isoWeek();
  obj.dayNumber = dayjs(date).isoWeekday();
  obj.dayName = dayjs(date).format('dddd');

  return obj;
};

interface ParseHourObj {
  hour: number;
  minute: number;
}

const parseHour = (h: string): ParseHourObj => {
  if (typeof h != 'string')
    return {
      hour: -1,
      minute: -1,
    };
  // if (!Number(h)) return false;
  if (h.includes(':')) {
    const arr = h.split(':');

    if (typeof +arr[0] != 'number' && typeof +arr[1] != 'number')
      return {
        hour: -1,
        minute: -1,
      };

    return {
      hour: +arr[0],
      minute: +arr[1],
    };
  }
  if (typeof +h != 'number')
    return {
      hour: -1,
      minute: -1,
    };
  return {
    hour: +h,
    minute: 0,
  };
};
//Houer in work (start time, end time, object-negative value or string-pozitive value)
const getHoursInWork = (
  startTimeOfWorkStr: string,
  endTimeOfWorkStr: string,
  returnObject: boolean | number = 0,
): number | object | boolean => {
  const startTimeOfWork: ParseHourObj = parseHour(startTimeOfWorkStr);
  const endTimeOfWork: ParseHourObj = parseHour(endTimeOfWorkStr);
  if (!startTimeOfWork || !endTimeOfWork) return false;
  if (dayjs(startTimeOfWork.hour).hour() > dayjs(endTimeOfWork['hour']).hour()) return false;

  const a = dayjs.duration({
    hours: dayjs(startTimeOfWork['hour']).hour(),
    minutes: dayjs(startTimeOfWork['minute']).minute(),
  });
  const b = dayjs.duration({
    hours: dayjs(endTimeOfWork['hour']).hour(),
    minutes: dayjs(endTimeOfWork['minute']).minute(),
  });

  const sub = b.subtract(a);

  if (returnObject) return sub;
  return timeStringToFloat(`${sub.hours()}.${sub.minutes()}`);
};
//Hours for which you will be paid (start time, end time, object-negative value or string-pozitive value)
// const getHoursWorkedWithoutBreaks = (startTimeOfWork, endTimeOfWork, returnObject = 0) => {
//   let hoursWorked = getHoursInWork(startTimeOfWork, endTimeOfWork, 1);
//   if (!hoursWorked) return false;

//   if (dayjs(parseHour(endTimeOfWork).hour).hour() >= 12) {
//     const a = dayjs.duration({
//       hours: dayjs(hoursWorked).hours(),
//       minutes: dayjs(hoursWorked).minutes(),
//     });
//     const b = dayjs.duration({ minutes: 30 });

//     hoursWorked = a.subtract(b);
//   }

//   if (parseHour(endTimeOfWork).hour() == 11 && parseHour(endTimeOfWork).minute() > 30) {
//     const a = dayjs.duration({ hours: hoursWorked.hours(), minutes: hoursWorked.minutes() + 30 });
//     const b = dayjs.duration({ minutes: parseHour(endTimeOfWork).minute() });

//     hoursWorked = a.subtract(b);
//   }
//   if (returnObject) return hoursWorked;
//   // return hoursWorked.format('HH:mm');
//   return timeStringToFloat(`${hoursWorked.hours()}.${hoursWorked.minutes()}`);
// };

// const getHoursToPay = (startTimeOfWork, endTimeOfWork, date = new Date()) => {
//   let hoursWorked = getHoursInWork(startTimeOfWork, endTimeOfWork, true);
//   if (!hoursWorked) return false;

//   //If user not provide data set today
//   if (date === '') date = new Date();
//   //If user provide wrong date return false
//   if (dayjs(date).$d == 'Invalid Date') return false;

//   const dayOfWeek = dayjs(date).isoWeekday();

//   let obj = {
//     dayOfWeek,
//     date: dayjs(date).format('YYYY-MM-DD'),
//     dayName: dayjs(date).format('dddd'),
//   };
//   //godziny normalne 7-15 w dzień powszedni
//   //50% po 15, 100% po 21
//   //sobota po 12 50%
//   //niedziela 100%

//   const allHours = getHoursWorkedWithoutBreaks(startTimeOfWork, endTimeOfWork, false);

//   if (dayOfWeek <= 5) {
//     const maxNormalTime = 7.5;
//     const maxOvertimeTime50 = 6;
//     // console.log('poniedziałek do piątku');

//     // console.log(allHours);

//     if (allHours <= maxNormalTime) {
//       obj = {
//         ...obj,
//         ...{ normalTime: allHours, overTime50: 0, overTime100: 0, allHours },
//       };
//     } else if (allHours <= maxNormalTime + maxOvertimeTime50) {
//       obj = {
//         ...obj,
//         ...{
//           normalTime: maxNormalTime,
//           overTime50: allHours - maxNormalTime,
//           overTime100: 0,
//           allHours,
//         },
//       };
//     } else if (allHours > maxNormalTime + maxOvertimeTime50) {
//       obj = {
//         ...obj,
//         ...{
//           normalTime: maxNormalTime,
//           overTime50: maxOvertimeTime50,
//           overTime100: allHours - maxNormalTime - maxOvertimeTime50,
//           allHours,
//         },
//       };
//     }
//   } else if (dayOfWeek === 6) {
//     const maxOvertimeTime50 = 4.5;
//     // console.log('sobota');
//     if (allHours <= maxOvertimeTime50) {
//       obj = {
//         ...obj,
//         ...{ normalTime: 0, overTime50: allHours, overTime100: 0, allHours },
//       };
//     } else if (allHours > maxOvertimeTime50) {
//       obj = {
//         ...obj,
//         ...{
//           normalTime: 0,
//           overTime50: allHours - maxOvertimeTime50,
//           overTime100: allHours,
//           allHours,
//         },
//       };
//     }
//   } else if (dayOfWeek === 7) {
//     // console.log('niedziela');
//     obj = {
//       ...obj,
//       ...{ normalTime: 0, overTime50: 0, overTime100: allHours, allHours },
//     };
//   }

//   return obj;
// };

// const getHoursToPayInWeek = hoursInWeek => {
//   // console.log(hoursInWeek);

//   if (typeof hoursInWeek != 'array') false;
//   if (hoursInWeek.lenght < 7) false;

//   let arr = [];

//   arr.push(
//     hoursInWeek.map(e => {
//       return getHoursToPay(e.startTimeOfWork, e.endTimeOfWork, e.date);
//     }),
//   );

//   let obj = {
//     week: { ...arr },
//     sumary: {
//       normalTime: 0,
//       overTime50: 0,
//       overTime100: 0,
//       allHours: 0,
//     },
//   };

//   arr[0].map(e => {
//     obj.sumary.normalTime += e.normalTime;
//     obj.sumary.overTime50 += e.overTime50;
//     obj.sumary.overTime100 += e.overTime100;
//     obj.sumary.allHours += e.allHours;
//     return obj.sumary;
//   });
//   return obj;
// };

export {
  getInfoOfWeek,
  getHoursInWork,
  // getHoursWorkedWithoutBreaks,
  // getHoursToPay,
  // getHoursToPayInWeek,
};
