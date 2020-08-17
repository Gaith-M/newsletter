const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    validate: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  subscribed_to_newsletter: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("User", user_schema);
