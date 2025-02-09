const express = require("express");
const userProgressObligationRoute = require("./userProgressObligationRoute");
const obligationRoute = require("./obligationRoute");
const router = express.Router();

router.use(userProgressObligationRoute);
router.use(obligationRoute);

module.exports = router;
