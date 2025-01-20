const router = require("express").Router();
const institution = require("../../controllers/Institution/institutionController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");

router.get(
  "/get-all-institution/",
  authMiddleware,
  institution.getAllInstitution
);
router.get(
  "/get-institution-by-id/:id",
  authMiddleware,
  roleMiddleware("admin"),
  institution.getInstitutionById
);
router.post(
  "/create-institution/",
  authMiddleware,
  roleMiddleware("admin"),
  institution.createInstitution
);
router.put(
  "/update-institution/:id",
  authMiddleware,
  roleMiddleware("admin"),
  institution.updateInstitution
);
router.delete(
  "/delete-institution/:id",
  authMiddleware,
  roleMiddleware("admin"),
  institution.deleteInstitution
);

module.exports = router;
