const router = require("express").Router();
const institution = require("../../controllers/Institution/institutionController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");

router.get(
  "/get-all-institution",
  authMiddleware,
  institution.getAllInstitution
);
router.get(
  "/get-institution-by-id/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  institution.getInstitutionById
);
router.post(
  "/create-institution",
  authMiddleware,
  roleMiddleware("ADMIN"),
  institution.createInstitution
);
router.put(
  "/update-institution/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  institution.updateInstitution
);
router.delete(
  "/delete-institution/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  institution.deleteInstitution
);

module.exports = router;
