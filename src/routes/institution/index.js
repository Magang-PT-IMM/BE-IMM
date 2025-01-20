const express = require("express");
const institutionRoute = require("./institutionRoute");
const router = express.Router();

router.use(institutionRoute);

module.exports = router;
