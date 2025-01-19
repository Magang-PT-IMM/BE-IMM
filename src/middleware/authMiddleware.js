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

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: "You do not have permission to access this resource",
        },
      });
    }

    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
