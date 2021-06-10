"use strict";
exports.__esModule = true;
exports.getHoursInWork = exports.getInfoOfWeek = void 0;
var dayjs_1 = require("dayjs");
require("dayjs/locale/pl.js");
var utc_js_1 = require("dayjs/plugin/utc.js");
var timezone_js_1 = require("dayjs/plugin/timezone.js");
var updateLocale_js_1 = require("dayjs/plugin/updateLocale.js");
var advancedFormat_js_1 = require("dayjs/plugin/advancedFormat.js");
var weekOfYear_js_1 = require("dayjs/plugin/weekOfYear.js");
var isoWeek_js_1 = require("dayjs/plugin/isoWeek.js");
var duration_js_1 = require("dayjs/plugin/duration.js");
var objectSupport_js_1 = require("dayjs/plugin/objectSupport.js");
var relativeTime_js_1 = require("dayjs/plugin/relativeTime.js");
var weekday_js_1 = require("dayjs/plugin/weekday.js");
dayjs_1["default"].extend(utc_js_1["default"]);
dayjs_1["default"].extend(timezone_js_1["default"]);
dayjs_1["default"].extend(updateLocale_js_1["default"]);
dayjs_1["default"].extend(advancedFormat_js_1["default"]);
dayjs_1["default"].extend(weekOfYear_js_1["default"]);
dayjs_1["default"].extend(isoWeek_js_1["default"]);
dayjs_1["default"].extend(duration_js_1["default"]);
dayjs_1["default"].extend(objectSupport_js_1["default"]);
dayjs_1["default"].extend(relativeTime_js_1["default"]);
dayjs_1["default"].extend(weekday_js_1["default"]);
dayjs_1["default"].tz.setDefault('Europe/Warsaw');
dayjs_1["default"].locale('pl');
var timeStringToFloat = function (time) {
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseFloat(hoursMinutes[1]) : 0;
    return hours + minutes / 60;
};
//Returns an object that contains the provided date (string or Date object)
var getInfoOfWeek = function (date) {
    var _a;
    if (date === void 0) { date = new Date(); }
    //If user not provide data set today
    if (date === '')
        date = new Date();
    //If user provide wrong date return false
    if (dayjs_1["default"](date).toString() == 'Invalid Date')
        return false;
    var obj = {
        daysWhitWeekNames: [],
        days: [],
        weekNumber: null,
        dayNumber: null,
        dayName: null
    };
    for (var i = 0; i <= 6; i++) {
        var dayOfWeek = dayjs_1["default"](dayjs_1["default"](date).startOf('w').add(i, 'day')).format('DD MMMM YYYY');
        var dayName = dayjs_1["default"](dayjs_1["default"](date).startOf('w').add(i, 'day')).format('dddd');
        obj.daysWhitWeekNames.push((_a = {}, _a[dayName] = dayOfWeek, _a));
    }
    for (var i = 0; i <= 6; i++) {
        obj.days.push(dayjs_1["default"](dayjs_1["default"](date).startOf('w').add(i, 'day')).format('DD MMMM YYYY'));
    }
    obj.weekNumber = dayjs_1["default"](date).isoWeek();
    obj.dayNumber = dayjs_1["default"](date).isoWeekday();
    obj.dayName = dayjs_1["default"](date).format('dddd');
    return obj;
};
exports.getInfoOfWeek = getInfoOfWeek;
var parseHour = function (h) {
    if (typeof h != 'string')
        return {
            hour: -1,
            minute: -1
        };
    // if (!Number(h)) return false;
    if (h.includes(':')) {
        var arr = h.split(':');
        if (typeof +arr[0] != 'number' && typeof +arr[1] != 'number')
            return {
                hour: -1,
                minute: -1
            };
        return {
            hour: +arr[0],
            minute: +arr[1]
        };
    }
    if (typeof +h != 'number')
        return {
            hour: -1,
            minute: -1
        };
    return {
        hour: +h,
        minute: 0
    };
};
//Houer in work (start time, end time, object-negative value or string-pozitive value)
var getHoursInWork = function (startTimeOfWorkStr, endTimeOfWorkStr, returnObject) {
    if (returnObject === void 0) { returnObject = 0; }
    var startTimeOfWork = parseHour(startTimeOfWorkStr);
    var endTimeOfWork = parseHour(endTimeOfWorkStr);
    if (!startTimeOfWork || !endTimeOfWork)
        return false;
    if (dayjs_1["default"](startTimeOfWork['hour']).hour() > dayjs_1["default"](endTimeOfWork['hour']).hour())
        return false;
    var a = dayjs_1["default"].duration({
        hours: dayjs_1["default"](startTimeOfWork['hour']).hour(),
        minutes: dayjs_1["default"](startTimeOfWork['minute']).minute()
    });
    var b = dayjs_1["default"].duration({
        hours: dayjs_1["default"](endTimeOfWork['hour']).hour(),
        minutes: dayjs_1["default"](endTimeOfWork['minute']).minute()
    });
    var sub = b.subtract(a);
    if (returnObject)
        return sub;
    return timeStringToFloat(sub.hours() + "." + sub.minutes());
};
exports.getHoursInWork = getHoursInWork;
