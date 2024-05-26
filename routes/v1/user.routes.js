const { Router } = require('express')
const router = Router()

const Auth = require('../../app/controllers/user')
const AuthMiddleware = require('../../middlewares/auth')

const isBodyNotNull = async (req, res, next) => {
  if (!Object.keys(req.body).length) {
    res.setHeader('Content-Type', 'application/json')
    res.status(400).json({ status: "FAIL", message: 'Body is missing.' })
    return
  }
  next()
}

// register admin
router.post('/admin/register',isBodyNotNull,AuthMiddleware.authorize,AuthMiddleware.isRoot,Auth.registerAdmin)
// register user
router.post('/register', isBodyNotNull, Auth.register)

// // verify password
// router.post('/account-verify', Auth.verifyAccount)

// // forgot password
// router.post('/forgot-password', Auth.forgotPassword)

// // update forgot password
// router.put('/forgot-password', Auth.forgotPassword)

// // resend OTP
// router.post('/resend-otp', Auth.resendOtp)


// login user
router.post('/login', isBodyNotNull, Auth.login)

// get user
router.get('/users',AuthMiddleware.authorize,AuthMiddleware.isRootOrAdmin,Auth.findAll)

// update user
// router.put('/users',AuthMiddleware.authorize,uploadToMemory,uploadToCloudinary, Auth.update)

// // update user
// router.put('/reset-password',AuthMiddleware.authorize, Auth.resetPassword)

// get current user
router.post('/current-user', AuthMiddleware.authorize, Auth.currentUser)

// // get my course
// router.get('/my-courses', AuthMiddleware.authorize, Auth.myCourse)

// // get user notification
// router.get('/notifications', AuthMiddleware.authorize, Auth.notification )

module.exports = router