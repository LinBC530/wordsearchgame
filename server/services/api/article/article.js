const express = require("express");
const router = express.Router();
const { check_auth_token } = require("../jwt/main");
const { celebrate, Joi, Segments } = require("celebrate");
const Article = require("../../db/article");

// 關鍵字查詢相似文章列表
router.get(
  "/articles/search",
  celebrate({
    [Segments.QUERY]: Joi.object()
      .keys({
        keyword: Joi.alternatives().try(
          Joi.string().required().messages({
            "string.base": "輸入資料格式錯誤",
            "any.required": "未填入關鍵字",
          }),
          Joi.array().items(Joi.string().required()).required().messages({
            "array.includes": "陣列中的值必須為字串",
            "any.required": "未填入關鍵字",
          })
        ),
        page: Joi.number().required().integer().messages({
          "number.base": "輸入資料格式錯誤",
          "any.required": "未填入頁碼",
        }),
        limit: Joi.number().required().integer().messages({
          "number.base": "輸入資料格式錯誤",
          "any.required": "未填入文章數量",
        }),
      })
      .unknown(false)
      .messages({ "object.unknown": "不接受其他參數" }),
  }),
  async (req, res) => {
    try {
      const data = await Article.keyword_search_articles(req.query);
      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("伺服器錯誤");
    }
  }
);

// 查詢文章列表
router.get(
  "/articles",
  celebrate({
    [Segments.QUERY]: Joi.object()
      .keys({
        page: Joi.number().required().messages({
          "number.base": "輸入資料格式錯誤",
          "any.required": "未填入頁碼",
        }),
        limit: Joi.number().required().messages({
          "number.base": "輸入資料格式錯誤",
          "any.required": "未填入文章數量",
        }),
        article_type: Joi.alternatives()
          .try(Joi.number(), Joi.array().items(Joi.number()))
          .messages({
            "alternatives.types": "輸入資料格式錯誤",
            "number.base": "輸入資料格式錯誤",
            "array.includes": "陣列中的值必須為數字",
          }),
        attraction: Joi.number().messages({
          "number.base": "輸入資料格式錯誤",
        }),
        tag: Joi.alternatives()
          .try(Joi.number(), Joi.array().items(Joi.number()))
          .messages({
            "alternatives.types": "輸入資料格式錯誤",
            "number.base": "輸入資料格式錯誤",
            "array.includes": "陣列中的值必須為數字",
          }),
        school: Joi.number().messages({
          "number.base": "輸入資料格式錯誤",
        }),
      })
      .unknown(false)
      .messages({ "object.unknown": "不接受其他參數" }),
  }),
  async (req, res) => {
    try {
      const data = await Article.find_articles(req.query);
      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("伺服器錯誤");
    }
  }
);

// 查詢文章
router.get(
  "/articles/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required().messages({
        "number.base": "輸入資料格式錯誤",
        "any.required": "未填入文章編號",
      }),
    }),
  }),
  async (req, res) => {
    try {
      const data = await Article.find_article(req.params.id);
      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("伺服器錯誤");
    }
  }
);

// 查詢文章
router.get(
  "/articles/:id/related",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required().integer().messages({
        "number.base": "輸入資料格式錯誤",
        "any.required": "未填入文章編號",
      }),
    }),
    [Segments.QUERY]: Joi.object()
      .keys({
        page: Joi.number().required().integer().messages({
          "number.base": "輸入資料格式錯誤",
          "any.required": "未填入頁碼",
        }),
        limit: Joi.number().required().integer().messages({
          "number.base": "輸入資料格式錯誤",
          "any.required": "未填入文章數量",
        }),
      })
      .and("page", "limit")
      .unknown(false)
      .messages({ "object.unknown": "不接受其他參數" }),
  }),
  async (req, res) => {
    try {
      const data = await Article.find_related_articles({
        article_id: req.params.id,
        page: req.query.page,
        limit: req.query.limit,
      });
      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("伺服器錯誤");
    }
  }
);

// 新增文章
router.post(
  "/articles",
  check_auth_token,
  celebrate({
    [Segments.BODY]: Joi.object({
      attractions_id: Joi.number().required().messages({
        "number.base": "輸入資料格式錯誤",
        "any.required": "未填入景點編號",
      }),
      article_type: Joi.number().required().messages({
        "number.base": "輸入資料格式錯誤",
        "any.required": "未填入文章類型",
      }),
      title: Joi.string().required().messages({
        "string.base": "輸入資料格式錯誤",
        "any.required": "未填入文章標題",
      }),
      content: Joi.string().required().messages({
        "string.base": "輸入資料格式錯誤",
        "any.required": "未填入文章內容",
      }),
      voice_path: Joi.string().messages({
        "string.base": "輸入資料格式錯誤",
      }),
    }),
  }),
  express.json(),
  async (req, res) => {
    try {
      const data = await Article.add(req.body);
      res.send({ affectedRows: data.affectedRows });
    } catch (err) {
      console.log(err);
      res.status(500).send("伺服器錯誤");
    }
  }
);

// 刪除文章
router.delete(
  "/articles/:id",
  check_auth_token,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required().messages({
        "number.base": "輸入資料格式錯誤",
        "any.required": "未填入文章編號",
      }),
    },
  }),
  async (req, res) => {
    try {
      const data = await Article.delete(req.params.id);
      res.send({ affectedRows: data.affectedRows });
    } catch (err) {
      console.log(err);
      res.status(500).send("伺服器錯誤");
    }
  }
);

// 更新文章
router.patch(
  "/articles/:id",
  check_auth_token,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required().messages({
        "number.base": "輸入資料格式錯誤",
        "any.required": "未填入文章編號",
      }),
    },
    [Segments.BODY]: Joi.object({
      attractions_id: Joi.number().messages({
        "number.base": "輸入資料格式錯誤",
      }),
      article_type: Joi.number().messages({
        "number.base": "輸入資料格式錯誤",
      }),
      title: Joi.string().messages({
        "string.base": "輸入資料格式錯誤",
      }),
      content: Joi.string().messages({
        "string.base": "輸入資料格式錯誤",
      }),
      voice_path: Joi.string().messages({
        "string.base": "輸入資料格式錯誤",
      }),
    }).unknown(false),
  }),
  express.json(),
  async (req, res) => {
    try {
      const data = await Article.update(req.params.id, req.body);
      res.send({ affectedRows: data.affectedRows });
    } catch (err) {
      console.log(err);
      res.status(500).send("伺服器錯誤");
    }
  }
);

module.exports = router;
