const router = require("express").Router();
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");
const department = require("../../controllers/department/departmentController");

router.get("/get-all-department/", authMiddleware, department.getAllDepartment);
router.get(
  "/get-department-by-id/:id",
  authMiddleware,
  roleMiddleware("admin"),
  department.getDepartmentById
);
router.post(
  "/create-department/",
  authMiddleware,
  roleMiddleware("admin"),
  department.createDepartment
);
router.put(
  "/update-department/:id",
  authMiddleware,
  roleMiddleware("admin"),
  department.updateDepartment
);
router.delete(
  "/delete-department/:id",
  authMiddleware,
  roleMiddleware("admin"),
  department.deleteDepartment
);

module.exports = router;
