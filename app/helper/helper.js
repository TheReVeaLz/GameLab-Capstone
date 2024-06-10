function Today(hour = 0, min = 0, sec = 0) {
    return new Date().setHours(hour, min, sec);
}

function GetHoursDifference(date1, date2) {
    return parseInt(Math.abs(date1 - date2) / 36e5)
}

module.exports = {
    Today,
    GetHoursDifference
}