const router = require("express").Router();
const userProgress = require("../../controllers/obligation/userProgressObligationController");
const upload = require("../../middleware/upload");
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");

router.post(
  "/create-user-progress/:obligationId",
  authMiddleware,
  roleMiddleware("ADMIN", "PIC", "HEAD_DEPT"),
  upload.single("file"),
  userProgress.createUserProgressObligation
);

module.exports = router;
