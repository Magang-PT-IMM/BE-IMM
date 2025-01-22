const router = require("express").Router();
const ticketRoute = require("./ticketRoute");

router.use(ticketRoute);

module.exports = router;
