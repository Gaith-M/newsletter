const JWT = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers["auth-token"];

    if (!token)
      return res.status(401).json("Unauthorized access. Login to continue");

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user_data = decoded;
    next();
  } catch (err) {
    res.status(500).json("Something went wrong");
  }
};
