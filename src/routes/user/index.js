const router = require("express").Router();
const user = require("./userRoute");
const userTemplate = require("./userTemplateRoute");

router.use(user);
router.use(userTemplate);

module.exports = router;
