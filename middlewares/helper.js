function DayUTC(hour = 0, min = 0, sec = 0) {
    return new Date().setUTCHours(hour, min, sec);
}

function DayLocal(hour = 0, min = 0, sec = 0) {
    return new Date().setHours(hour, min, sec);
}

function GetHoursDifference(date1, date2) {
    return parseInt(Math.abs(date1 - date2) / 36e5)
}

function GetDaysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

module.exports = {
    DayUTC,
    DayLocal,
    GetHoursDifference,
    GetDaysInMonth
}