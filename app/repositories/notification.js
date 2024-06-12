const { Notification } = require('../models/index')

const create = async (payload)=> {
  return Notification.create(payload)
}


module.exports = {create}