const express = require("express");
const permitRoute = require("./permitRoute");
const router = express.Router();

router.use(permitRoute);

module.exports = router;
