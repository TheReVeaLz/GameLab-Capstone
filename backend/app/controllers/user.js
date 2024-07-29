const userService = require("../services/user.js");

const findAll = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const data = await userService.findAll();
        if (!data) {
            res.json({ status: "FAIL", message: "Data not found."});
            return;
        }
        res.json({ status: "OK", message: "Success", data });
    } catch (err) {
        res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message});
    }
}

const register = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = await userService.create(req.body);
        res.status(201).json({ status: "OK", message: "Data was created successfully.", data: user });
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

        const role = await userService.updateOne(req.params.id, req.body, req.user.privilege);
        res.status(201).json({ status: "OK", message: "Data was updated successfully.", data: role });
    } catch (err) {
        res.status(err.statusCode).json({
            status: "FAIL",
            message: err.message
        });
    }
}

const update = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { body } = req
        const user = await userService.update(body, req.user.id);
        res.status(201).json({ status: "OK", message: "Data was updated successfully.", data: user });
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

        const role = await userService.destroyOne(req.params.id);
        res.status(201).json({ status: "OK", message: "Data was destroyed successfully.", data: role });
    } catch (err) {
        res.status(err.statusCode).json({
            status: "FAIL",
            message: err.message
        });
    }
}

const changePassword = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { body } = req
        const user = await userService.reset(req.user, body);
        res.status(201).json({ status: "OK", message: "Data was updated successfully.", data: user });
    } catch (err) {
        res.status(err.statusCode).json({
            status: "FAIL",
            message: err.message
        });
    }
}

const registerAdmin = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const ret = await userService.create(req.body, true);
        res.status(201).json({ status: "OK", message: "Data was created successfully.", data: ret });
    } catch (err) {
        res.status(err.statusCode).json({
            status: "FAIL",
            message: err.message
        });
    }
}

const login = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const credentials = req.body;
        const user = await userService.checkUser(credentials);

        res.json({
            status: "OK",
            message: "Login successfully.",
            data: user
        })
    } catch (err) {
        res.status(err.statusCode).json({
            status: "FAIL",
            message: err.message
        });
    }
}

const notification = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = await userService.notification(req.user.id);

        res.json({
            status: "OK",
            message: "Success.",
            data: user
        })
    } catch (err) {
        res.status(err.statusCode).json({
            status: "FAIL",
            message: err.message
        });
    }
}

const currentUser = async (req, res) => {
    res.json({
        status: "OK",
        message: "Login successfully.",
        data: req.user
    })
}

module.exports = {
    findAll,
    register,
    registerAdmin,
    login,
    currentUser,
    notification,
    updateOne,
    update,
    destroyOne,
    changePassword
}