const express = require('express');
const router = express.Router();
const { addEmail, getAllEmails, deleteEmail } = require('../controller/newsletter');
const { requireAuth } = require("../middleware/authmiddleware")

router.post('/postnewsletter', addEmail);

router.get('/getnewsletter', requireAuth, getAllEmails);

router.delete('/deletenewsletter', requireAuth, deleteEmail);

module.exports = router;
