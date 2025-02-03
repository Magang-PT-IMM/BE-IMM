const router = require("express").Router();
const dashboard = require("../../controllers/dashboard/dashboardController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");

router.get(
  "/get-dashboard",
  authMiddleware,
  roleMiddleware("ADMIN", "HEAD_DEPT", "MANAGEMENT"),
  dashboard.getDashboardData
);

module.exports = router;
