const { Op } = require("sequelize");
const UserRepo = require("../app/repositories/user");
const PresenceRepo = require("../app/repositories/presence");
const PayslipRepo = require("../app/repositories/payslip");
const Helper = require("./helper")

async function GetDashboardInfo(req, res) {
    try {
        const today = new Date();
        const users = await UserRepo.findAll();
        const presences = await PresenceRepo.findAll({ presenceDate: Helper.DayLocal() });
        const payslips = await PayslipRepo.findAll({ periodEnd: { [Op.gte]: new Date(today.getFullYear(), today.getMonth(), 1) }});
        
        const totalPresence = presences.reduce((total, item) => (item.checkIn ? total + 1 : total), 0);
        
        const data = {};
        data.admins = users.reduce((total, item) => (item.privilege === "ADMIN" ? total + 1 : total), 0);
        data.employees = users.length;
        data.presencePercentage = String(+((totalPresence / users.length) * 100).toFixed(1)) + "%";
        data.leaves = presences.reduce((total, item) => (item.status == "LEAVE" ? total + 1 : total), 0);
        data.thisMonthSalary = payslips.reduce((total, item) => (total + item.netWorth), 0);
        
        res.json({ status: "OK", message: "Dashboard data retrieved.", data });
    } catch (err) {
        res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
    }
}

module.exports = {
    GetDashboardInfo
}