
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Backup = require('../model/Backupfiles');
const MonthlyBackup=require("../model/MonthlyBackupfiles")

const exportAndBackupAllCollections = async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        let allData = {};

        // Exporting all collections
        for (let collection of collections) {
            const collectionName = collection.name;
            const documents = await db.collection(collectionName).find({}).toArray();
            allData[collectionName] = documents;
        }

        // Create the backups directory if it doesn't exist
        const backupsDir = path.join(__dirname, '..', 'backups');
        if (!fs.existsSync(backupsDir)) {
            fs.mkdirSync(backupsDir);
        }

        // Backup data to a JSON file
        const now = new Date();
        const month = now.toLocaleString('default', { month: 'long' }); // e.g., "June"
        const year = now.getFullYear();
        const fileName = `export_${month}_${year}_${Date.now()}.json`;
        const filePath = path.join(backupsDir, fileName);
        fs.writeFileSync(filePath, JSON.stringify(allData, null, 2));
        console.log('Data exported and written to file:', fileName);

        // Backup the JSON file to the database
        const backup = new Backup({
            fileName: fileName,
            filePath: filePath,
            createdAt: now
        });
        await backup.save();
       
    
        if (res) {
            res.setHeader('x-filename', fileName);
            res.download(filePath, fileName, (err) => {
                if (err) {
                    console.log('Error sending file:', err);
                    res.status(500).send('Error sending file');
                } else {
                    console.log('File sent:', fileName);
                }
            });
        }
        
    } catch (err) {
        if (res) {
            res.status(500).send('Internal Server Error');
        }
    }
};

const exportAndBackupAllCollectionsmonthly = async (req, res) => {
  try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      let allData = {};

      // Exporting all collections
      for (let collection of collections) {
          const collectionName = collection.name;
          const documents = await db.collection(collectionName).find({}).toArray();
          allData[collectionName] = documents;
      }

      // Create the backups directory if it doesn't exist
      const backupsDir = path.join(__dirname, '..', 'monthlybackups');
      if (!fs.existsSync(backupsDir)) {
          fs.mkdirSync(backupsDir);
      }

      // Backup data to a JSON file
      const now = new Date();
      const month = now.toLocaleString('default', { month: 'long' }); // e.g., "June"
      const year = now.getFullYear();
      const fileName = `export_${month}_${year}_${Date.now()}.json`;
      const filePath = path.join(backupsDir, fileName);
      fs.writeFileSync(filePath, JSON.stringify(allData, null, 2));
      console.log('Data exported and written to file:', fileName);

      // Backup the JSON file to the database
      const monthlyBackup = new MonthlyBackup({
          fileName: fileName,
          filePath: filePath,
          createdAt: now
      });
      await monthlyBackup.save();
      

      // Send the JSON file as a download
      if (res) {
          res.setHeader('x-filename', fileName);
          res.download(filePath, fileName, (err) => {
              if (err) {
                  console.log('Error sending file:', err);
                  res.status(500).send('Error sending file');
              } else {
                  console.log('File sent:', fileName);
              }
          });
      }
      
  } catch (err) {
      if (res) {
          res.status(500).send('Internal Server Error');
      }
  }
};

const getLastThreeMonthlyBackups = async (req, res) => {
    try {
      // Fetch all records sorted by creation date (oldest first)
      const backups = await MonthlyBackup.find().sort({ createdAt: 1 });
  
      // Check if there are more than 3 records
      if (backups.length > 3) {
        // Delete the oldest record
        const oldestBackup = backups[0];
        await MonthlyBackup.findByIdAndDelete(oldestBackup._id);
      }
  
      // Fetch the last three records sorted by creation date (newest first)
      const lastThreeBackups = await MonthlyBackup.find()
  
      res.status(200).json(lastThreeBackups);
    } catch (error) {
      
      res.status(500).send('Internal Server Error');
    }
  };
  

const downloadFile = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../monthlybackups', filename);

    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'File download failed' });
        }
    });
};

const deleteAllDataExceptAdmins = async (req, res) => {
    const collectionsToKeep = ['admins', 'logos', 'backups', 'monthlybackups'];
    const foldersToDelete = ['images', 'uploads', 'catalogues'];
  
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map(col => col.name);
  
      // Loop through each collection and delete data except for the collections to keep
      for (const collectionName of collectionNames) {
        if (!collectionsToKeep.includes(collectionName)) {
          await mongoose.connection.db.collection(collectionName).deleteMany({});
        }
      }
  
    // Calculate the path to the backend folder
    const backendPath = path.join(__dirname, '..'); // Assuming the controller folder is one level inside the backend folder

    // Delete the specified folders within the backend folder
    for (const folder of foldersToDelete) {
      const folderPath = path.join(backendPath, folder);
      if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
      }
      fs.mkdirSync(folderPath, { recursive: true });
    }
  
      res.status(200).json({ message: 'All data except admins deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete data' });
    }
  };


module.exports = { exportAndBackupAllCollections,exportAndBackupAllCollectionsmonthly,getLastThreeMonthlyBackups,downloadFile ,deleteAllDataExceptAdmins};
