const express = require("express");
const router = express.Router();
const { celebrate, Joi, Segments } = require("celebrate");
const Attraction = require("../../db/attraction");

// 取得景點資訊列表，篩選條件：學校編號(school)、詳細資訊(detail)['coordinate']，擇一篩選
router.get(
  "/attractions",
  celebrate({
    [Segments.QUERY]: Joi.object()
      .keys({
        school: Joi.number().integer().min(1).messages({
          "number.base": "學校編號必須為數字",
          "number.min": "學校編號必須大於 0",
        }),
        detail: Joi.string().valid("coordinate").messages({
          "string.valid": "查詢參數錯誤",
        }),
      })
      .max(1)
      .unknown(false)
      .messages({
        "object.max": "超過參數數量限制",
        "object.unknown": "不允許多餘欄位",
      }),
  }),
  async (req, res) => {
    try {
      const { school: school_id, detail } = req.query;

      let data = null;
      // 依學校取得景點資訊
      if (school_id) {
        data = await Attraction.get_school_article_list(school_id);
      } else if (detail === "coordinate") {
        // 取得所有景點的經緯度座標資訊
        data = await Attraction.get_article_coordinate_list();
      } else {
        return res.status(400).send("無效的查詢");
      }
      return res.send(data);
    } catch (err) {
      console.log(err);
      return res.status(500).send("伺服器錯誤");
    }
  }
);

// 取得景點資訊，篩選條件：詳細資訊(detail)['card']
router.get(
  "/attractions/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
          "number.base": "景點編號必須為數字",
          "number.min": "景點編號必須大於 0",
        }),
    }),
    [Segments.QUERY]: Joi.object()
      .keys({
        detail: Joi.string().valid("card").messages({
          "string.valid": "查詢參數錯誤",
        }),
      })
      .unknown(false)
      .messages({ "object.unknown": "不允許多餘欄位" }),
  }),
  async (req, res) => {
    try {
      let { detail } = req.query;
      let data = null;

      if (detail === "card") {
        // EX: {  name: '天圓地方', image: base64url..., introduce: 'content...' }
        data = await Attraction.get_article(req.params.id);
      } else if (!detail) {
        // EX: {  name: '天圓地方', image: 'base64url...', audio: base64url, introduce: 'content' }
        data = await Attraction.get_articles(req.params.id);
      } else {
        res.status(400).send("無效的查詢");
        return;
      }

      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("伺服器錯誤");
    }
  }
);

// 新增景點資訊
router.post(
  "/attractions",
  celebrate({
    [Segments.BODY]: Joi.object()
      .keys({
        name: Joi.string().required().messages({
          "string.base": "景點名稱必須為文字",
          "string.empty": "景點名稱不得為空",
        }),
        school_id: Joi.number().integer().required().messages({
          "number.base": "學校編號必須為數字",
          "number.empty": "學校編號不得為空",
        }),
        image_path: Joi.string().allow(null, "").required().messages({
          "string.base": "圖片路徑必須為文字",
          "string.empty": "圖片路徑不得為空",
        }),
        audio_path: Joi.string().allow(null, "").required().messages({
          "string.base": "音檔路徑必須為文字",
          "string.empty": "音檔路徑不得為空",
        }),
        introduce: Joi.string().required().messages({
          "string.base": "景點介紹必須為文字",
          "string.empty": "景點介紹不得為空",
        }),
        coordinate: Joi.string().required().messages({
          "string.base": "座標必須為文字",
          "string.empty": "座標不得為空",
        }),
      })
      .unknown(false)
      .messages({ "object.unknown": "不允許多餘欄位" }),
  }),
  express.json(),
  async (req, res) => {
    try {
      const postData = req.body;
      // EX: { img: null, title: 'test title', content: 'test content' }
      const data = await Attraction.add(postData);
      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("伺服器錯誤");
    }
  }
);

// 更新景點資訊
router.patch(
  "/attractions/:id",
  express.json(),
  celebrate({
    [Segments.BODY]: Joi.object()
      .keys({
        name: Joi.string().messages({
          "string.base": "景點名稱必須為文字",
        }),
        school_id: Joi.number().integer().messages({
          "number.base": "學校編號必須為數字",
        }),
        image_path: Joi.string().allow(null, "").messages({
          "string.base": "圖片路徑必須為文字",
        }),
        audio_path: Joi.string().allow(null, "").messages({
          "string.base": "音檔路徑必須為文字",
        }),
        introduce: Joi.string().messages({
          "string.base": "景點介紹必須為文字",
        }),
        coordinate: Joi.string().messages({
          "string.base": "座標必須為文字",
        }),
      })
      .unknown(false)
      .messages({ "object.unknown": "不允許多餘欄位" }),
  }),
  async (req, res) => {
    try {
      const postData = req.body;
      const data = await Attraction.update(postData, req.params.id);
      res.send(data.affectedRows > 0 ? "更新成功" : "更新失敗");
    } catch (err) {
      console.log(err);
      res.status(500).send("伺服器錯誤");
    }
  }
);

// 刪除景點資訊
router.delete(
  "/attractions/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().min(1).required().messages({
        "number.base": "景點編號必須為數字",
        "number.min": "景點編號必須大於 0",
      }),
    }),
  }),
  async (req, res) => {
    try {
      const data = await Attraction.delete(req.params.id);
      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("伺服器錯誤");
    }
  }
);

module.exports = router;
