const notificationRepo = require('../repositories/notification')
const ApplicationError = require("../../config/errors/ApplicationError.js");


const create = async (userId,payload) => {
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

module.exports = { create }