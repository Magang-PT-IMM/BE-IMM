const router = require("express").Router();
const oReports = require("../../controllers/obligation/oReportsController");

const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");

router.get(
  "/get-all-reports",
  authMiddleware,
  roleMiddleware("ADMIN", "MANAGEMENT"),
  oReports.getAllObligationReports
);
router.get(
  "/get-report-by-id/:id",
  authMiddleware,
  oReports.getObligationReportById
);
router.get(
  "/get-report-by-user-id",
  authMiddleware,
  roleMiddleware("PIC"),
  oReports.getObligationReportsByUserId
);
router.get(
  "/get-report-by-department",
  authMiddleware,
  roleMiddleware("HEAD_DEPT"),
  oReports.getObligationsByDepartment
);
router.post(
  "/create-report",
  authMiddleware,
  roleMiddleware("ADMIN"),
  oReports.createObligationReport
);
router.put(
  "/update-report/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  oReports.updateObligationReport
);
router.delete(
  "/delete-report/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  oReports.deleteObligationReport
);

module.exports = router;
