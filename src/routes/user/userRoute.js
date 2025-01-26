const router = require("express").Router();
const user = require("../../controllers/user/userController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");

router.get("/profile-user", authMiddleware, user.userProfile);

router.get(
  "/get-all-user",
  authMiddleware,
  roleMiddleware("ADMIN"),
  user.getAllUser
);

router.get(
  "/get-all-user-deleted",
  authMiddleware,
  roleMiddleware("ADMIN"),
  user.getAllUserDeleted
);

router.get(
  "/get-user-by-id/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  user.getUserById
);

router.put(
  "/update-user/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  user.updateUser
);

router.post(
  "/delete-user/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  user.deleteUser
);

router.post(
  "/undelete-user/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  user.undeleteUser
);

router.put("/update-user-profile", authMiddleware, user.updateUserProfile);

module.exports = router;
