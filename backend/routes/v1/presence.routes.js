const express = require('express');
const presenceController = require('../../app/controllers/presence');
const AuthMiddleware = require('../../middlewares/auth')

const router = express.Router();

// User
// Get today presence info
router.get('/user/presence', AuthMiddleware.authorize, presenceController.getTodayPresence);

// Presence (Check-in and Check-out)
router.post('/user/presence', AuthMiddleware.authorize, presenceController.presence);

// Get all presence for (Authorization) user
router.get('/user/presences', AuthMiddleware.authorize, presenceController.getAllPresencesUser);

// Admin
// Get all presences
router.get('/admin/presenceAll', AuthMiddleware.authorize, AuthMiddleware.isRootOrAdmin, presenceController.getAllPresences);

// Get presence by ID
router.get('/admin/presence/:id', AuthMiddleware.authorize, AuthMiddleware.isRootOrAdmin, presenceController.getPresenceById);

module.exports = router;
