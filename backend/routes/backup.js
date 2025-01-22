const express = require('express');
const router = express.Router();


const backupController = require('../controller/Backup');
const { requireAuth } = require('../middleware/authmiddleware');

router.get('/export-data',requireAuth,backupController.exportAndBackupAllCollections);
router.get('/getData',requireAuth,backupController.getLastThreeMonthlyBackups);
router.get('/download/:filename',requireAuth,backupController.downloadFile);
router.delete('/deleteData',requireAuth,backupController.deleteAllDataExceptAdmins);




module.exports = router;