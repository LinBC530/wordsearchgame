const express = require("express");
const router = express.Router();

const account = require("./account/account.js");
const map = require("./map/map.js");

router.use("/account", account);
router.use("/map", map);

module.exports = router;
