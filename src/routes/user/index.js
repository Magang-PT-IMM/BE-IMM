const router = require("express").Router();
const user = require("./userRoute");

router.use(user);

module.exports = router;
