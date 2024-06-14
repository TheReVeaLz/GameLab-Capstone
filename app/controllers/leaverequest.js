const leaveReqService = require("../services/leaverequest.js");

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

async function create(req, res) {
    try {
        const { id } = req.user;
		const ret = await leaveReqService.findAll({ userId: id });
		res.json({ status: "OK", message: "All data successfully retrieved.", data: ret });
    } catch (err) {
		res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
    }
}

module.exports = {
    findAll,
    findAllMyRequest,
    create
}