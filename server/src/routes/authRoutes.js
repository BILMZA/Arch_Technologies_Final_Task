//main purpose of routes is to define the endpoints for the application
// and link them to the appropriate controller functions
//this file will define the routes for the authentication endpoints of the social network application
// in easy terms, this file will define the routes for registering and logging in users
const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;