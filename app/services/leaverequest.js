const LeaveRequestRepo = require('../repositories/leaverequest');
const NotificationService = require('../services/notification');
const ApplicationError = require('../../config/errors/ApplicationError');

const findAll = async (payload = {}) => {
    try {
        return await LeaveRequestRepo.findAll(payload);
    } catch (err) {
        throw new ApplicationError(`Failed to get the data. ${err.message}`);
    }
}

const findOne = async (payload) => {
    try {
        return await LeaveRequestRepo.findOne();
    } catch (err) {
        throw new ApplicationError(`Failed to get the data. ${err.message}`);
    }
}

const findByPk = async (id) => {
    try {
        return await LeaveRequestRepo.findByPk(id);
    } catch (err) {
        throw new ApplicationError(`Failed to get the data. ${err.message}`);
    }
}

const create = async (payload) => {
    try {
        return await LeaveRequestRepo.create(payload);
    } catch (err) {
        throw new ApplicationError(`Failed to make new data. ${err.message}`);
    }
}

const update = async (payload) => {
    try {
        return await LeaveRequestRepo.update(payload);
    } catch (err) {
        throw new ApplicationError(`Failed to update data. ${err.message}`,  err.statusCode || 500);
    }
}

const confirmLeave = async (leaveReq, status) => {
    try {
        const ret = await leaveReq.update({ status });
        await NotificationService.create(ret.userId, { title: 'Leave Request', message: `Your leave request has been ${status.toLowerCase()}` });
        
        return ret;
    } catch (err) {
        throw new ApplicationError(`Failed to update data. ${err.message}`,  err.statusCode || 500);
    }
}

module.exports = {
    findAll,
    findOne,
    findByPk,
    create,
    update,
    confirmLeave
}