const Interaction = require('../models/Interaction');

// Fetch all logs for a customer (GET)
const getInteractions = async (req, res) => {
  try {
    const logs = await Interaction.find({ entityId: req.params.customerId }).sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Log a brand new interaction (POST)
const createInteraction = async (req, res) => {
  try {
    const newLog = new Interaction(req.body);
    await newLog.save();
    res.status(201).json({ status: 'success', data: newLog });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getInteractions, createInteraction };