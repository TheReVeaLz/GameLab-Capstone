const presenceRepository = require('../repositories/presence');
const ApplicationError = require('../../config/errors/ApplicationError');
const createPresence = async (data) => {
  try {
    // Get the current time in WIB (Western Indonesia Time)
    const today = new Date();
    today.setHours(today.getHours() + 7); // Adjust the time to WIB

    // Assign the WIB time to the presenceDate and checkIn fields
    data.presenceDate = today;
    data.checkIn = today;

    // Check if the check-in time is late
    const allowedCheckInTime = new Date(today);
    allowedCheckInTime.setHours(8, 0, 0); // Set the allowed check-in time to 08:00:00 WIB
    
    // Determine the status based on the check-in time
    let status;
    if (today > allowedCheckInTime) {
      status = 'LATE';
    } else {
      status = 'ONTIME';
    }
    data.status = status;

    // Save the presence data
    return await presenceRepository.createPresence(data);
  } catch (err) {
    throw new ApplicationError(`Failed to create presence. ${err.message}`, 400);
  }
};


const getPresenceById = async (id) => {
    try {
        const presence = await presenceRepository.getPresenceById(id);
        if (!presence) {
            throw new ApplicationError('Presence not found', 404);
        }
        
        return presence;
    } catch (err) {
        throw new ApplicationError(`Failed to get presence. ${err.message}`, 404);
    }
}

const getAllPresences = async () => {
    try {
        return await presenceRepository.getAllPresences();
    } catch (err) {
        throw new ApplicationError(`Failed to get all presences. ${err.message}`, 400);
    }
}
const getAllPresencesUser = async (userId) => {
    try {
        return await presenceRepository.getAllPresencesUser(userId);
    } catch (err) {
        throw new ApplicationError(`Failed to get all presences. ${err.message}`, 400);
    }
}

const updatePresence = async (id, data) => {
  try {
      // Get the current time in WIB (Western Indonesia Time)
      const today = new Date();
      today.setHours(today.getHours() + 7); // Adjust the time to WIB

      // Assign the WIB time to the checkOut field
      data.checkOut = today;

      // Update the presence data
      return await presenceRepository.updatePresence(id, data);
  } catch (err) {
      throw new ApplicationError(`Failed to update presence. ${err.message}`, 400);
  }
};


const deletePresence = async (id) => {
    try {
       
      return await presenceRepository.deletePresence(id);
    } catch (err) {
      throw new ApplicationError(`Failed to delete presence. ${err.message}`, 400);
    }
  }
  
  module.exports = {
    createPresence,
    getPresenceById,
    getAllPresences,
    updatePresence,
    deletePresence,
    getAllPresencesUser
  };
  