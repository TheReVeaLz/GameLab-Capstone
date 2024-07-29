const { JobRole } = require("../models/index.js");
const { Op } = require('sequelize');

/**
* Filter the course with specific condition.
* [filter] - Object to specifying the condition (Ex. { id: 1 })
*/
async function findAll(filter) {
    if (typeof filter !== "object" && filter != null) return new Error('filter is not an object');
    return await JobRole.findAll({ where: {
        ...filter,
        order: {
            [Op.not]: 0
        }
    } });
}

async function create(body) {
    return await JobRole.create(body);
}

/**
* Filter the course with specific condition.
* [filter] - Object to specifying the condition (Ex. { id: 1 })
*/
async function findOne(filter) {
    if (typeof filter !== "object" && filter != null) return new Error('filter is not an object');
    return await JobRole.findOne({ where: filter });
}

async function update(payload, filter) {
    if (typeof filter !== "object" && filter != null) return new Error('filter is not an object');
    const [_, data] = await JobRole.update(payload, { where: filter, returning: true });
    return data;
}

async function findByPk(id) {
    return await JobRole.findByPk(id);
}

module.exports = {
    findAll,
    create,
    findOne,
    findByPk,
    update
}