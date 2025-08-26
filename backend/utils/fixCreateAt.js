const mongoose = require('mongoose');
const Content = require('../model/content'); // Adjust the path to your Content model

async function fixCreatedAt() {
  try {
    // Connect to your MongoDB database
    await mongoose.connect(process.env.DATABASE_URI || 'mongodb+srv://harshit:Harshit%40123@userinfo.lmbsytd.mongodb.net/NewRND', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Find all documents
    const contents = await Content.find();
    let fixedCount = 0;

    for (const content of contents) {
      // Check if createdAt is an object with a $date property
      if (content.createdAt && typeof content.createdAt === 'object' && content.createdAt['$date']) {
        try {
          // Convert the $date string to a Date object
          content.createdAt = new Date(content.createdAt['$date']);
          await content.save();
          console.log(`Fixed createdAt for content ID: ${content._id}`);
          fixedCount++;
        } catch (err) {
          console.error(`Failed to fix createdAt for content ID: ${content._id}`, err);
        }
      }
    }

    console.log(`Data migration completed. Fixed ${fixedCount} documents.`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixCreatedAt();