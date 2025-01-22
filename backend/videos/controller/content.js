const Content = require('../model/content'); // Adjust the path to your model
const path = require('path');
const fs = require('fs');

const insertContent = async (req, res) => {
  try {
    const contentType = req.params;
    console.log(contentType);
    const {
      heading,
      subheading,
      description,
      questions,
      subsections,
      status,
      photoAlt,
      videoAlt
    } = req.body;

    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
    const video = req.files['video'] ? req.files['video'][0].filename : '';

    const parsedQuestions = questions ? questions.map(q => JSON.parse(q)) : [];

    const newContent = new Content({
      photo,
      video,
      heading,
      subheading,
      description,
      questions: parsedQuestions,
      subsections,
      status,
      contentType: contentType.contentType,
      photoAlt,
      videoAlt
    });

    await newContent.save();
    return res.status(201).json({ message: 'Content created successfully', content: newContent });
  } catch (error) {
    console.log(error)
    console.error("Error inserting content:", error);
    return res.status(400).json({ message: 'Error inserting content', error });
  }
};

const getAllContent = async (req, res) => {
  try {
    const contents = await Content.find();
    return res.status(200).json(contents);
  } catch (error) {
    console.error("Error retrieving contents:", error);
    return res.status(500).json({ message: 'Error retrieving contents', error });
  }
};

const getContentTypeByType = async (req, res) => {
  const { contentType } = req.params;

  try {
    const contents = await Content.find({ contentType});
    return res.status(200).json(contents);
  } catch (error) {
    console.error("Error retrieving contents by type:", error);
    return res.status(500).json({ message: 'Error retrieving contents by type', error });
  }
};

const getContentByType = async (req, res) => {
  const { contentType } = req.params;

  try {
    const contents = await Content.find({ contentType,status:true });
    return res.status(200).json(contents);
  } catch (error) {
    console.error("Error retrieving contents by type:", error);
    return res.status(500).json({ message: 'Error retrieving contents by type', error });
  }
};

const updateContent = async (req, res) => {
  const { contentType } = req.params; // Get content type from URL parameters
  let updateFields = req.body;
  console.log(updateFields);

  try {
    // Find content by contentType
    let existingContent = await Content.findOne({ contentType });

    // If no content found, create new content
    if (!existingContent) {
      // Process new photos if uploaded
      if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
        const newPhotoPaths = req.files['photo'].map(file => file.filename); // Using filename to get the stored file names
        updateFields.photo = newPhotoPaths;
      }

      // Process new video if uploaded
      if (req.files && req.files['video'] && req.files['video'].length > 0) {
        const newVideoPath = req.files['video'][0].filename; // Assuming one video is uploaded at a time
        updateFields.video = newVideoPath;
      }

      // Create new content
      const newContent = new Content({
        contentType,
        ...updateFields
      });
      await newContent.save();

      return res.status(201).json(newContent); // Return newly created content
    }

    // If content exists, update it

    // Process new uploaded photos
    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename); // Using filename to get the stored file names
      updateFields.photo = [...existingContent.photo, ...newPhotoPaths];
    } else {
      updateFields.photo = existingContent.photo; // Keep existing photos if no new photos are uploaded
    }

    // Process new uploaded video
    if (req.files && req.files['video'] && req.files['video'].length > 0) {
      const newVideoPath = req.files['video'][0].filename; // Assuming one video is uploaded at a time
      updateFields.video = newVideoPath;
    } else {
      updateFields.video = existingContent.video; // Keep existing video if no new video is uploaded
    }

    // Handle alt text for video
    if (updateFields.altVideo === undefined) {
      updateFields.altVideo = existingContent.altVideo;
    }

    // Handle video title
    if (updateFields.videotitle === undefined) {
      updateFields.videotitle = existingContent.videotitle;
    }

    // Update existing content
    const updatedContent = await Content.findOneAndUpdate(
      { contentType },
      updateFields,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedContent); // Return updated content

  } catch (error) {
    console.log(error)
    console.error("Error updating content:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};


const toggleStatus = async (req, res) => {
  const { id } = req.query;
  try {
    // Find content by ID
    const existingContent = await Content.findById(id);

    if (!existingContent) {
      return res.status(404).json({ message: 'Content not found for the given ID' });
    }

    // Toggle the status
    existingContent.status = !existingContent.status;

    // Save the updated content
    const updatedContent = await existingContent.save();

    // Return the updated content
    res.status(200).json(updatedContent);
  } catch (error) {
    console.error("Error toggling status:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};


const addQuestions = async (req, res) => {
  const { id } = req.params; // Get content ID from URL parameters
  const { question, answer } = req.body;

  try {
    const existingContent = await Content.findById(id);

    if (!existingContent) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Add new question
    existingContent.questions.push({ question, answer });
    await existingContent.save();

    return res.status(201).json({ message: 'Question added successfully', content: existingContent });
  } catch (error) {
    console.error("Error adding question:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
};
const addSubsection = async (req, res) => {
  const { id } = req.params; // Get content ID from URL parameters

  try {
    // Extract subsection data from the JSON string
    const subsectionData = JSON.parse(req.body.data);
    const { title, description, photoAlt, imgtitle } = subsectionData; // Extract the fields

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    // Find existing content by ID
    const existingContent = await Content.findById(id);
    if (!existingContent) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Handle single photo upload
    let photo = null; // Initialize photo variable
    if (req.file) { // Check if a file has been uploaded
      photo = req.file.filename; // Get the filename of the uploaded photo
    } else {
      return res.status(400).json({ message: 'A photo is required.' });
    }

    // Add new subsection with the uploaded photo
    existingContent.subsections.push({ title, description, photo, photoAlt, imgtitle });
    await existingContent.save();

    return res.status(201).json({ message: 'Subsection added successfully', content: existingContent });
  } catch (error) {
    console.error("Error adding subsection:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};




const deletePhotoAndAltText = async (req, res) => {
  const { id, imageFilename, index } = req.params;

  try {
    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Remove the photo and its alt text
    content.photo = content.photo.filter(photo => photo !== imageFilename);

    content.photoAlt.splice(index, 1);
    content.imgtitle.splice(index, 1);
    await content.save();

    const filePath = path.join(__dirname, '..', 'images', imageFilename);

    // Delete the file from the server if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Photo and alt text deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo and alt text:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateQuestions = async (req, res) => {
  const { id } = req.params; // Get content ID from URL parameters
  const { questions } = req.body;

  try {
    const existingContent = await Content.findById(id);

    if (!existingContent) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Directly assign the questions array to the content's questions field
    existingContent.questions = questions;

    await existingContent.save();

    return res.status(200).json({ message: 'Questions updated successfully', content: existingContent });
  } catch (error) {
    console.error("Error updating questions:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const updateSubsections = async (req, res) => {
  const { id } = req.params; // Get content ID from URL parameters

  try {
    // Fetch the existing content
    const existingContent = await Content.findById(id);

    if (!existingContent) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Process subsections from form-data
    const newSubsections = [];

    if (req.body.title && req.body.description) {
      const subsection = {
        title: req.body.title,
        description: req.body.description,
        photo: "", // Placeholder for photo path
        imgtitle: req.body.imgtitle,
        photoAlt: req.body.photoAlt,
      };

      // Handle photo upload if it exists
      if (req.files && req.files.photo) {
        subsection.photo = req.files.photo[0].filename; // Save the photo path
      }

      newSubsections.push(subsection);
    }

    // Append new subsections to the existing array
    existingContent.subsections = [...existingContent.subsections, ...newSubsections];

    // Save the updated content
    await existingContent.save();

    return res.status(200).json({ message: 'Subsections updated successfully', content: existingContent });
  } catch (error) {
    console.error("Error updating subsections:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const updateSubsectionsId = async (req, res) => {
  const { id, subsectionIndex } = req.params; // Get content ID and subsection index from URL parameters

  try {
    // Fetch the existing content
    const existingContent = await Content.findById(id);

    if (!existingContent) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Check if subsectionIndex is valid
    if (subsectionIndex < 0 || subsectionIndex >= existingContent.subsections.length) {
      return res.status(400).json({ message: 'Invalid subsection index' });
    }

    // Find the subsection to update
    const subsectionToUpdate = existingContent.subsections[subsectionIndex];

    if (!subsectionToUpdate) {
      return res.status(404).json({ message: 'Subsection not found' });
    }

    // Update the subsection
    if (req.body.title) subsectionToUpdate.title = req.body.title;
    if (req.body.description) subsectionToUpdate.description = req.body.description;
    if (req.body.imgtitle) subsectionToUpdate.imgtitle = req.body.imgtitle;
    if (req.body.photoAlt) subsectionToUpdate.photoAlt = req.body.photoAlt;
    if (req.body.imgtitle) subsectionToUpdate.imgtitle = req.body.imgtitle;

    // Handle photo upload if it exists
    if (req.files && req.files.photo) {
      subsectionToUpdate.photo = req.files.photo[0].filename; // Save the new photo path
    }

    // Save the updated content
    await existingContent.save();

    return res.status(200).json({ message: 'Subsection updated successfully', content: existingContent });
  } catch (error) {
    console.error("Error updating subsection:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = updateSubsections;


const deleteVideoAndAltText = async (req, res) => {
  const { id, videoFilename } = req.params;
  console.log(id, videoFilename)
  try {
    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Remove the video reference
    if (content.video === videoFilename) {
      content.video = ''; // Clear the video reference
    }

    // Remove the alt text
    if (content.videoAlt && content.videoAlt === videoFilename) {
      content.videoAlt = ''; // Clear the alt text
    }

    await content.save();

    // Delete the video file from the filesystem
    const filePath = path.join(__dirname, '..', 'videos', videoFilename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Video and alt text deleted successfully' });
  } catch (error) {
    console.error('Error deleting video and alt text:', error);
    res.status(500).json({ message: error.message });
  }
};


// Delete a specific question by index
const deleteQuestion = async (req, res) => {
  const { id, questionIndex } = req.params; // Get content ID and question index from URL parameters

  try {
    const existingContent = await Content.findById(id);

    if (!existingContent) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Check if the questionIndex is within the valid range
    if (questionIndex < 0 || questionIndex >= existingContent.questions.length) {
      return res.status(400).json({ message: 'Invalid question index' });
    }

    // Remove the question from the questions array
    existingContent.questions.splice(questionIndex, 1);

    await existingContent.save();

    return res.status(200).json({ message: 'Question deleted successfully', content: existingContent });
  } catch (error) {
    console.error("Error deleting question:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
};




const deletesubsection = async (req, res) => {
  const { contentId, index } = req.params;

  try {
    // Find the content by ID
    const content = await Content.findById(contentId);

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Check if the subsection index is valid
    if (index < 0 || index >= content.subsections.length) {
      return res.status(404).json({ error: 'Subsection index out of bounds' });
    }

    const subsection = content.subsections[index];

    // If the subsection has a photo, delete the photo file
    if (subsection.photo) {
      const photoPath = path.join(__dirname, '..', 'images', subsection.photo); // Adjust the path as needed

      // Check if the file exists and delete it
      fs.unlink(photoPath, (err) => {
        if (err) {
          console.error('Error deleting photo file:', err);
        } else {
          console.log('Photo file deleted successfully');
        }
      });
    }

    // Remove the subsection from the array
    content.subsections.splice(index, 1);

    // Save the updated content
    await content.save();

    res.status(200).json({ message: 'Subsection and photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting subsection:', error);
    res.status(500).json({ error: 'Server error' });
  }
}


module.exports = {
  toggleStatus,
  getContentTypeByType,
  insertContent,
  getAllContent,
  getContentByType,
  updateContent,
  updateQuestions,
  updateSubsections, addQuestions,
  addSubsection, deletePhotoAndAltText,
  deleteVideoAndAltText, deleteQuestion, deletesubsection, updateSubsectionsId
};
