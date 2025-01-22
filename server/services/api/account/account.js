const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { issueToken, check_auth_token } = require("../jwt/main");
const { add_user_account, delete_user_account, update_user_account, find_user_account, find_admin_account } = require("../../db/main");

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
router.post("/user/login", express.json(), async (req, res) => {
  try {
    const { account } = req.body;
    const userData = await find_user_account(account);
    if (!userData) {
      return res.status(401).json({ message: "無此帳戶" });
    }
    res.status(200).send(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// 新增一般使用者
router.post("/user", check_auth_token, async (req, res) => {
  try {
    const { school_id, group_id, name, school_number } = req.body;
    if (!school_id || !group_id || !name || !school_number) {
      return res.status(400).json({ message: "資訊不完整" });
    }
    if (await find_user_account(school_number)) {
      return res.status(409).json({ message: "此學號已被註冊" });
    }
    const user = await add_user_account(school_id, group_id, name, school_number);
    res.status(201).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// 更新一般使用者資料
router.patch("/user/:id", check_auth_token, express.json(), async (req, res) => {
  try {
    const postData = req.body;
    const data = await update_user_account(postData, req.params.id);
    res.send(data.affectedRows > 0 ? "更新成功" : "更新失敗");
  } catch (err) {
    console.log(err);
    res.status(500).send("伺服器錯誤");
  }
});

// 刪除一般使用者
router.delete("/user/:id", check_auth_token, async (req, res) => {
  try {
    const data = await delete_user_account(req.params.id);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("伺服器錯誤");
  }
});

// 管理者登入
router.post("/manager/login", express.json(), async (req, res) => {
  try {
    const { account, password } = req.body;
    const user = await find_admin_account(account);
    if (!user) {
      return res.status(401).json({ message: "無此帳戶" });
    }
    bcrypt.compare(password, user.password, (err, data) => {
      if (err) {
        throw err;
      } else if (data) {
        return res.status(200).json({ token: issueToken({ userId: user.id }) });
      } else {
        return res.status(401).json({ message: "密碼驗證失敗" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

module.exports = router;
