const express = require('express');
const router = express.Router();
const {addCards,deleteCard ,updateCards, getAllCards,deleteCardFieldsById , getCardsById} = require("../controller/cards")
const {uploadIcon} = require('../middleware/imageUpload');
router.post("/addCard", uploadIcon , addCards)
router.delete("/deleteCard" , deleteCard)
router.delete("/removeIcon" ,uploadIcon, deleteCardFieldsById)
router.put("/updateCard",uploadIcon , updateCards)
router.get("/getAllCards" , getAllCards)
router.get("/getCardById" , getCardsById)
module.exports = router;