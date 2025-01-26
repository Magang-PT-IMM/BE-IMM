const router = require("express").Router();
const ticketRoute = require("./ticketRoute");
const progressTicketRoute = require("./progressTicketRoute");

router.use(ticketRoute);
router.use(progressTicketRoute);

module.exports = router;
