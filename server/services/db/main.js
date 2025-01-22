const mysql = require("mysql2");

module.exports = {
  get_all_maker_coordinate,
  get_maker_info,
  get_school_maker_list,
  get_attractions_info,
  delete_attraction,
  update_attraction,
  add_attraction,
  find_admin_account,
  find_user_account,
  add_admin_account,
  add_user_account,
  update_user_account,
  delete_user_account
};

let con = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.DBPORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

con.connect();

function get_all_maker_coordinate() {
  return new Promise((resolve, reject) => {
    con.query("SELECT id, name, coordinate FROM attractions", (err, rows) =>
      err ? reject(err) : resolve(rows)
    );
  });
}

function get_maker_info(id) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT id, name, image_path, introduce FROM attractions WHERE id = ${id}`,
      (err, rows) => (err ? reject(err) : resolve(rows[0]))
    );
  });
}

function get_school_maker_list(id) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT id, name, image_path FROM attractions WHERE school_id = ${id}`,
      (err, rows) => (err ? reject(err) : resolve(rows))
    );
  });
}

function get_attractions_info(id) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT name, image_path, audio_path, introduce FROM attractions WHERE id = ${id}`,
      (err, rows) => (err ? reject(err) : resolve(rows[0]))
    );
  });
}

// 新增景點資訊
function add_attraction(
  name,
  school_id,
  image_path,
  audio_path,
  introduce,
  coordinate
) {
  return new Promise((resolve, reject) => {
    coordinate = JSON.stringify(coordinate);
    con.query(
      `INSERT INTO attractions (name, school_id, image_path, audio_path, introduce, coordinate) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, school_id, image_path, audio_path, introduce, coordinate],
      (err, rows) => (err ? reject(err) : resolve(rows))
    );
  });
}

// 更新景點資訊
function update_attraction(fields, id) {
  return new Promise((resolve, reject) => {
    const allowedFields = [
      "name",
      "school_id",
      "image_path",
      "audio_path",
      "introduce",
      "coordinate",
    ];

    // 欄位檢查
    if (Object.keys(fields).filter((field) => !allowedFields.includes(field)).length > 0)
      reject("Invalid fields");

    // 轉換座標格式為json
    if (fields.coordinate) fields.coordinate = JSON.stringify(fields.coordinate);

    con.query(
      `UPDATE attractions SET ${Object.keys(fields).join(" = ?, ")} = ? WHERE id = ?`,
      [...Object.values(fields), id],
      (err, rows) => (err ? reject(err) : resolve(rows))
    );
  });
}

// 刪除景點資訊
function delete_attraction(id) {
  return new Promise((resolve, reject) => {
    con.query(`DELETE FROM attractions WHERE id = ?`, id, (err, rows) =>
      err ? reject(err) : resolve(rows)
    );
  });
}

function add_admin_account(name, account, password) {
  return new Promise((resolve, reject) => {
    con.query(
      `INSERT INTO manager_account (name, account, password) VALUES (?, ?, ?)`,
      [name, account, password],
      (err, rows) => (err ? reject(err) : resolve(rows))
    );
  });
}

function find_admin_account(account) {
  return new Promise((resolve, reject) => {
    console.log(account);
    con.query(
      `SELECT id, account, password FROM manager_account WHERE account = ?`, [account],
      (err, rows) => (err ? reject(err) : resolve(rows[0]))
    );
  });
}

function add_user_account(school_id, group_id, name, school_number) {
  return new Promise((resolve, reject) => {
    con.query(
      `INSERT INTO user_account (school_id, group_id, name, school_number) VALUES (?, ?, ?, ?)`,
      [school_id, group_id, name, school_number],
      (err, rows) => (err ? reject(err) : resolve(rows))
    );
  });
}

function find_user_account(school_number) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT id, school_number, name FROM user_account WHERE school_number = ?`, [school_number],
      (err, rows) => (err ? reject(err) : resolve(rows[0]))
    );
  });
}

function update_user_account(fields, id) {
  return new Promise((resolve, reject) => {
    const allowedFields = ["school_id", "group_id", "name", "school_number"];

    // 欄位檢查
    if (Object.keys(fields).filter((field) => !allowedFields.includes(field)).length > 0)
      reject("Invalid fields");

    con.query(
      `UPDATE user_account SET ${Object.keys(fields).join(" = ?, ")} = ? WHERE id = ?`,
      [...Object.values(fields), id],
      (err, rows) => (err ? reject(err) : resolve(rows))
    );
  });
}

function delete_user_account(id) {
  return new Promise((resolve, reject) => {
    con.query(`DELETE FROM user_account WHERE id = ?`, id, (err, rows) =>
      err ? reject(err) : resolve(rows)
    );
  });
}

function get_articles() {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM articles`, id, (err, rows) =>
      err ? reject(err) : resolve(rows)
    );
  });
}
