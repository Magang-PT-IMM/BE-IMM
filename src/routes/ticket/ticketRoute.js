const router = require("express").Router();
const ticket = require("../../controllers/ticket/ticketController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");

router.get("/get-all-ticket", authMiddleware, ticket.getAllTicket);
router.get(
  "/get-all-ticket-by-user",
  authMiddleware,
  ticket.getAllTicketByUser
);
router.get("/get-ticket-by-id/:id", authMiddleware, ticket.getTicketById);
router.post(
  "/create-ticket",
  authMiddleware,
  roleMiddleware("ADMIN", "USER"),
  ticket.createTicket
);
router.put(
  "/update-ticket/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "USER", "EXTERNAL_RELATION"),
  ticket.updateTicket
);
router.delete(
  "/delete-ticket/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "USER"),
  ticket.deleteTicket
);

router.post(
  "/undelete-ticket/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "USER"),
  ticket.undeleteTicket
);

router.post(
  "/create-permit-from-ticket/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  ticket.createPermitFromTicket
);

router.get(
  "/get-all-ticket-deleted-by-user",
  authMiddleware,
  ticket.getTicketDeletedByUser
);
router.get(
  "/get-all-ticket-deleted",
  authMiddleware,
  roleMiddleware("ADMIN"),
  ticket.getAllTicketDeleted
);
router.get(
  "/get-ticket-deleted-by-id/:id",
  authMiddleware,
  ticket.getTicketDeletedById
);

module.exports = router;
