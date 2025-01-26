const router = require("express").Router();
const Auth = require("../../controllers/auth/authController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");

router.post(
  "/register",
  authMiddleware,
  roleMiddleware("ADMIN"),
  Auth.register
);
router.post("/login", Auth.login);
router.post("/renew-password", authMiddleware, Auth.reNewPassword);
router.post("/change-password", authMiddleware, Auth.changePassword);
router.post(
  "/reset-password/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  Auth.resetPassword
);

module.exports = router;
