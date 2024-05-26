const ApplicationError = require("../../config/errors/ApplicationError.js");
const UserRepo = require("../repositories/user.js");
// const OtpRepo = require("../repositories/otp.js");
const Auth = require("./auth.js");
// const NotificationService = require("../services/notification.js");
// const { sendMail } = require("./mailer.js");
// const { otpTypeList, sendMailType } = require("../../config/struct.js")



const generateOTP = (length) => {
    let otp = "";
    for(let i = 0; i < length; i++) otp += String(Math.floor(Math.random() * 9));
    return otp;
}

// const sendOtp = async (user, otpType) => {
//     let otp = await OtpRepo.findOne({ userId: user.id });
//     if (!otp) otp = await OtpRepo.create({
//         userId: user.id
//     });

//     const today = new Date();
//     if (otp.otpExpiredAt < today) {
//         const generatedOtp = generateOTP(6);
//         const otpExpiredAt = new Date();
//         otpExpiredAt.setMinutes(otpExpiredAt.getMinutes() + 5);
        
//         otp.set({ otp: generatedOtp, otpExpiredAt });
//     }
//     if (otpType) otp.set({ otpType });
//     otp.save();

//     return await sendMail({ email: user.email, otp: otp.otp, otpType: otp.otpType }, sendMailType.otp);
// }

// const resendOtp = async (payload) => {
//     const { email } = payload;
//     const user = await UserRepo.findOne({ email });
//     if (!user) throw new ApplicationError(`Your account is not exist.`, 400);
    
//     await sendOtp(user);
// }

// const validatingOtp = (otp, otpInput, type) => {
//     const today = new Date();
//     if (otp.otpExpiredAt < today) throw new ApplicationError("OTP is expired.", 400);
//     if (otp.otp !== otpInput || otp.otpType !== type) throw new ApplicationError("OTP is invalid", 400);
// }

// const verifyAccount = async (payload) => {
//     const { email, otp } = payload;
//     const user = await UserRepo.findOne({ email });
//     if (!user) throw new ApplicationError(`Your account is not exist.`, 400);
    
//     const otpDB = await OtpRepo.findOne({ userId: user.id });
//     if (!otpDB) throw new ApplicationError(`Request your account verify.`, 400);

//     if (user.verified) throw new ApplicationError("Account is verified already.", 400);
//     validatingOtp(otpDB, otp, otpTypeList.verify);
  
//     user.set({ verified: true, otpExpiredAt: null, otp: null });
//     user.save();
//     return user;
// }

const forgotPassword = async (payload) => {
    const { email } = payload;
    const user = await UserRepo.findOne({ email });
    if (!user) throw new ApplicationError(`Your account is not exist.`, 400);

    await sendOtp(user, otpTypeList.resetPassword);
}

// const setPasswordByOtp = async (payload) => {
//     const { email, otp, password } = payload;
//     const user = await UserRepo.findOne({ email });
//     if (!user) throw new ApplicationError(`Your account is not exist.`, 400);

//     const otpDB = await OtpRepo.findOne({ userId: user.id });
//     if (!otpDB) throw new ApplicationError(`Request your password change.`, 400);
    
//     validatingOtp(otpDB, otp, otpTypeList.resetPassword);
//     const encryptedPassword = await Auth.encryptPassword(password);
//     user.set({ encryptedPassword });
//     user.save();
//     return user;
// }

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
        const { email, password, name, address, phoneNumber } = payload;

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
            role: isAdmin ? 'ADMIN': 'MEMBER'
        });

        // await NotificationService.create(user.id,{ title: 'Register Success', message: 'Halooo !!!, Welcome to Idea Academy' })
        // await sendOtp(user, "verify");
        // delete user.dataValues.verified;

        return user;
    } catch (err) {
        throw new ApplicationError(`Failed to create data. ${err.message}`, err.statusCode || 500);
    }
}

const update = async (userId, payload) => {
    try {
        const { role } = payload

        if ( role) {
            throw new ApplicationError('Cannot Update Role User', 403)
        }

        const data = await UserRepo.update(userId,payload)
        return data
    } catch (err) {
        throw new ApplicationError(`Failed to update data. ${err.message}`,  err.statusCode || 500);
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
        const data = await UserRepo.update(user.id, { encryptedPassword: encryptedPassword })
        return data
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
    // sendOtp,
    // resendOtp,
    // verifyAccount,
    forgotPassword,
    // setPasswordByOtp,
    findAll,
    create,
    update,
    checkUser,
    myCourse,
    notification,
    reset
}