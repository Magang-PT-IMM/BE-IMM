const router = require("express").Router();
const userTemplate = require("../../controllers/user/userTemplateController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");

module.exports = router;
