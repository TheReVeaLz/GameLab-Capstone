const express = require('express');
const payslipController = require('../../app/controllers/payslip');
const AuthMiddleware = require('../../middlewares/auth');

const router = express.Router();

router.get('/admin/payslips', AuthMiddleware.authorize, AuthMiddleware.isRootOrAdmin, payslipController.getUsers);
router.get('/admin/payslips/:id', AuthMiddleware.authorize, AuthMiddleware.isRootOrAdmin, payslipController.getUserPayslip);
router.get('/user/payslips', AuthMiddleware.authorize, payslipController.getUserPayslip);
// router.get('/user/payslips:id', AuthMiddleware.authorize, payslipController.findAll);

module.exports = router;