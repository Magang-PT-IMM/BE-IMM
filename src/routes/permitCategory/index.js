const express = require("express");
const permitCategory = require("./permitCategoryRoute");
const router = express.Router();

router.use(permitCategory);

module.exports = router;
