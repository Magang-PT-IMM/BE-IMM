const express = require("express");
const authRoute = require("./auth");
const institutionRoute = require("./institution");
const departmentRoute = require("./department");
const permitCategoryRoute = require("./permitCategory");
const ticketRoute = require("./ticket");
const userRoute = require("./user");
const router = express.Router();

router.use("/auth", authRoute);
router.use("/institution", institutionRoute);
router.use("/department", departmentRoute);
router.use("/permitCategory", permitCategoryRoute);
router.use("/ticket", ticketRoute);
router.use("/user", userRoute);

module.exports = router;
