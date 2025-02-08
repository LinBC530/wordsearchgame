const pool = require("./dbPool");

class WSGame {
  static async add(data) {}
  static async delete(id) {}
  static async update(id, data) {}
  static async find_game(id) {
    const [[result]] = await pool.query(
      `
      SELECT
        game.id,
        JSON_OBJECT('id', game.group_id, 'name', game_group.name) AS game_group,
        game.name,
        game.data 
      FROM literary_soundscape.game game
      LEFT JOIN literary_soundscape.game_group game_group ON game.group_id = game_group.id
      WHERE game.id = ?`,
      [id]
    );

    return result;
  }
  static async find_all_game_by_group() {
    const [result] = await pool.query(
      `
        SELECT 
            game_group.id,
            game_group.name,
            JSON_ARRAY(JSON_OBJECT('id', game.id, 'name', game.name, 'data', game.data)) AS games
        FROM literary_soundscape.game game
        LEFT JOIN literary_soundscape.game_group game_group ON game.group_id = game_group.id;`
    );

    return result;
  }
}

module.exports = WSGame;