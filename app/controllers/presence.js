const presenceService = require("../services/presence.js");

const createPresence = async (req, res) => {
  try {
      const data = req.body;
      data.userId = req.user.id;
      const presence = await presenceService.createPresence(data);
      res.status(201).json({ status: "OK", message: "Presence data was created successfully.", data: presence });
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



const updatePresence = async (req, res) => {
  try {
      const { id } = req.params;
      const data = req.body;
      // Tambahkan userId ke data presence dari req
      data.userId = req.user.id;
      const presence = await presenceService.updatePresence(id, data);
      res.json({ status: "OK", message: "Presence data was updated successfully.", data: presence });
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
  createPresence,
  getAllPresences,
  getPresenceById,
  updatePresence,
  deletePresence,
  getAllPresencesUser
}