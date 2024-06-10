const presenceRepository = require('../repositories/presence');
const ApplicationError = require('../../config/errors/ApplicationError');
const Helper = require('../helper/helper');

const presence = async (data) => {
    try {
        // Get the current time in WIB (Western Indonesia Time)
        const today = new Date();
        
        // Assign the WIB time to the presenceDate and checkIn fields
        data.presenceDate = Helper.Today();

        // Get today presence
        const todayPresence = await presenceRepository.findOne({ userId: data.userId, presenceDate: data.presenceDate });

        if (todayPresence) {
            if (todayPresence.checkIn && todayPresence.checkOut)
                throw new Error("Already presence today.");

            const payload = { checkOut: today };
            const checkOutTime = Helper.Today(15);

            if (todayPresence.status != "LATE" && today > checkOutTime)
                payload.overtime = Helper.GetHoursDifference(today, checkOutTime)
            
            return await todayPresence.update(payload);
        }

        data.checkIn = today;
        
        // Check if the check-in time is late
        const allowedCheckInTime = new Date(today);
        allowedCheckInTime.setHours(8, 0, 0); // Set the allowed check-in time to 08:00:00 WIB
        
        // Determine the status based on the check-in time
        if (today > allowedCheckInTime) {
            data.status = 'LATE';
        } else {
            data.status = 'ONTIME';
        }
        
        // Save the presence data
        return await presenceRepository.create(data);
    } catch (err) {
        throw new ApplicationError(`Failed to presence. ${err.message}`, 400);
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
    presence,
    getPresenceById,
    getAllPresences,
    updatePresence,
    deletePresence,
    getAllPresencesUser
};
