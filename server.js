require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const sanitizer = require("express-sanitizer");
const db = mongoose.connection;
const app = express();
const PORT = process.env.PORT || 4000;

// ======================
// Middleware Setup
// ======================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ======================
// Routes
// ======================
app.use("/api", require("./routes/root"));

// ======================
// Handle Undefined Routes
// ======================

// ======================
// Production || Development
// ======================

// ======================
// Setup Connection & Server
// ======================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
db.on("once", () => console.log("Connection Established"));
db.on("error", (error) => console.log(error.message));
app.listen(PORT, () => console.log(`server is running on port: ${PORT}`));
