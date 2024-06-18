const presenceService = require("../services/presence.js");

const getTodayPresence = async (req, res) => {
  try {
      const data = req.body;
      data.userId = req.user.id;
      const presence = await presenceService.getTodayPresence(data);

      res.status(200).json({ status: "OK", message: "Data retrieved successfully.", data: presence });
  } catch (err) {
      res.status(err.statusCode || 500).json({ status: "FAIL", message: err.message });
  }
}

const presence = async (req, res) => {
  try {
      const data = req.body;
      data.userId = req.user.id;
      const presence = await presenceService.presence(data);

      if (presence)
        res.status(201).json({ status: "OK", message: "Presence data was created successfully.", data: presence });
      else
        res.status(200).json({ status: "OK", message: "Already presence today." });
  } catch (err) {
      res.status(err.statusCode || 500).json({ status: "FAIL", message: err.message });
  }
}

const getAllPresences = async (req, res) => {
  try {
      const presences = await presenceService.getAllPresences();
      res.json({ status: "OK", message: "Success", data: presences });
  } catch (err) {
      res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
  }
}

const getAllPresencesUser = async (req, res) => {
  try {
    const userId = req.user.id;
      const presences = await presenceService.getAllPresencesUser(userId);
      res.json({ status: "OK", message: "Success", data: presences });
  } catch (err) {
      res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
  }
}

const getPresenceById = async (req, res) => {
  try {
      const { id } = req.params;
      const presence = await presenceService.getPresenceById(id);
      res.json({ status: "OK", message: "Success", data: presence });
  } catch (err) {
      res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
  }
}

const deletePresence = async (req, res) => {
  try {
      const { id } = req.params;
      const deletedPresence = await presenceService.deletePresence(id);
      res.json({ status: "OK", message: "Presence data was Deleted successfully.", data: deletedPresence });
  } catch (err) {
      res.status(err.statusCode || 400).json({ status: "FAIL", message: err.message });
  }
}

module.exports = {
  getTodayPresence,
  presence,
  getAllPresences,
  getPresenceById,
  deletePresence,
  getAllPresencesUser
}