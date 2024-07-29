/**
* Set passed Date object to UTC hour.
* Default clock is 00:00:00.
* 
* @overload
* @param {(Date)} date
* @param {(number)} [hours]
* @param {(number)} [minutes]
* @param {(number)} [seconds]
*//**
* Create new Date object and set hour it's object to UTC hour.
* Default clock is 00:00:00.
*
* @overload
* @param {(number)} [hours]
* @param {(number)} [minutes]
* @param {(number)} [seconds]
*/
function DayUTC() {
    for(let i = 0; i < 5; i++)
        arguments[i] = typeof(arguments[i]) === "undefined" ? 0 : arguments[i];
    
    if (arguments[0].constructor.name === "Date")
        return arguments[0].setUTCHours(arguments[1], arguments[2], arguments[3], 0);
    
    return new Date().setUTCHours(arguments[0], arguments[1], arguments[2], 0);
}

/**
* Set passed Date object to local hour.
* Default clock is 00:00:00.
* 
* @overload
* @param {(Date)} date
* @param {(number)} [hours]
* @param {(number)} [minutes]
* @param {(number)} [seconds]
*//**
* Create new Date object and set hour it's object to local hour.
* Default clock is 00:00:00.
*
* @overload
* @param {(number)} [hours]
* @param {(number)} [minutes]
* @param {(number)} [seconds]
*/
function DayLocal() {
    for(let i = 0; i < 5; i++)
        arguments[i] = typeof(arguments[i]) === "undefined" ? 0 : arguments[i];
    
    if (arguments[0].constructor.name === "Date")
        return arguments[0].setHours(arguments[1], arguments[2], arguments[3], 0);
    
    return new Date().setHours(arguments[0], arguments[1], arguments[2], 0);
}

function GetTimeDifference(date1, date2) {
    return Math.abs(date1 - date2);
}

function GetDaysDifference(date1, date2) {
    return parseInt(GetTimeDifference(date1, date2) / 864e5);
}

function GetHoursDifference(date1, date2) {
    return parseInt(GetTimeDifference(date1, date2) / 36e5);
}

function GetDaysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

module.exports = {
    DayUTC,
    DayLocal,
    GetTimeDifference,
    GetDaysDifference,
    GetHoursDifference,
    GetDaysInMonth
}