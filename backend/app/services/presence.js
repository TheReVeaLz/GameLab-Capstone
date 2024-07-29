const presenceRepository = require('../repositories/presence');
const ApplicationError = require('../../config/errors/ApplicationError');
const notificationService = require('../services/notification');
const Helper = require('../../middlewares/helper');

const bulkCreate = async (data) => {
    try {
        return await presenceRepository.bulkCreate(data);
    } catch (err) {
        throw new ApplicationError(`Failed to create the data. ${err.message}`, 400);
    }
}

const getTodayPresence = async (data) => {
    try {
        data.presenceDate = Helper.DayLocal();
        
        const todayPresence = await presenceRepository.findOne({ userId: data.userId, presenceDate: data.presenceDate });

        if (todayPresence)
            return todayPresence;
        
        return {};
    } catch (err) {
        throw new ApplicationError(`Failed to get presence. ${err.message}`, 400);
    }
}

const presence = async (data) => {
    try {
        // Get the current time in WIB (Western Indonesia Time)
        const today = new Date();
        
        // Assign the WIB time to the presenceDate and checkIn fields
        data.presenceDate = Helper.DayLocal();
        
        // Get today presence
        const todayPresence = await presenceRepository.findOne({ userId: data.userId, presenceDate: data.presenceDate });
        
        if (todayPresence) {
            if (todayPresence.checkIn && todayPresence.checkOut)
                return;
            
            const payload = { checkOut: today };
            const checkOutTime = Helper.DayLocal(15);
            
            if (todayPresence.status != "LATE" && today > checkOutTime)
                payload.overtime = Helper.GetHoursDifference(today, checkOutTime)
            
            await notificationService.create(data.userId, { title: 'Presence', message: 'You have check out successfully.' });
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
        
        // Create notification for check-in
        await notificationService.create(data.userId, { title: 'Presence', message: 'You have checked in successfully.' });
        
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


const deletePresence = async (id) => {
    try {
        
        return await presenceRepository.deletePresence(id);
    } catch (err) {
        throw new ApplicationError(`Failed to delete presence. ${err.message}`, 400);
    }
}

module.exports = {
    bulkCreate,
    getTodayPresence,
    presence,
    getPresenceById,
    getAllPresences,
    deletePresence,
    getAllPresencesUser
};
