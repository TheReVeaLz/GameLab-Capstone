const JobRole = require('../repositories/jobrole');
const ApplicationError = require('../../config/errors/ApplicationError');

const findAll = async (payload = {}) => {
    try {
        return await JobRole.findAll(payload);
    } catch (err) {
        throw new ApplicationError(`Failed to get the data. ${err.message}`);
    }
}

const findOne = async (payload) => {
    try {
        return await JobRole.findOne();
    } catch (err) {
        throw new ApplicationError(`Failed to get the data. ${err.message}`);
    }
}

const create = async (payload, isAdmin) => {
    try {
        const { order, roleName, salary, overtimeBonus, absenceDeduction } = payload;

        if (!roleName || !salary) {
            throw new ApplicationError(`Please input role name and salary.`, 400);
        }
        
        return await JobRole.create({
            order,
            roleName,
            salary,
            overtimeBonus,
            absenceDeduction
        });
    } catch (err) {
        throw new ApplicationError(`Failed to create data. ${err.message}`, err.statusCode || 500);
    }
}

const updateOne = async (id, payload) => {
    try {
        payload.id ? delete payload.id : void 0;

        const role = await JobRole.findOne({ id });
        return await role.update(payload);
    } catch (err) {
        throw new ApplicationError(`Failed to update data. ${err.message}`,  err.statusCode || 500);
    }
}

const destroyOne = async (id) => {
    try {
        const role = await JobRole.findOne({ id });
        return await role.destroy();
    } catch (err) {
        throw new ApplicationError(`Failed to destroy data. ${err.message}`,  err.statusCode || 500);
    }
}

module.exports = {
    findAll,
    findOne,
    create,
    updateOne,
    destroyOne
}