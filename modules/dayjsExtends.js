"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.getHoursToPayInWeek = exports.getHoursToPay = exports.getHoursWorkedWithoutBreaks = exports.getHoursInWork = exports.getInfoOfWeek = void 0;
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
    var minutes = hoursMinutes[1] ? +parseInt(hoursMinutes[1], 10).toFixed(2) : 0;
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
        return false;
    // if (!Number(h)) return false;
    if (h.includes(':')) {
        var arr = h.split(':');
        if (typeof Number(arr[0]) != 'number' && typeof Number(arr[1]) != 'number')
            return false;
        return dayjs_1["default"]({
            hour: +arr[0],
            minute: +arr[1]
        });
    }
    if (typeof Number(h) != 'number')
        return false;
    return dayjs_1["default"]({
        hour: Number(h),
        minute: 0
    });
};
//Houer in work (start time, end time, object-negative value or string-pozitive value)
var getHoursInWork = function (startTimeOfWork, endTimeOfWork, returnObject) {
    if (returnObject === void 0) { returnObject = 0; }
    startTimeOfWork = parseHour(startTimeOfWork);
    endTimeOfWork = parseHour(endTimeOfWork);
    if (!startTimeOfWork || !endTimeOfWork)
        return false;
    if (startTimeOfWork.$H > endTimeOfWork.$H)
        return false;
    var a = dayjs_1["default"].duration({ hours: startTimeOfWork.$H, minutes: startTimeOfWork.$m });
    var b = dayjs_1["default"].duration({ hours: endTimeOfWork.$H, minutes: endTimeOfWork.$m });
    var sub = b.subtract(a);
    if (returnObject)
        return sub;
    return timeStringToFloat(sub.hours() + "." + sub.minutes());
};
exports.getHoursInWork = getHoursInWork;
//Hours for which you will be paid (start time, end time, object-negative value or string-pozitive value)
var getHoursWorkedWithoutBreaks = function (startTimeOfWork, endTimeOfWork, returnObject) {
    if (returnObject === void 0) { returnObject = 0; }
    var hoursWorked = getHoursInWork(startTimeOfWork, endTimeOfWork, 1);
    if (!hoursWorked)
        return false;
    if (parseHour(endTimeOfWork).hour() >= 12) {
        var a = dayjs_1["default"].duration({ hours: hoursWorked.hours(), minutes: hoursWorked.minutes() });
        var b = dayjs_1["default"].duration({ minutes: 30 });
        hoursWorked = a.subtract(b);
    }
    if (parseHour(endTimeOfWork).hour() == 11 && parseHour(endTimeOfWork).minute() > 30) {
        var a = dayjs_1["default"].duration({ hours: hoursWorked.hours(), minutes: hoursWorked.minutes() + 30 });
        var b = dayjs_1["default"].duration({ minutes: parseHour(endTimeOfWork).minute() });
        hoursWorked = a.subtract(b);
    }
    if (returnObject)
        return hoursWorked;
    // return hoursWorked.format('HH:mm');
    return timeStringToFloat(hoursWorked.hours() + "." + hoursWorked.minutes());
};
exports.getHoursWorkedWithoutBreaks = getHoursWorkedWithoutBreaks;
var getHoursToPay = function (startTimeOfWork, endTimeOfWork, date) {
    if (date === void 0) { date = new Date(); }
    var hoursWorked = getHoursInWork(startTimeOfWork, endTimeOfWork, true);
    if (!hoursWorked)
        return false;
    //If user not provide data set today
    if (date === '')
        date = new Date();
    //If user provide wrong date return false
    if (dayjs_1["default"](date).$d == 'Invalid Date')
        return false;
    var dayOfWeek = dayjs_1["default"](date).isoWeekday();
    var obj = {
        dayOfWeek: dayOfWeek,
        date: dayjs_1["default"](date).format('YYYY-MM-DD'),
        dayName: dayjs_1["default"](date).format('dddd')
    };
    //godziny normalne 7-15 w dzień powszedni
    //50% po 15, 100% po 21
    //sobota po 12 50%
    //niedziela 100%
    var allHours = getHoursWorkedWithoutBreaks(startTimeOfWork, endTimeOfWork, false);
    if (dayOfWeek <= 5) {
        var maxNormalTime = 7.5;
        var maxOvertimeTime50 = 6;
        // console.log('poniedziałek do piątku');
        // console.log(allHours);
        if (allHours <= maxNormalTime) {
            obj = __assign(__assign({}, obj), { normalTime: allHours, overTime50: 0, overTime100: 0, allHours: allHours });
        }
        else if (allHours <= maxNormalTime + maxOvertimeTime50) {
            obj = __assign(__assign({}, obj), {
                normalTime: maxNormalTime,
                overTime50: allHours - maxNormalTime,
                overTime100: 0,
                allHours: allHours
            });
        }
        else if (allHours > maxNormalTime + maxOvertimeTime50) {
            obj = __assign(__assign({}, obj), {
                normalTime: maxNormalTime,
                overTime50: maxOvertimeTime50,
                overTime100: allHours - maxNormalTime - maxOvertimeTime50,
                allHours: allHours
            });
        }
    }
    else if (dayOfWeek === 6) {
        var maxOvertimeTime50 = 4.5;
        // console.log('sobota');
        if (allHours <= maxOvertimeTime50) {
            obj = __assign(__assign({}, obj), { normalTime: 0, overTime50: allHours, overTime100: 0, allHours: allHours });
        }
        else if (allHours > maxOvertimeTime50) {
            obj = __assign(__assign({}, obj), {
                normalTime: 0,
                overTime50: allHours - maxOvertimeTime50,
                overTime100: allHours,
                allHours: allHours
            });
        }
    }
    else if (dayOfWeek === 7) {
        // console.log('niedziela');
        obj = __assign(__assign({}, obj), { normalTime: 0, overTime50: 0, overTime100: allHours, allHours: allHours });
    }
    return obj;
};
exports.getHoursToPay = getHoursToPay;
var getHoursToPayInWeek = function (hoursInWeek) {
    // console.log(hoursInWeek);
    if (typeof hoursInWeek != 'array')
        false;
    if (hoursInWeek.lenght < 7)
        false;
    var arr = [];
    arr.push(hoursInWeek.map(function (e) {
        return getHoursToPay(e.startTimeOfWork, e.endTimeOfWork, e.date);
    }));
    var obj = {
        week: __assign({}, arr),
        sumary: {
            normalTime: 0,
            overTime50: 0,
            overTime100: 0,
            allHours: 0
        }
    };
    arr[0].map(function (e) {
        obj.sumary.normalTime += e.normalTime;
        obj.sumary.overTime50 += e.overTime50;
        obj.sumary.overTime100 += e.overTime100;
        obj.sumary.allHours += e.allHours;
        return obj.sumary;
    });
    return obj;
};
exports.getHoursToPayInWeek = getHoursToPayInWeek;
