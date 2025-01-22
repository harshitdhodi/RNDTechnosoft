const ColorPreference = require('../model/managecolor');

// Save color preferences
exports.saveColors = async (req, res) => {
  const { colors } = req.body;
  try {
    let colorPreference = await ColorPreference.findOne();
    if (colorPreference) {
      colorPreference.colors = colors;
      await colorPreference.save();
    } else {
      colorPreference = new ColorPreference({ colors });
      await colorPreference.save();
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get color preferences
exports.getColors = async (req, res) => {
  try {
    const colorPreference = await ColorPreference.findOne();
    if (colorPreference) {
      res.status(200).json({ colors: colorPreference.colors });
    } else {
      res.status(404).json({ error: 'Colors not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
