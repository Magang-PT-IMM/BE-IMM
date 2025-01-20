const express = require("express");
const departmentRoute = require("./departmentRoute");
const router = express.Router();

router.use(departmentRoute);

module.exports = router;
