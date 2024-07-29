const JobRoleService = require("../services/jobrole.js");

async function findAll(req, res) {
	try {
		const ret = await JobRoleService.findAll();
		res.json({ status: "OK", message: "User list", data: ret });
	} catch (err) {
		res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
	}
}

const create = async (req, res) => {
	try {
		res.setHeader('Content-Type', 'application/json');
		const role = await JobRoleService.create(req.body, true);
		res.status(201).json({ status: "OK", message: "Data was created successfully.", data: role });
	} catch (err) {
		res.status(err.statusCode).json({
			status: "FAIL",
			message: err.message
		});
	}
}

const updateOne = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');

        const role = await JobRoleService.updateOne(req.params.id, req.body);
        res.status(201).json({ status: "OK", message: "Data was updated successfully.", data: role });
    } catch (err) {
        res.status(err.statusCode).json({
            status: "FAIL",
            message: err.message
        });
    }
}

const destroyOne = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');

        const role = await JobRoleService.destroyOne(req.params.id);
        res.status(201).json({ status: "OK", message: "Data was destroyed successfully.", data: role });
    } catch (err) {
        res.status(err.statusCode).json({
            status: "FAIL",
            message: err.message
        });
    }
}

module.exports = {
	findAll,
	create,
	updateOne,
	destroyOne
}