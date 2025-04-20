const express = require("express");
const router = express.Router();
const { errors } = require("celebrate");

const game = require("./game/wsgame.js");

router.use("/games", game);

router.use(errors());

module.exports = router;
