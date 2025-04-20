const express = require("express");
const router = express.Router();
const { errors } = require("celebrate");

const account = require("./account/account.js");
const game = require("./game/wsgame.js");

router.use("/account", account);
router.use("/games", game);

router.use(errors());

module.exports = router;
