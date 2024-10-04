const express = require('express');
const { EcreatesContract, EdeleteContract, EgetAllContract, EupdatesContract } = require("../controllers/edit.controller");

const router = express.Router();

router.post('/EPcreate', EcreatesContract);
router.get('/EgetAll', EgetAllContract);
router.put('/Esup/:EcontratId', EupdatesContract);
router.delete('/Edeletesup/:EId', EdeleteContract);

module.exports = router;
