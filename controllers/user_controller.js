const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/user");

// ==========================
// Register User
// ==========================
const register_controller = (req, res, next) => {
  const { username, email, password, subscribe_to_letter } = req.body;
  res.status(200).json({
    username,
    email,
    password,
    subscribe_to_letter,
  });
};

module.exports = register_controller;
