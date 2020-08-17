const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  register_controller,
  subscribe_to_newsletter_controller,
  login_controller,
  get_user_info_controller,
} = require("../controllers/user_controller");

// ========================
// @Path:: api/user/register
// @Method:: Post
// @Desc: Register New User
// @Public
// ========================
router.post("/register", register_controller);

// ========================
// @Path:: api/user/login
// @Method:: GET
// @Desc: Login A User
// @Public
// ========================
router.get("/login", login_controller);

// ========================
// @Path:: api/user/newsletter
// @Method:: Post
// @Desc: Register User To Newsletter
// @Public
// ========================
router.post("/newsletter", subscribe_to_newsletter_controller);

// ========================
// @Path:: api/user/profile-:id
// @Method:: GET
// @Desc: Get User Profile
// @Privet
// ========================
router.get("/profile-:id", auth, get_user_info_controller);

module.exports = router;
