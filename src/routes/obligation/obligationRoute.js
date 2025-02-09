const router = require("express").Router();
const obligation = require("../../controllers/obligation/obligationController");
const obligationDocs = require("../../controllers/obligation/obligationDocsController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");
const upload = require("../../middleware/upload");

router.get(
  "/get-all-obligation",
  authMiddleware,
  roleMiddleware("ADMIN", "MANAGEMENT"),
  obligation.getAllObligation
);

router.get(
  "/get-obligation-by-id/:id",
  authMiddleware,
  obligation.getObligationById
);

router.get(
  "/get-obligation-by-user-id",
  authMiddleware,
  roleMiddleware("PIC"),
  obligation.getObligationByUserId
);

router.get(
  "/get-obligation-by-department",
  authMiddleware,
  roleMiddleware("HEAD_DEPT"),
  obligation.getObligationsByDepartment
);

router.post(
  "/create-obligation",
  authMiddleware,
  roleMiddleware("ADMIN"),
  obligation.createObligation
);

router.put(
  "/update-obligation/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  obligation.updateObligation
);

router.put(
  "/delete-obligation/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  obligation.deleteObligation
);

router.put(
  "/undelete-obligation/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  obligation.undeletedObligation
);

router.get(
  "/get-template",
  authMiddleware,
  roleMiddleware("ADMIN"),
  obligationDocs.downloadTemplate
);

router.get(
  "/export-obligation",
  authMiddleware,
  roleMiddleware("ADMIN"),
  obligationDocs.exportObligations
);

router.post(
  "/upload-obligation",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("file"),
  obligationDocs.importObligations
);

module.exports = router;
