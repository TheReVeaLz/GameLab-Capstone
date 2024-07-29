const notificationRepo = require('../repositories/notification')
const ApplicationError = require("../../config/errors/ApplicationError.js");


const create = async (userId, payload) => {
  try {
    const data = {
      userId: userId,
      title: payload.title,
      message: payload.message
    }
    return await notificationRepo.create(data)

  } catch (error) {
    throw new ApplicationError(`Failed to create notification ${error.message}`, 500);
  }
}

const findAllForUser = async (userId) => {
  try {
    return notificationRepo.findAllForUser(userId)
  } catch (err) {
    throw new ApplicationError(`Failed to get user notification ${error.message}`, 500);
  }
}

const destroyForUser = async (userId, id) => {
  try {
    return notificationRepo.destroyForUser(userId, id)
  } catch (err) {
    throw new ApplicationError(`Failed to get user notification ${error.message}`, 500);
  }
}

module.exports = {
  create,
  findAllForUser,
  destroyForUser
}