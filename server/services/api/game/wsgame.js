const express = require("express");
const router = express.Router();
const { celebrate, Joi, Segments } = require("celebrate");
const WSGame = require("../../db/wsgame");

// 取得遊戲資訊列表
router.get(
  "/",
  async (req, res) => {
    try {
      const data = await WSGame.find_all_game_by_group();
      return res.send(data);
    } catch (err) {
      console.log(err);
      return res.status(500).send("伺服器錯誤");
    }
  }
);

// 取得遊戲資訊
router.get(
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
          "number.base": "遊戲編號必須為數字",
          "number.min": "遊戲編號必須大於 0",
        }),
    }),
  }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const data = await WSGame.find_game(id);
      return res.send(data);
    } catch (err) {
      console.log(err);
      return res.status(500).send("伺服器錯誤");
    }
  }
);

module.exports = router;