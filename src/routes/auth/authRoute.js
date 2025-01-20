const router = require("express").Router();
const Auth = require("../../controllers/auth/authController");
const { authMiddleware } = require("../../middleware/authMiddleware");

router.post("/register", Auth.register);
router.post("/login", Auth.login);
router.post("/renew-password", authMiddleware, Auth.reNewPassword);

module.exports = router;
