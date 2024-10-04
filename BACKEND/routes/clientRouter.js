const express = require('express');
const router = express.Router();
const controller = require('../controllers/clientController');

//Create router links
router.get('/clients', controller.getClients);
router.get('/selectedclient', controller.getSelectedClient);
router.post('/createclient', controller.addClient);
router.post('/updateclient', controller.updateClient);
router.post('/deleteclient', controller.deleteClient);
router.get('/getmaxid', controller.getMaxId);
 


module.exports = router;
