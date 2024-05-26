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
        res.status(201).json({ status: "OK", message: "Data was created successfully.", data: { name: user.name, user: user.email } });
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
        const user = await userService.update(req.user.id, body);
        res.status(201).json({ status: "OK", message: "Data was updated successfully.", data: user });
    } catch (err) {
        res.status(err.statusCode).json({
            status: "FAIL",
            message: err.message
        });
    }
}

const resetPassword = async (req, res) => {
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


const resendOtp = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        await userService.resendOtp(req.body);
        res.status(201).json({ status: "OK", message: "Success" });
    } catch (err) {
        res.status(err.statusCode).json({
            status: "FAIL",
            message: err.message
        });
    }
}

const forgotPassword = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { method } = req;
        switch (method) {
            case "POST":
                await userService.forgotPassword(req.body);
                break;
            case "PUT":
                await userService.setPasswordByOtp(req.body);
                break;
            default:
                throw new Error(`Invalid request.`);
        }
        res.status(201).json({ status: "OK", message: "Success" });
    } catch (err) {
        res.status(err.statusCode || 400).json({
            status: "FAIL",
            message: err.message
        });
    }
}

const setPasswordByOtp = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        await userService.forgotPassword(req.body);
        res.status(201).json({ status: "OK", message: "Success" });
    } catch (err) {
        res.status(err.statusCode).json({
            status: "FAIL",
            message: err.message
        });
    }
}

const verifyAccount = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = await userService.verifyAccount(req.body);
        res.status(201).json({ status: "OK", message: "Account is verified successfully.", data: { user: user.email } });
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

const myCourse = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = await userService.myCourse(req.user.id);

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
    resendOtp,
    verifyAccount,
    registerAdmin,
    login,
    setPasswordByOtp,
    forgotPassword,
    currentUser,
    myCourse,
    notification,
    update,
    resetPassword
}