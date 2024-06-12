const payslipService = require("../services/payslip.js");

function ListUser(json) {
	const ret = [];
	for (let i = 0; i < json.length; i++) {
		if (ret.findIndex(item => item.id == json[i].userId) != -1)
			continue;
		
		const { id, name, email } = json[i].User;
		ret.push({
			id,
			name,
			email
		});
	}
	return ret;
}

// Admin
const getUsers = async (req, res) => {
	try {
		const payslips = await payslipService.findAll();
		const ret = ListUser(payslips);

		res.json({ status: "OK", message: "User list", data: ret });
	} catch (err) {
		res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
	}
}

const generatePayslips = async (req, res) => {
	try {
		const payslips = await payslipService.generatePayslips(req.body);

		res.json({ status: "OK", message: "Payslips generated successfully.", data: payslips });
	} catch (err) {
		res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
	}
}
// Admin

const getUserPayslip = async (req, res) => {
	try {
		const userId = req.user?.id ? req.user.id : req.params?.id;
		const payslips = await payslipService.findAll({ userId });
		res.json({ status: "OK", message: "Success", data: payslips });
	} catch (err) {
		res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
	}
}

const findOne = async (req, res) => {
	try {
		const payload = req.body;
		payload.userId = req.user?.id;
		
		const payslip = await payslipService.findOne(payload);
		res.json({ status: "OK", message: "Data found.", data: payslip });
	} catch (err) {
		res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
	}
}

module.exports = {
	// findAll,
	getUsers,
	getUserPayslip,
	findOne,
	generatePayslips
}