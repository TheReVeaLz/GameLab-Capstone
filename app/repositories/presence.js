const { Presence, User, JobRole } = require('../models');

async function create(body) {
    return await Presence.create(body);
}

async function bulkCreate(body) {
    return await Presence.bulkCreate(body);
}

const getPresenceById = async (id) => {
    return await Presence.findByPk(id, {
        include: [User]
    });
}

/**
* Filter the course with specific condition.
* [filter] - Object to specifying the condition (Ex. { id: 1 })
*/
async function findAll(filter) {
    if (typeof filter !== "object" && filter != null) return new Error('filter is not an object');
    return await Presence.findAll({
        where: filter,
        include: [
            {
                model: User,
                include: [JobRole]
            }
        ]
    });
}

/**
* Filter the course with specific condition.
* [filter] - Object to specifying the condition (Ex. { id: 1 })
*/
async function findOne(filter) {
    if (typeof filter !== "object" && filter != null) return new Error('filter is not an object');
    return await Presence.findOne({ where: filter, include: [User] });
}

async function update(payload) {
    return await Presence.update(payload);
}

const getAllPresences = async () => {
    return await Presence.findAll({
        include: [User]
    });
}

const getAllPresencesUser = async (userId) => {
    return await Presence.findAll({
        where: { userId: userId },
        include: [User]
    });
}

const updatePresence = async (id, data) => {
    const presence = await Presence.findByPk(id);
    if (!presence) {
        throw new Error('Presence not found');
    }
    return await presence.update(data);
}

const deletePresence = async (id) => {
    const presence = await Presence.findByPk(id);
    if (!presence) {
        throw new Error('Presence not found');
    }
    await presence.destroy();
}

module.exports = {
    create,
    bulkCreate,
    getPresenceById,
    findAll,
    findOne,
    update,
    getAllPresences,
    updatePresence,
    deletePresence,
    getAllPresencesUser
};
