const ApplicationError = require("../../config/errors/ApplicationError.js");
const UserRepo = require("../repositories/user.js");
const Auth = require("./auth.js");
// const NotificationService = require("../services/notification.js");

const forgotPassword = async (payload) => {
    const { email } = payload;
    const user = await UserRepo.findOne({ email });
    if (!user) throw new ApplicationError(`Your account is not exist.`, 400);

    await sendOtp(user, otpTypeList.resetPassword);
}

const findAll = async () => {
    try {
        const data = await UserRepo.findAll();
        return data;
    } catch (err) {
        throw new ApplicationError(`Failed to get the data. ${err.message}`);
    }
}

const create = async (payload, isAdmin) => {
    try {
        const { email, password, name, address, phoneNumber, roleId } = payload;

        if (!email || !password) {
            throw new ApplicationError(`Please input email and password.`, 400);
        }

        const encryptedPassword = await Auth.encryptPassword(password);
        
        const user = await UserRepo.create({
            email,
            encryptedPassword,
            name,
            address,
            phoneNumber,
            privilege: isAdmin ? 'ADMIN': 'MEMBER',
            roleId
        });

        return user;
    } catch (err) {
        throw new ApplicationError(`Failed to create data. ${err.message}`, err.statusCode || 500);
    }
}

const updateOne = async (id, payload, auth) => {
    try {
        const { email, password, name, address, phoneNumber, privilege, roleId } = payload;
        const encryptedPassword = password ? await Auth.encryptPassword(password) : undefined;
        const user = await UserRepo.findOne({ id });

        return await user.update(({ 
            email,
            encryptedPassword,
            name,
            address,
            phoneNumber,
            privilege: auth === "ROOT" && privilege !== "ROOT" ? privilege : undefined,
            roleId
         }));
    } catch (err) {
        throw new ApplicationError(`Failed to update data. ${err.message}`,  err.statusCode || 500);
    }
}

const update = async (payload, id) => {
    try {
        const { role } = payload

        if (role) {
            throw new ApplicationError('Cannot Update Role User', 403)
        }

        const data = await UserRepo.update(payload, { id });
        return data[0];
    } catch (err) {
        throw new ApplicationError(`Failed to update data. ${err.message}`,  err.statusCode || 500);
    }
}

const destroyOne = async (id) => {
    try {
        const role = await UserRepo.findOne({ id });
        return await role.destroy();
    } catch (err) {
        throw new ApplicationError(`Failed to destroy data. ${err.message}`,  err.statusCode || 500);
    }
}

const reset = async (user, payload) => {
    try {
        const { password, newPassword } = payload
        if (!password) {
            throw new ApplicationError('Please input your Password', 400)
        }
        const checkPass = await Auth.cmpPassword(password, user.encryptedPassword)
        if (!checkPass) {
            throw new ApplicationError("Password doesn't match", 400)
        }
        const encryptedPassword = await Auth.encryptPassword(newPassword)
        const data = await UserRepo.update({ encryptedPassword: encryptedPassword }, { id: user.id })
        return data[0];
    } catch (err) {
        throw new ApplicationError(`Failed to update data. ${err.message}`,  err.statusCode || 500);
    }
}


const checkUser = async (credentials) => {
    try {
        const { email, phoneNumber, password } = credentials;
        if (!email && !phoneNumber) throw new ApplicationError(`Please input email/phone number and password.`, 400);
        if (!password) throw new ApplicationError(`Please input your password.`, 400);

        const user = email ? await UserRepo.findOne({ email }) : await UserRepo.findOne({ phoneNumber });
        if (!user) {
            throw new ApplicationError(`Email or password is invalid.`, 404);
        }
        
        const checkedPassword = await UserRepo.checkPassword(password, user.encryptedPassword);
        if (!checkedPassword) {
            throw new ApplicationError(`Email or password is invalid.`, 404);
        }

        const token = Auth.createToken({ id: user.id });
        const ret = { ...user.dataValues, token };
        return ret;
    } catch (err) {
        throw new ApplicationError(`${err.message}`, err.statusCode || 500);
    }
}

const myCourse = async (id) => {
    try {
        const user = await UserRepo.findByPk(id);
        if (!user) {
            throw new ApplicationError(`User not found.`, 404);
        }

        return user;
    } catch (err) {
        throw new ApplicationError(`${err.message}`, err.statusCode || 500);
    }
}

const notification = async (id) => {
    try {
        const user = await UserRepo.notification(id);
        if (!user) {
            throw new ApplicationError(`User not found.`, 404);
        }

        return user;
    } catch (err) {
        throw new ApplicationError(`${err.message}`, err.statusCode || 500);
    }
}

module.exports = {
    forgotPassword,
    findAll,
    create,
    updateOne,
    update,
    destroyOne,
    checkUser,
    myCourse,
    notification,
    reset
}