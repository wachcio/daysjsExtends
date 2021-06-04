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

export default {
  timeStringToFloat(time) {
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  },
  //Returns an object that contains the provided date (string or Date object)
  getInfoOfWeek(date = new Date()) {
    //If user not provide data set today
    if (date === '') date = new Date();
    //If user provide wrong date return false
    if (dayjs(date).$d == 'Invalid Date') return false;
    const obj = {};
    obj.daysWhitWeekNames = [];
    obj.days = [];

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
  },

  parseHour(h) {
    if (typeof h != 'string') return false;
    // if (!Number(h)) return false;
    if (h.includes(':')) {
      const arr = h.split(':');

      if (typeof Number(arr[0]) != 'number' && typeof Number(arr[1]) != 'number') return false;

      return dayjs({
        hour: Number(arr[0]),
        minute: Number(arr[1]),
      });
    }
    if (typeof Number(h) != 'number') return false;
    return dayjs({
      hour: Number(h),
      minute: 0,
    });
  },
  //Houer in work (start time, end time, object-negative value or string-pozitive value)
  getHoursWorked(startTimeOfWork, endTimeOfWork, returnObject = 0) {
    startTimeOfWork = this.parseHour(startTimeOfWork);
    endTimeOfWork = this.parseHour(endTimeOfWork);
    if (!startTimeOfWork || !endTimeOfWork) return false;
    if (startTimeOfWork.$H > endTimeOfWork.$H) return false;

    const a = dayjs.duration({ hours: startTimeOfWork.$H, minutes: startTimeOfWork.$m });
    const b = dayjs.duration({ hours: endTimeOfWork.$H, minutes: endTimeOfWork.$m });

    const sub = b.subtract(a);

    if (returnObject) return sub;
    return `${sub.hours()}.${sub.minutes()}`;
  },
  //Hours for which you will be paid (start time, end time, object-negative value or string-pozitive value)
  getHoursWorkedWithoutBreaks(startTimeOfWork, endTimeOfWork, returnObject = 0) {
    let hoursWorked = this.getHoursWorked(startTimeOfWork, endTimeOfWork, 1);
    if (!hoursWorked) return false;

    if (this.parseHour(endTimeOfWork).hour() >= 12) {
      const a = dayjs.duration({ hours: hoursWorked.hours(), minutes: hoursWorked.minutes() });
      const b = dayjs.duration({ minutes: 30 });

      hoursWorked = a.subtract(b);
    }

    if (this.parseHour(endTimeOfWork).hour() == 11 && this.parseHour(endTimeOfWork).minute() > 30) {
      const a = dayjs.duration({ hours: hoursWorked.hours(), minutes: hoursWorked.minutes() + 30 });
      const b = dayjs.duration({ minutes: this.parseHour(endTimeOfWork).minute() });

      hoursWorked = a.subtract(b);
    }
    if (returnObject) return hoursWorked;
    // return hoursWorked.format('HH:mm');
    return `${hoursWorked.hours()}.${hoursWorked.minutes()}`;
  },
  getOvertimes(startTimeOfWork, endTimeOfWork, date = new Date()) {
    let hoursWorked = this.getHoursWorked(startTimeOfWork, endTimeOfWork, true);
    if (!hoursWorked) return false;

    //If user not provide data set today
    if (date === '') date = new Date();
    //If user provide wrong date return false
    if (dayjs(date).$d == 'Invalid Date') return false;

    const dayOfWeek = dayjs(date).isoWeekday();

    let obj = {
      dayOfWeek,
      date: dayjs(date).format('YYYY-MM-DD'),
      dayName: dayjs(date).format('dddd'),
    };

    const maxNormalTime = 7.5;
    const maxOvertimeTime50 = 4;

    if (dayOfWeek <= 5) {
      console.log('poniedziałek do piątku');
      const allHours = this.timeStringToFloat(
        this.getHoursWorkedWithoutBreaks(startTimeOfWork, endTimeOfWork, false),
      );

      console.log(allHours);

      if (allHours <= maxNormalTime) {
        obj = {
          ...obj,
          ...{ normalTime: allHours, overTime50: 0, overTime100: 0, allHours },
        };
      } else if (allHours <= maxNormalTime + maxOvertimeTime50) {
        obj = {
          ...obj,
          ...{
            normalTime: maxNormalTime,
            overTime50: allHours - maxNormalTime,
            overTime100: 0,
            allHours,
          },
        };
      } else if (allHours > maxNormalTime + maxOvertimeTime50) {
        obj = {
          ...obj,
          ...{
            normalTime: maxNormalTime,
            overTime50: maxOvertimeTime50,
            overTime100: allHours - maxNormalTime - maxOvertimeTime50,
            allHours,
          },
        };
      }
    } else if (dayOfWeek === 6) {
      console.log('sobota');
    } else if (dayOfWeek === 7) {
      console.log('niedziela');
    }

    return obj;
  },
};
