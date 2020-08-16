const express = require("express");
const router = express.Router();
const register_controller = require("../controllers/user_controller");

// ========================
// @Path:: api/user
// @Method:: Post
// @Desc: Register New User
// @Public
// ========================
router.post("/", register_controller);

module.exports = router;
