const express = require('express');
const presenceController = require('../../app/controllers/presence');
const AuthMiddleware = require('../../middlewares/auth')

const router = express.Router();

router.post('/presence', AuthMiddleware.authorize, presenceController.createPresence);
router.get('/presence/:id', AuthMiddleware.authorize, presenceController.getPresenceById);
router.get('/presenceAll', AuthMiddleware.authorize, presenceController.getAllPresences);
router.get('/presence', AuthMiddleware.authorize, presenceController.getAllPresencesUser);
router.put('/presence/:id',  AuthMiddleware.authorize, presenceController.updatePresence);
router.delete('/presence/:id', AuthMiddleware.authorize, presenceController.deletePresence);

module.exports = router;
