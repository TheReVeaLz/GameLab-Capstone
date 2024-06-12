const JobRoleService = require("../services/jobrole.js");

async function findAll(req, res) {
	try {
		const ret = await JobRoleService.findAll();
		res.json({ status: "OK", message: "User list", data: ret });
	} catch (err) {
		res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
	}
}

module.exports = {
	findAll
}