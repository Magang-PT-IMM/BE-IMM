const express = require("express");
const authRoute = require("./auth");
const institutionRoute = require("./institution");
const departmentRoute = require("./department");
const permitCategory = require("./permitCategory");
const router = express.Router();

router.use("/auth", authRoute);
router.use("/institution", institutionRoute);
router.use("/department", departmentRoute);
router.use("/permitCategory", permitCategory);

module.exports = router;
