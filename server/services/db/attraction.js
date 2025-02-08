const pool = require("./dbPool");

class Attraction {
  static async add(data) {
    const [result] = await pool.query(
      `INSERT INTO attractions (title, content, author_id) VALUES (?, ?, ?)`,
      [
        data.school_id,
        data.name,
        data.coordinate,
        data.image_path,
        data.audio_path,
        JSON.stringify(data.introduce),
      ]
    );

    return { affectedRows: result.affectedRows };
  }

  static async delete(id) {
    const [result] = await pool.query(`DELETE FROM attractions WHERE id = ?`, [id]);

    return { affectedRows: result.affectedRows };
  }

  static async update(id, data) {
    // 轉換座標格式為json
    if (data.coordinate) data.coordinate = JSON.stringify(data.coordinate);

    const [result] = await pool.query(
      `UPDATE attractions SET ${Object.keys(data).join(" = ?, ")} = ? WHERE id = ?`,
      [...Object.values(data), id]
    );

    return { affectedRows: result.affectedRows };
  }

  static async get_article_coordinate_list(id) {
    const [result] = await pool.query(
      `SELECT id, name, coordinate FROM attractions`
    );

    return result;
  }

  static async get_school_article_list(school_id) {
    const [result] = await pool.query(
      `SELECT id, name, image_path, introduce FROM attractions WHERE school_id = ?`,
      [school_id]
    );
    
    return result;
  }

  static async get_article(id) {
    const [[result]] = await pool.query(
      `SELECT id, name, image_path, introduce FROM attractions WHERE id = ?`,
      [id]
    );
    return result;
  }

  static async get_articles(id) {
    const [[result]] = await pool.query(
      `SELECT name, image_path, audio_path, introduce, coordinate FROM attractions WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = Attraction;
