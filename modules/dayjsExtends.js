import dayjs from 'dayjs';
import 'dayjs/locale/pl.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import updateLocale from 'dayjs/plugin/updateLocale.js';
import AdvancedFormat from 'dayjs/plugin/advancedFormat.js';
import WeekOfYear from 'dayjs/plugin/weekOfYear.js';
import isoWeek from 'dayjs/plugin/isoWeek.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(updateLocale);
dayjs.extend(AdvancedFormat);
dayjs.extend(WeekOfYear);
dayjs.extend(isoWeek);

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
};
