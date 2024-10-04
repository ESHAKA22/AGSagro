const express = require('express');
const router = express.Router();
const controller = require('../controllers/loyaltyController');

//Create router links
router.get('/loyalties', controller.getLoyaltys);
router.post('/createloyalty', controller.addLoyalty);
router.post('/updateloyalty', controller.updateLoyalty);
router.post('/deleteloyalty', controller.deleteLoyalty);
router.get('/getloyaltymaxid', controller.getLoyaltyMaxId);
 


module.exports = router;