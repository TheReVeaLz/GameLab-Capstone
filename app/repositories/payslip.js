const { Payslip, User } = require("../models/index.js");

/**
* Filter the course with specific condition.
* [filter] - Object to specifying the condition (Ex. { id: 1 })
*/
async function findAll(filter) {
    if (typeof filter !== "object" && filter != null) return new Error('filter is not an object');
    return await Payslip.findAll({ where: filter, include: User });
}

async function create(body) {
    return await Payslip.create(body);
}

/**
* Filter the course with specific condition.
* [filter] - Object to specifying the condition (Ex. { id: 1 })
*/
async function findOne(filter) {
    if (typeof filter !== "object" && filter != null) return new Error('filter is not an object');
    return await Payslip.findOne({ where: filter });
}

async function update(payload) {
    return await Payslip.update(payload);
}

async function findByPk(id) {
    return await Payslip.findByPk(id);
}

module.exports = {
    findAll,
    create,
    findOne,
    findByPk,
    update
}