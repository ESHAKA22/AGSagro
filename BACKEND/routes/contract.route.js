const express = require('express');
const { createsContract, deleteContract, getAllContract, getCcontract, updatesContract } = require("../controllers/contract.controller");

const router = express.Router();

router.post('/Pcreate', createsContract);
router.get('/getAll', getAllContract);
router.get('/getAlll/:SupId', getCcontract);
router.put('/sup/:contratId', updatesContract);
router.delete('/deletesup/:CId', deleteContract);

module.exports = router;
