const express = require('express');
const router = express.Router();


const backupController = require('../controller/Backup');
const { requireAuth } = require('../middleware/authmiddleware');

router.get('/uploadAllCollections',backupController.uploadAllCollections);
router.get('/downloadAllData',backupController.downloadAllData);
router.delete('/deleteData',requireAuth,backupController.deleteAllDataExceptAdmins);

router.get('/export-data',requireAuth,backupController.exportAndBackupAllCollections);
router.get('/getData',requireAuth,backupController.getLastThreeMonthlyBackups);
router.get('/download/:filename',requireAuth,backupController.downloadFile);




module.exports = router;