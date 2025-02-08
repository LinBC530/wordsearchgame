const pool = require("./dbPool");

class User {
  constructor(data) {
    // 學號
    this.school_number = data.school_number;
    // 姓名
    this.name = data.name;
    // 學校ID
    this.school_id = data.school_id;
    // 分群ID
    this.group_id = data.group_id;
  }

  static async add(data) {
    if (!Array.isArray(data)) {
      const user_row = data
        ? [data.school_id, data.group_id, data.name, data.school_number]
        : [this.school_id, this.group_id, this.name, this.school_number];

      // 檢查帳號是否已被註冊
      if (await this.find_user(user_row[3])) {
        throw new Error("帳號已被註冊");
      }

      // 返回新增結果
      const [result] = await pool.query(
        `INSERT INTO user_account (school_id, group_id, name, school_number) VALUES (?, ?, ?, ?)`,
        user_row
      );

      return { affectedRows: result.affectedRows };
    } else {
      // 批次處理數量
      const batch_size = 100;

      // 計算批次數量
      const total_batches = Math.ceil(data.length / batch_size);
      // 記錄新增使用這資料成功的總數量
      let total_inserted = 0;

      // 從連接池中取得一個獨立連接
      const connection = await pool.getConnection();
      try {
        // 開始事務
        await connection.beginTransaction();

        for (let i = 0; i < total_batches; i++) {
          // 切分批次資料
          const batch = data.slice(i * batch_size, (i + 1) * batch_size);

          // 重組批次資料
          const user_rows = batch.map((user) => [
            user.school_id,
            user.group_id,
            user.name,
            user.school_number,
          ]);

          // 批次插入
          const [result] = await connection.query(
            "INSERT INTO user_account (school_id, group_id, name, school_number) VALUES ?",
            [user_rows]
          );

          // 累計成功插入的數量
          total_inserted += result.affectedRows;
        }

        // 提交事務
        await connection.commit();
        // 返回總插入數量
        return { totalInserted: total_inserted };
      } catch (err) {
        // 回復至初始事務狀態
        await connection.rollback();
        throw err;
      } finally {
        // 釋放連接回連接池
        connection.release();
      }
    }
  }

  // 刪除使用者資料
  static async delete(id) {
    // 檢查是否有傳入id
    if (!id) throw new Error("傳入參數為空");

    const [result] = await pool.query(`DELETE FROM user_account WHERE id = ?`, id);

    return { affectedRows: result.affectedRows }
  }

  // 更新使用者資料
  static async update(id, data) {
    // 檢查是否有傳入id
    if (!id || !data) throw new Error("傳入參數為空");

    // 欄位檢查
    const allowedFields = ["school_id", "group_id", "name", "school_number"];

    // 欄位檢查
    if (
      Object.keys(data).filter((field) => !allowedFields.includes(field))
        .length > 0
    )
      throw new Error("無效欄位");

    const [result] = await pool.query(
      `UPDATE user_account SET ${Object.keys(data).join(
        " = ?, "
      )} = ? WHERE id = ?`,
      [...Object.values(data), id]
    );

    return { affectedRows: result.affectedRows };
  }

  // 查詢使用者資料
  static async find_user(school_number) {
    if (!school_number) throw new Error("傳入參數為空");

    const data = await pool.query(
      `SELECT id, school_number, name FROM user_account WHERE school_number = ?`,
      [school_number]
    );

    return data[0].length > 0 ? data[0][0] : null;
  }

  // 取得使用者列表
  static async get_user_list() {
    const [result] = await pool.query(`SELECT * FROM user_account`);
    return result;
  }
}

module.exports = User;
