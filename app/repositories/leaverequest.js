const { LeaveRequest } = require("../models/index.js");

async function findAll() {
    return await LeaveRequest.findAll();
}

async function create(body) {
    return await LeaveRequest.create(body);
}

/**
* Filter the course with specific condition.
* [filter] - Object to specifying the condition (Ex. { id: 1 })
*/
async function findOne(filter) {
    if (typeof filter !== "object" && filter != null) return new Error('filter is not an object');
    return await LeaveRequest.findOne({ where: filter });
}

async function update(payload) {
    return await LeaveRequest.update(payload);
}

async function findByPk(id) {
    return await LeaveRequest.findByPk(id);
}

module.exports = {
    findAll,
    create,
    findOne,
    findByPk,
    update
}