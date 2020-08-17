const express = require("express");
const router = express.Router();
const User = require("../models/user");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mailchimp = require("@mailchimp/mailchimp_marketing");
mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.SERVER,
});

// ==========================
// Register A New User & Subscribe To Newsletter(Optional) Controller
// ==========================
const register_controller = async (req, res, next) => {
  const { username, email, password, subscribe_to_letter } = req.body;

  if (!username || !email || !password)
    return res.status(400).json("All Fields Are Required");

  try {
    // Check if email is available
    const is_email_available = await User.findOne({ email });

    if (is_email_available) return res.status(409).json("email is taken");

    // Register User
    const hashed_password = await bcrypt.hash(password, 10);

    const user_to_register = new User({
      username,
      email,
      password: hashed_password,
      subscribed_to_newsletter: subscribe_to_letter,
    });

    const saved_user = await user_to_register.save();

    const token = await JWT.sign(
      {
        username: saved_user.username,
        id: saved_user._id,
        subscribed_to_newsletter: saved_user.subscribed_to_newsletter,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1hr",
      }
    );

    if (subscribe_to_letter) {
      const response = await mailchimp.lists.addListMember(
        process.env.LIST_ID,
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: username,
          },
        }
      );

      res.status(201).json({
        msg: "Successfully registered and subscribed to newsletter",
        user: saved_user,
        token,
        contact_id: response.id,
      });
    } else {
      res.status(201).json({
        msg: "Registered but did not subscribe to newsletter",
        user: saved_user,
        token,
      });
    }
  } catch (err) {
    res.status(500).json("something went wrong");
  }
};

// ==========================
// Subscribe User To Newsletter Controller
// ==========================
const subscribe_to_newsletter_controller = async (req, res, next) => {
  const { username, email } = req.body;

  if (!username || !email)
    return res.status(400).json("All Fields Are Required");

  try {
    const response = await mailchimp.lists.addListMember(process.env.LIST_ID, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: username,
      },
    });

    res
      .status(200)
      .json(`Subscribed successfully. contact ID is: ${response.id}`);
  } catch (err) {
    res.status(500).json("something went wrong");
  }
};

// ============================
// Login Controller
// ============================
const login_controller = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if user exist
    const user_exist = await User.findOne({ email });

    if (!user_exist) return res.status(400).json("Invalid Email Or Passowrd");

    const is_password_correct = await bcrypt.compare(
      password,
      user_exist.password
    );

    if (!is_password_correct)
      return res.status(400).json("Invalid Email Or Passowrd");

    const token = await JWT.sign(
      {
        username: user_exist.username,
        id: user_exist._id,
        subscribed_to_newsletter: user_exist.subscribed_to_newsletter,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );

    res.status(200).json({
      msg: "logged in successfully",
      user: user_exist,
      token,
    });
  } catch (err) {
    res.status(500).json("Something went wrong");
  }
};

// ====================
// Get User Info Controller
// ====================

const get_user_info_controller = async (req, res) => {
  try {
    const { id } = req.user_data;

    if (!id) return res.status(404).json("Invalid ID");

    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json("Something went wrong");
  }
};

module.exports = {
  register_controller,
  subscribe_to_newsletter_controller,
  login_controller,
  get_user_info_controller,
};
