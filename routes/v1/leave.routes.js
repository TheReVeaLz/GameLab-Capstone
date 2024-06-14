const { Router } = require('express')
const router = Router()

const AuthMiddleware = require('../../middlewares/auth')
const LeaveRequestController = require('../../app/controllers/leaverequest')

const isBodyNotNull = async (req, res, next) => {
  if (!Object.keys(req.body).length) {
    res.setHeader('Content-Type', 'application/json')
    res.status(400).json({ status: "FAIL", message: 'Body is missing.' })
    return
  }
  next()
}

// ADMIN
// Get all leave request
router.get('/admin/leaves', AuthMiddleware.authorize, AuthMiddleware.isRootOrAdmin, LeaveRequestController.findAll)

// Confirm leave request
router.post('/admin/leaves/:id', AuthMiddleware.authorize, AuthMiddleware.isRootOrAdmin, LeaveRequestController.findByPk, LeaveRequestController.confirmLeave)

// USER
// register admin
router.get('/user/leaves', AuthMiddleware.authorize, LeaveRequestController.findAllMyRequest)

// register admin
router.post('/user/leaves', AuthMiddleware.authorize, LeaveRequestController.requestLeave)

module.exports = router