const { where } = require('sequelize');
const { Presence, User } = require('../models');

const createPresence = async (data) => {
    return await Presence.create(data);
}

const getPresenceById = async (id) => {
    return await Presence.findByPk(id, {
        include: [User]
    });
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
    createPresence,
    getPresenceById,
    getAllPresences,
    updatePresence,
    deletePresence,
    getAllPresencesUser
};
