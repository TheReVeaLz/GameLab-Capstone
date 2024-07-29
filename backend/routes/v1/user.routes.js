const { Router } = require('express')
const router = Router()

const Auth = require('../../app/controllers/user')
const Notification = require('../../app/controllers/notification')
const AuthMiddleware = require('../../middlewares/auth')
const GeneralMiddleware = require('../../middlewares/general')
const JobRoleController = require('../../app/controllers/jobrole')

const isBodyNotNull = async (req, res, next) => {
  if (!Object.keys(req.body).length) {
    res.setHeader('Content-Type', 'application/json')
    res.status(400).json({ status: "FAIL", message: 'Body is missing.' })
    return
  }
  next()
}

// ROOT
// register admin
router.post('/admin/register', isBodyNotNull, AuthMiddleware.authorize, AuthMiddleware.isRoot, Auth.registerAdmin)

// create role
router.post('/user/roles/create', AuthMiddleware.authorize, AuthMiddleware.isRoot, JobRoleController.create)

// update role
router.put('/user/roles/:id', AuthMiddleware.authorize, AuthMiddleware.isRoot, JobRoleController.updateOne)

// delete role
router.delete('/user/roles/:id', AuthMiddleware.authorize, AuthMiddleware.isRoot, JobRoleController.destroyOne)

// ADMIN
// get dashboard info
router.get('/admin/dashboard', AuthMiddleware.authorize, AuthMiddleware.isRootOrAdmin, GeneralMiddleware.GetDashboardInfo)

// get roles
router.get('/user/roles', AuthMiddleware.authorize, AuthMiddleware.isRootOrAdmin, JobRoleController.findAll)

// register user
router.post('/user/register', AuthMiddleware.authorize, AuthMiddleware.isRootOrAdmin, isBodyNotNull, Auth.register)

// update user
router.put('/user/:id', AuthMiddleware.authorize, AuthMiddleware.isRootOrAdmin, isBodyNotNull, Auth.updateOne)

// delete user
router.delete('/user/:id', AuthMiddleware.authorize, AuthMiddleware.isRootOrAdmin, Auth.destroyOne)

// get user
router.get('/user/users', AuthMiddleware.authorize, AuthMiddleware.isRootOrAdmin, Auth.findAll)

// USER
// login user
router.post('/user/login', isBodyNotNull, Auth.login)

// get current user
router.post('/user/current-user', AuthMiddleware.authorize, Auth.currentUser)

// change user password
router.put('/user/change-password', AuthMiddleware.authorize, Auth.changePassword)

// get user notification
router.get('/user/notifications', AuthMiddleware.authorize, Notification.notification)

// delete user notification
router.delete('/user/notifications/:id', AuthMiddleware.authorize, Notification.destroyForUser)

module.exports = router