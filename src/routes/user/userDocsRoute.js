const router = require("express").Router();
const userDocs = require("../../controllers/user/userDocsController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");
const upload = require("../../middleware/upload");

router.get("/download-template", userDocs.downloadTemplate);
router.get("/export-user", userDocs.exportUsers);
router.post("/import-user", upload.single("file"), userDocs.importUsers);
module.exports = router;
