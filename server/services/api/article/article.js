const express = require("express");
const router = express.Router();
const { check_auth_token } = require("../jwt/main");
// const {  } = require("../../db/main");

// 查詢文章列表
router.get("/articles", async (req, res) => {
  try {
    // const { attraction: attraction_id } = req.query;
    const data = await get_articles();
    res.send("articles");
  } catch (err) {
    console.log(err);
    res.status(500).send("伺服器錯誤");
  }
});

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
