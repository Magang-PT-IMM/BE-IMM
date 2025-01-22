const express = require("express");
const authRoute = require("./auth");
const institutionRoute = require("./institution");
const departmentRoute = require("./department");
const permitCategoryRoute = require("./permitCategory");
const ticketRoute = require("./ticket");
const router = express.Router();

router.use("/auth", authRoute);
router.use("/institution", institutionRoute);
router.use("/department", departmentRoute);
router.use("/permitCategory", permitCategoryRoute);
router.use("/ticket", ticketRoute);

module.exports = router;
