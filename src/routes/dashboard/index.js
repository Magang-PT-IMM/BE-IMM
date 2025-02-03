const express = require("express");
const dashboardRoute = require("./dashboardRoute");
const router = express.Router();

router.use(dashboardRoute);

module.exports = router;
