const { Notification } = require('../models/index')

const create = async (payload) => {
  return Notification.create(payload)
}

const findAllForUser = async (userId) => {
  return Notification.findAll({ 
    where: { userId }, 
    // limit: 10,
    order: [ ["id", "DESC"] ]
  })
}

const destroyForUser = async (userId, id) => {
  return Notification.destroy({
    where: { userId, id }
  })
}

module.exports = {
  create,
  findAllForUser,
  destroyForUser
}