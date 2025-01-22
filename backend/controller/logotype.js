const Logotype = require("../model/logotype");
const path = require("path");
const fs = require("fs");

const insertLogotype = async (req, res) => {
  try {
    const { title, alt, imgtitle, description } = req.body;
    const photo = req.files["photo"]
      ? req.files["photo"].map((file) => file.filename)
      : [];

    // Increment priorities for existing banners in the same section with higher or equal priority
    await Logotype.updateMany();

    const newBanner = new Logotype({
      title,
      description,
      photo,
      alt,
      imgtitle,
    });

    await newBanner.save();

    res.status(200).json({
      data: newBanner,
      message: "Your data inserted successfully",
    });
  } catch (err) {
    console.error("Error inserting banner:", err);
    res.status(400).send(err);
  }
};

const getLogotype = async (req, res) => {
  try {
    const { page } = req.query; // Default to 1 if not provided
    const limit = 5;

    // Check if pagination is requested
    if (page && Number(page) > 0) {
      const count = await Logotype.countDocuments();
      const banners = await Logotype.find()
        .skip((page - 1) * limit) // Skip records for previous pages
        .limit(limit);

      return res.status(200).json({
        data: banners,
        total: count,
        currentPage: Number(page),
        hasNextPage: count > page * limit,
        message: "Banners fetched successfully",
      });
    } else {
      // If page is not provided or is invalid, return all banners
      const banners = await Logotype.find();
      return res.status(200).json({
        data: banners,
        message: "All banners fetched successfully",
      });
    }
  } catch (err) {
    console.error("Error fetching banners:", err);
    res.status(400).send(err);
  }
};

// Handle PUT request to update a banner
const updateLogotype = async (req, res) => {
  const { id } = req.query;
  const { title, description } = req.body;

  try {
    let banner = await Logotype.findOne({ _id: id });

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    banner.title = title;
    banner.description = description;

    if (req.files && req.files["photo"] && req.files["photo"].length > 0) {
      const newPhotoPaths = req.files["photo"].map((file) => file.filename);
      banner.photo = [...banner.photo, ...newPhotoPaths];
    }

    // Process new alt texts
    if (req.body.alt && req.body.alt.length > 0) {
      const newAltTexts = Array.isArray(req.body.alt)
        ? req.body.alt
        : [req.body.alt];
      banner.alt = [...banner.alt, ...newAltTexts];
    }
    // Process new imgtitle texts
    if (req.body.imgtitle && req.body.imgtitle.length > 0) {
      const newimgtitleTexts = Array.isArray(req.body.imgtitle)
        ? req.body.imgtitle
        : [req.body.imgtitle];
      banner.imgtitle = [...banner.imgtitle, ...newimgtitleTexts];
    }

    banner = await banner.save();

    res
      .status(200)
      .json({ message: "Banner updated successfully", data: banner });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const deleteLogotype = async (req, res) => {
  try {
    const { id } = req.query;

    // Find the logotype by ID
    const logotypeToDelete = await Logotype.findById(id);
    if (!logotypeToDelete) {
      return res.status(404).json({ message: "Logotype not found" });
    }

    // Delete associated photos from disk
    await Promise.all(
      logotypeToDelete.photo.map(async (filename) => {
        const filePath = path.join(__dirname, "../images", filename);
        try {
          await fs.promises.unlink(filePath);
        } catch (error) {
          console.warn(`Failed to delete file: ${filename}`, error);
        }
      })
    );

    // Delete the logotype from the database
    await Logotype.findByIdAndDelete(id);
    res.status(200).json({ message: "Logotype deleted successfully" });
  } catch (error) {
    console.logo("Error deleting logotype:", error);
    res.status(500).json({ message: "Failed to delete logotype" });
  }
};



const getLogotypeById = async (req, res) => {
  try {
    const { id } = req.query;

    const banner = await Logotype.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.status(200).json({ data: banner });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deletePhotoAndAltText = async (req, res) => {
  const { id, imageFilename, index } = req.params;

  try {
    const banner = await Logotype.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Service not found" });
    }

    banner.photo = banner.photo.filter((photo) => photo !== imageFilename);
    banner.alt.splice(index, 1);
    banner.imgtitle.splice(index, 1);
    await banner.save();

    const filePath = path.join(__dirname, "..", "images", imageFilename);

    // Check if the file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: "Photo and alt text deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  insertLogotype,
  getLogotype,
  updateLogotype,
  deleteLogotype,
  getLogotypeById,
  deletePhotoAndAltText,
};
