const router = require("express").Router();
const oPayments = require("../../controllers/obligation/oPaymentController");

const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");

router.get(
  "/get-all-payment",
  authMiddleware,
  roleMiddleware("ADMIN", "MANAGEMENT"),
  oPayments.getAllObligationPayments
);
router.get(
  "/get-payment-by-id/:id",
  authMiddleware,
  oPayments.getObligationPaymentById
);
router.get(
  "/get-payment-by-user-id",
  authMiddleware,
  roleMiddleware("PIC"),
  oPayments.getObligationPaymentsByUserId
);
router.get(
  "/get-payment-by-department",
  authMiddleware,
  roleMiddleware("HEAD_DEPT"),
  oPayments.getObligationsByDepartment
);
router.post(
  "/create-payment",
  authMiddleware,
  roleMiddleware("ADMIN"),
  oPayments.createObligationPayment
);
router.put(
  "/update-payment/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  oPayments.updateObligationPayment
);
router.delete(
  "/delete-payment/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  oPayments.deleteObligationPayment
);

module.exports = router;
