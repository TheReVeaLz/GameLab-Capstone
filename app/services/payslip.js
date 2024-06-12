const payslipRepo = require('../repositories/payslip');
const presenceRepository = require('../repositories/presence');
const ApplicationError = require('../../config/errors/ApplicationError');
const Helper = require('../../middlewares/helper')
const { Op } = require('sequelize');

const parsePresence = (payload, presenceData) => {
    const ret = {};
    const presentDays = {};
    payload.periodStart = new Date(payload.periodStart);
    payload.periodEnd = new Date(payload.periodEnd);
    Helper.DayLocal(payload.periodStart), Helper.DayLocal(payload.periodEnd);

    const totalDays = Helper.GetDaysDifference(payload.periodStart, payload.periodEnd);

    const _items = Object.values(presenceData);
    for(let i = 0; i < _items.length; i++) {
        const _item = _items[i].get({ plain: true });
        ret[_item.userId] = ret[_item.userId] ? ret[_item.userId] : {
            userId: _item.userId,
            periodStart: payload.periodStart,
            periodEnd: payload.periodEnd,
            salary: _item.User.JobRole.salary,
            overtimeBonus: 0,
            deduction: _item.User.JobRole.absenceDeduction * totalDays,
            netWorth: _item.User.JobRole.salary
        };
        
        presentDays[_item.userId] = presentDays[_item.userId] ? presentDays[_item.userId] + 1 : 1;
        
        switch (_item.status) {
            case "ONTIME":
                ret[_item.userId].overtimeBonus += _item.User.JobRole.overtimeBonus * _item.overtime;
            case "LEAVE":
                ret[_item.userId].deduction -= _item.User.JobRole.absenceDeduction;
                break;
            
            default:
                console.log(`Status value is ${_item.status}`);
                break;
        }

        ret[_item.userId].netWorth = ret[_item.userId].salary - ret[_item.userId].deduction + ret[_item.userId].overtimeBonus;
    }
    
    return Object.values(ret);
}

const findAll = async (payload = {}) => {
    try {
        return await payslipRepo.findAll(payload);
    } catch (err) {
        throw new ApplicationError(`Failed to get the data. ${err.message}`);
    }
}

const getPayslip = async (payload) => {
    try {
        return await payslipRepo.findOne();
    } catch (err) {
        throw new ApplicationError(`Failed to get the data. ${err.message}`);
    }
}

const generatePayslips = async (payload) => {
    try {
        const { periodStart, periodEnd } = payload;
        if (!periodStart || !periodEnd)
            throw new Error("Please fill period start and end.");

        const presenceInfo = await presenceRepository.findAll({
            presenceDate: { [Op.gte]: periodStart, [Op.lte]: periodEnd }
        });
        
        return await payslipRepo.bulkCreate(parsePresence(payload, presenceInfo));
    } catch (err) {
        throw new ApplicationError(`Failed to get the data. ${err.message}`);
    }
}

module.exports = {
    findAll,
    getPayslip,
    generatePayslips
}