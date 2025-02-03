const express = require("express");
const authRoute = require("./auth");
const institutionRoute = require("./institution");
const departmentRoute = require("./department");
const userRoute = require("./user");
const obligationsRoute = require("./obligation");
const dashboardRoute = require("./dashboard");
const router = express.Router();

router.use("/auth", authRoute);
router.use("/institution", institutionRoute);
router.use("/department", departmentRoute);
router.use("/user", userRoute);
router.use("/obligation", obligationsRoute);
router.use("/dashboard", dashboardRoute);

module.exports = router;
