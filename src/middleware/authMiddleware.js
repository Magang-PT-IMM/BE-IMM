const { verifyToken } = require("../utils/jwt");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: "Authorization token is required",
      },
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        message: "Invalid or expired token",
      },
    });
  }
};

module.exports = authMiddleware;
