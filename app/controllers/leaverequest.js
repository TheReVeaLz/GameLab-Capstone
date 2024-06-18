const leaveReqService = require("../services/leaverequest.js");
const userService = require("../services/presence.js");
const Helper = require("../../middlewares/helper.js");

const findByPk = async (req, res, next) => {
    try {
        const { id } = req.params
        req.leaveReq = await leaveReqService.findByPk(id);
        
        if (!req.leaveReq)
            return res.status(404).json({ status: "FAIL", message: "Presence data not found." });
        next();
    } catch (err) {
        res.status(err.statusCode || 500).json({ status: "FAIL", message: err.message });
    }
}

async function findAll(req, res) {
    try {
        const ret = await leaveReqService.findAll();
        res.json({ status: "OK", message: "All data successfully retrieved.", data: ret });
    } catch (err) {
        res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
    }
}

async function findAllMyRequest(req, res) {
    try {
        const { id } = req.user;
        const ret = await leaveReqService.findAll({ userId: id });
        res.json({ status: "OK", message: "All data successfully retrieved.", data: ret });
    } catch (err) {
        res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
    }
}

async function requestLeave(req, res) {
    try {
        const { id: userId } = req.user;
        let { startDate, endDate } = req.body;
        startDate = Helper.DayLocal(new Date(startDate));
        endDate = Helper.DayLocal(new Date(endDate));
        const requestDate = new Date();
        
        const ret = await leaveReqService.create({ requestDate, userId, startDate, endDate });
        res.json({ status: "OK", message: "All data successfully retrieved.", data: ret });
    } catch (err) {
        res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
    }
}

async function submitLeavePresence(userId, startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    Helper.DayLocal(startDate), Helper.DayLocal(endDate);
    
    const data = [];
    for(; startDate <= endDate; startDate.setDate(startDate.getDate() + 1)) {
        const presenceDate = Helper.DayLocal(new Date(startDate));

        data.push({ userId, presenceDate, status: "LEAVE" });
    }
    
    await userService.bulkCreate(data);
}

async function confirmLeave(req, res) {
    try {
        if (req.leaveReq.status != "PENDING")
            return res.json({ status: "OK", message: "You can't change confirmed data." });
        
        const { status } = req.body;
        const { startDate, endDate } = req.leaveReq;
        
        if (status === "ACCEPTED")
            await submitLeavePresence(req.leaveReq.userId, startDate, endDate);
        
        const ret = await leaveReqService.confirmLeave(req.leaveReq, status);
        res.json({ status: "OK", message: "The request is confirmed.", data: ret });
    } catch (err) {
        res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
    }
}

module.exports = {
    findByPk,
    findAll,
    findAllMyRequest,
    requestLeave,
    confirmLeave
}