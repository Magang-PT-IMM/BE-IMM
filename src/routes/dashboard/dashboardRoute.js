const router = require("express").Router();
const dashboard = require("../../controllers/dashboard/dashboardController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");

router.get(
  "/get-obligations-by-month",
  authMiddleware,
  roleMiddleware("ADMIN", "HEAD_DEPT", "MANAGEMENT"),
  dashboard.getObligationsByMonth
);

router.get(
  "/get-obligations-by-institution",
  authMiddleware,
  roleMiddleware("ADMIN", "HEAD_DEPT", "MANAGEMENT"),
  dashboard.getObligationsByInstitution
);

router.get(
  "/get-obligations-by-department",
  authMiddleware,
  roleMiddleware("ADMIN", "HEAD_DEPT", "MANAGEMENT"),
  dashboard.getObligationsByDepartment
);

module.exports = router;
