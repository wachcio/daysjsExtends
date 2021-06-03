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

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(updateLocale);
dayjs.extend(AdvancedFormat);
dayjs.extend(WeekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(duration);
dayjs.extend(objectSupport);
dayjs.extend(relativeTime);

dayjs.tz.setDefault('Europe/Warsaw');
dayjs.locale('pl');

export default {
  getInfoOfWeek(date = new Date()) {
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
  getHoursWorked(startHour, endHour, returnObject = 0) {
    startHour = this.parseHour(startHour);
    endHour = this.parseHour(endHour);
    if (!startHour || !endHour) return false;
    if (startHour.$H > endHour.$H) return false;

    const a = dayjs.duration({ hours: startHour.$H, minutes: startHour.$m });
    const b = dayjs.duration({ hours: endHour.$H, minutes: endHour.$m });

    const sub = b.subtract(a);

    if (returnObject) return sub;
    return sub.format('HH:mm');
  },
};
