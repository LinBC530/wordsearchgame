const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { issueToken, check_auth_token } = require("../jwt/main");
const { celebrate, Joi, Segments } = require("celebrate");
const User = require("../../db/user");

// // 新增管理者
// router.post("/admin/register", express.json(), async (req, res) => {
//   try {
//     const { name, account, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await add_admin_account(name, account, hashedPassword);
//     res.status(201).send(user);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "伺服器錯誤" });
//   }
// });

// 一般使用者登入
router.post(
  "/user/login",
  express.json(),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      account: Joi.string().max(15).required().messages({
        "string.base": "輸入資料格式錯誤",
        "string.max": "字數超出限制",
        "any.required": "未填入帳號",
      }),
    }),
  }),
  async (req, res) => {
    try {
      const { account } = req.body;
      // 檢查帳號是否存在，並取得使用者資料
      const userData = await User.find_user(account);
      if (!userData) {
        return res.status(401).json({ message: "無此帳戶" });
      }
      res.status(200).send(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "伺服器錯誤" });
    }
  }
);

// 新增一般使用者
router.post(
  "/users",
  check_auth_token,
  celebrate({
    [Segments.BODY]: Joi.alternatives().try(
      Joi.object({
        school_id: Joi.number().required().messages({
          "number.base": "輸入資料格式錯誤",
          "any.required": "未填入學校",
        }),
        group_id: Joi.number().required().messages({
          "number.base": "輸入資料格式錯誤",
          "any.required": "未填入組別",
        }),
        name: Joi.string().required().messages({
          "string.base": "輸入資料格式錯誤",
          "any.required": "未填入姓名",
        }),
        school_number: Joi.string().required().messages({
          "string.base": "輸入資料格式錯誤",
          "any.required": "未填入學號",
        }),
      })
        .unknown(false)
        .messages({ "object.unknown": "不允許多餘欄位" }),

      Joi.array()
        .items(
          Joi.object({
            school_id: Joi.number().required().messages({
              "number.base": "輸入資料格式錯誤",
              "any.required": "未填入學校",
            }),
            group_id: Joi.number().required().messages({
              "number.base": "輸入資料格式錯誤",
              "any.required": "未填入組別",
            }),
            name: Joi.string().required().messages({
              "string.base": "輸入資料格式錯誤",
              "any.required": "未填入姓名",
            }),
            school_number: Joi.string().required().messages({
              "string.base": "輸入資料格式錯誤",
              "any.required": "未填入學號",
            }),
          })
            .unknown(false)
            .messages({ "object.unknown": "不允許多餘欄位" })
        )
        .min(1)
        .messages({ "array.min": "至少要有一筆資料" })
    ),
  }),
  async (req, res) => {
    try {
      if (!Array.isArray(req.body)) {
        const { school_number } = req.body;
        if (await User.find_user(school_number)) {
          return res.status(409).json({ message: "此學號已被註冊" });
        }
      }
      const user = await User.add(req.body);
      res.status(201).send(user);
      // }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "伺服器錯誤" });
    }
  }
);

// 更新一般使用者資料
router.patch(
  "/users/:id",
  check_auth_token,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required().messages({
        "number.base": "輸入資料格式錯誤",
        "any.required": "未填入ID",
      }),
    },
    [Segments.BODY]: Joi.object({
      school_id: Joi.number().messages({
        "number.base": "輸入資料格式錯誤",
      }),
      group_id: Joi.number().messages({
        "number.base": "輸入資料格式錯誤",
      }),
      name: Joi.string().messages({
        "string.base": "輸入資料格式錯誤",
      }),
      school_number: Joi.string().messages({
        "string.base": "輸入資料格式錯誤",
      }),
    }).unknown(false),
  }),
  express.json(),
  async (req, res) => {
    try {
      const data = await User.update(req.body, req.params.id);
      res.send(data.affectedRows > 0 ? "更新成功" : "更新失敗");
    } catch (err) {
      console.log(err);
      res.status(500).send("伺服器錯誤");
    }
  }
);

// 刪除一般使用者
router.delete(
  "/users/:id",
  check_auth_token,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required().messages({
        "number.base": "輸入資料格式錯誤",
        "any.required": "未填入ID",
      }),
    },
  }),
  async (req, res) => {
    try {
      const data = await User.delete(req.params.id);
      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("伺服器錯誤");
    }
  }
);

// 管理者登入
router.post(
  "/manager/login",
  express.json(),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      account: Joi.string().max(15).required().messages({
        "string.base": "輸入資料格式錯誤",
        "string.max": "字數超出限制",
        "any.required": "未填入帳號",
      }),
      password: Joi.string().required().messages({
        "string.base": "輸入資料格式錯誤",
        "any.required": "未填入密碼",
      }),
    }),
  }),
  async (req, res) => {
    try {
      const { account, password } = req.body;
      const user = await User.find_user(account);
      if (!user) {
        return res.status(401).json({ message: "無此帳戶" });
      }
      bcrypt.compare(password, user.password, (err, data) => {
        if (err) {
          throw err;
        } else if (data) {
          return res
            .status(200)
            .json({ token: issueToken({ userId: user.id }) });
        } else {
          return res.status(401).json({ message: "密碼驗證失敗" });
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "伺服器錯誤" });
    }
  }
);

module.exports = router;
