const pool = require("./dbPool");

class Manager {
  constructor(data) {
    // 姓名
    this.name = data.name;
    // 帳號
    this.account = data.account;
    // 密碼
    this.password = data.password;
  }

  // 新增管理者資料
  static async add(data) {
    const user_row = data
      ? [data.school_id, data.group_id, data.name, data.school_number]
      : [this.school_id, this.group_id, this.name, this.school_number];

    // 欄位空值檢測
    if (user_row.some((field) => field == null || field === "")) {
      throw new Error("包含空值欄位");
    }

    // 執行資料庫插入操作
    return await pool.query(
      `INSERT INTO user_account (name, account, password) VALUES (?, ?, ?)`,
      user_row
    );
  }

  // 刪除管理者資料
  static async delete(id) {
    // 檢查是否有傳入id
    if (!id) throw new Error("傳入參數為空");

    return await pool.query(`DELETE FROM user_account WHERE id = ?`, id);
  }

  // 更新使用者資料
  static async update(id, data) {
    // 檢查是否有傳入id
    if (!id || !data) throw new Error("傳入參數為空");

    // 欄位檢查
    const allowedFields = ["school_id", "group_id", "name", "school_number"];

    // 欄位檢查
    if (Object.keys(data).filter((field) => !allowedFields.includes(field)).length > 0)
      throw new Error("無效欄位");

    return await pool.query(
      `UPDATE user_account SET ${Object.keys(data).join(
        " = ?, "
      )} = ? WHERE id = ?`,
      [...Object.values(data), id]
    );
  }

  // 查詢管理者資料
  static async find_manager(school_number) {
    if (!school_number) throw new Error("傳入參數為空");

    return await pool.query(
      `SELECT id, school_number, name FROM user_account WHERE school_number = ?`,
      [school_number]
    );
  }

  // 取得管理者列表
  static async get_manager_list() {
    return await pool.query(`SELECT * FROM user_account`);
  }
}

module.exports = Manager;
