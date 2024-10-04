const express = require("express");
const { signin, signup, signOut, updateUser } = require("../controllers/auth.controller.js");

const route = express.Router();

route.post("/signup", signup);
route.post("/signin", signin);
route.put('/update/:userId', updateUser);
route.post("/signout", signOut);

module.exports = route;
