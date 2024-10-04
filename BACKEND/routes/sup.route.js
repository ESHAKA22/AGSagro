const express = require('express');
const { Ssigngin, Ssignup } = require("../controllers/supplier.controller");

const route = express.Router();

route.post("/Ssignup", Ssignup);
route.post("/Ssignin", Ssigngin);

module.exports = route;
