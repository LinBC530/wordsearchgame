const express = require("express");
const router = express.Router();

const account = require("./account/account.js");
const attraction = require("./attraction/attraction.js");
const article = require("./article/article.js");
const game = require("./game/wsgame.js");

router.use("/account", account);
router.use("/map", attraction);
router.use("/games", game);
router.use(article);

module.exports = router;
