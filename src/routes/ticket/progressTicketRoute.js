const router = require("express").Router();
const progressTicket = require("../../controllers/ticket/progressTicketController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");

router.post(
  "/create-progress-ticket/:ticketId",
  authMiddleware,
  roleMiddleware("ADMIN", "USER", "EXTERNAL_RELATION"),
  progressTicket.createProgressTicket
);

module.exports = router;
