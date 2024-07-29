const notificationService = require("../services/notification.js");

const notification = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = await notificationService.findAllForUser(req.user.id);

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

const destroyForUser = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = await notificationService.destroyForUser(req.user.id, req.params.id);

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

module.exports = {
    notification,
    destroyForUser
}