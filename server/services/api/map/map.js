// const express = require("express");
// const router = express.Router();
// const {
//   get_all_maker_coordinate,
//   get_maker_info,
//   get_school_maker_list,
//   get_attractions_info,
//   add_attraction,
//   update_attraction,
//   delete_attraction,
// } = require("../../db/main");

// // 取得景點資訊列表
// router.get("/attractions", async (req, res) => {
//   try {
//     let { school: school_id, detail } = req.query;

//     if (school_id && detail) {
//       return res.status(400).send("無效的查詢");
//     }

//     let data = null;
//     // 依學校取得景點資訊
//     if (school_id) {
//       data = await get_school_maker_list(school_id);
//     } else if (detail === "coordinate") {
//       // 取得所有景點的經緯度座標資訊
//       data = await get_all_maker_coordinate();
//     } else {
//       return res.status(400).send("無效的查詢");
//     }
//     return res.send(data);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send("伺服器錯誤");
//   }
// });

// // 取得景點資訊
// router.get("/attractions/:id", async (req, res) => {
//   try {
//     let { detail } = req.query;
//     let data = null;

//     if (detail === "card") {
//       // EX: {  name: '天圓地方', image: base64url..., introduce: 'content...' }
//       data = await get_maker_info(req.params.id);
//     } else if (!detail) {
//       // EX: {  name: '天圓地方', image: 'base64url...', audio: base64url, introduce: 'content...' }
//       data = await get_attractions_info(req.params.id);
//     } else {
//       res.status(400).send("無效的查詢");
//       return;
//     }

//     res.send(data);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("伺服器錯誤");
//   }
// });

// // 新增景點資訊
// router.post("/attractions", express.json(), async (req, res) => {
//   try {
//     const postData = req.body;
//     // EX: { img: null, title: 'test title', content: 'test content' }
//     const data = await add_attraction(
//       postData.name,
//       postData.school_id,
//       postData.image_path,
//       postData.audio_path,
//       postData.introduce,
//       postData.coordinate
//     );
//     res.send(data);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("伺服器錯誤");
//   }
// });

// // 更新景點資訊
// router.patch("/attractions/:id", express.json(), async (req, res) => {
//   try {
//     const postData = req.body;
//     const data = await update_attraction(postData, req.params.id);
//     res.send(data.affectedRows > 0 ? "更新成功" : "更新失敗");
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("伺服器錯誤");
//   }
// });

// // 刪除景點資訊
// router.delete("/attractions/:id", async (req, res) => {
//   try {
//     const data = await delete_attraction(req.params.id);
//     res.send(data);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("伺服器錯誤");
//   }
// });

// module.exports = router;
