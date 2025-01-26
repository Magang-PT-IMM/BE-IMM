const router = require("express").Router();
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");
const department = require("../../controllers/department/departmentController");

router.get("/get-all-department", authMiddleware, department.getAllDepartment);
router.get(
  "/get-department-by-id/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  department.getDepartmentById
);
router.post(
  "/create-department",
  authMiddleware,
  roleMiddleware("ADMIN"),
  department.createDepartment
);
router.put(
  "/update-department/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  department.updateDepartment
);
router.delete(
  "/delete-department/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  department.deleteDepartment
);

module.exports = router;
