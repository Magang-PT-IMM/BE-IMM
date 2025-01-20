const router = require("express").Router();
const permitCategory = require("../../controllers/permitCategory/permitCategoryController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");

router.get(
  "/get-all-permit-category/",
  authMiddleware,
  permitCategory.getAllPermitCategory
);
router.get(
  "/get-permit-category-by-id/:id",
  authMiddleware,
  roleMiddleware("admin"),
  permitCategory.getPermitCategoryById
);
router.post(
  "/create-permit-category/",
  authMiddleware,
  roleMiddleware("admin"),
  permitCategory.createPermitCategory
);
router.put(
  "/update-permit-category/:id",
  authMiddleware,
  roleMiddleware("admin"),
  permitCategory.updatePermitCategory
);
router.delete(
  "/delete-permit-category/:id",
  authMiddleware,
  roleMiddleware("admin"),
  permitCategory.deletePermitCategory
);

module.exports = router;
