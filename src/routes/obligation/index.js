const express = require("express");
const oReportsRoute = require("./oReportsRoute");
const userProgressObligationRoute = require("./userProgressObligationRoute");
const oPaymentsRoute = require("./oPaymentsRoute");
const router = express.Router();

router.use(oReportsRoute);
router.use(userProgressObligationRoute);
router.use(oPaymentsRoute);

module.exports = router;
