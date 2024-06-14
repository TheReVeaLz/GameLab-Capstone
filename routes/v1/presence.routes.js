const express = require('express');
const presenceController = require('../../app/controllers/presence');
const AuthMiddleware = require('../../middlewares/auth')

const router = express.Router();

router.post('/user/presence', AuthMiddleware.authorize, presenceController.presence);
router.get('/user/presence/:id', AuthMiddleware.authorize, presenceController.getPresenceById);
router.get('/user/presenceAll', AuthMiddleware.authorize, presenceController.getAllPresences);
router.get('/user/presence', AuthMiddleware.authorize, presenceController.getAllPresencesUser);
router.delete('/user/presence/:id', AuthMiddleware.authorize, presenceController.deletePresence);

module.exports = router;
