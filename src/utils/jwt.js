const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/index");

const SECRET_KEY = JWT_SECRET || "your_secret_key";

const generateToken = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
