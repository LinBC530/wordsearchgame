const pool = require("./dbPool");

class WSGame {
  // 依ID查詢遊戲
  static async find_game(id) {
    const [[result]] = await pool.query(
      `
      SELECT
        games.id,
        JSON_OBJECT('id', games.group_id, 'name', game_groups.name) AS game_groups,
        games.name,
        games.data 
      FROM wordsearchgame.games games
      LEFT JOIN wordsearchgame.game_groups game_groups ON games.group_id = game_groups.id
      WHERE games.id = ?`,
      [id]
    );

    return result;
  }
  // 查詢所有遊戲，依群組分組
  static async find_all_game_by_group() {
    const [result] = await pool.query(
      `
      SELECT
        game_groups.id,
        game_groups.name,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', games.id,
            'name', games.name,
            'data', games.data
          )
        ) AS games
      FROM wordsearchgame.game_groups
      LEFT JOIN wordsearchgame.games ON games.group_id = game_groups.id
      GROUP BY game_groups.id, game_groups.name;`
    );

    return result;
  }
}

module.exports = WSGame;