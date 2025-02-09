const router = require("express").Router();
const user = require("./userRoute");
const userDocs = require("./userDocsRoute");

router.use(user);
router.use(userDocs);

module.exports = router;
