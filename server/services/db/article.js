// 這是文章類型資料的資料庫操作方法

const pool = require("./dbPool");

class Article {
  // 新增文章
  static async add(data) {
    const article_row = [
      data.attractions_id,
      data.article_type,
      data.title,
      data.content,
      data.voice_path,
    ];

    const [result] = await pool.query(
      `INSERT INTO article (attractions_id, article_type, title, content, voice_path,) VALUES (?, ?, ?)`,
      article_row
    );

    return { affectedRows: result.affectedRows };
  }

  // 刪除文章
  static async delete(id) {
    const [result] = await pool.query(`DELETE FROM article WHERE id = ?`, [id]);

    return { affectedRows: result.affectedRows };
  }

  // 更新文章
  static async update(id, data) {
    const [result] = await pool.query(
      `UPDATE article SET ${Object.keys(data).join(" = ?, ")} = ? WHERE id = ?`,
      [...Object.values(data), id]
    );

    return { affectedRows: result.affectedRows };
  }

  // 查詢文章
  static async find_article(id) {
    const [[result]] = await pool.query(
      `
      SELECT 
        article.id,
        article.title,
        article.auther,
        article.content,
        JSON_OBJECT('id', article.attractions_id, 'name', attractions.name) attraction,
        JSON_OBJECT('id', article.article_type, 'name', article_type.name) article_type,
        ANY_VALUE(article.title) title, 
        CASE
          WHEN COUNT(article_image.id) > 0 THEN 
            JSON_ARRAYAGG(article_image.image_path)
          ELSE 
            JSON_ARRAY()
        END AS images,
        CASE
          WHEN COUNT(article_tag.id) > 0 THEN 
            JSON_ARRAYAGG(JSON_OBJECT('id', article_tag.id, 'name', article_tag.name))
          ELSE 
            JSON_ARRAY()
        END AS tags,
          CASE
          WHEN article_analysis.word IS NULL AND
            article_analysis.method IS NULL AND
            article_analysis.emotional_narrative IS NULL AND
            article_analysis.emotional_sentences IS NULL AND
            article_analysis.additional_notes IS NULL
          THEN NULL
          ELSE JSON_OBJECT(
            'word', article_analysis.word,
            'method', article_analysis.method,
            'emotional_narrative', article_analysis.emotional_narrative,
            'emotional_sentences', article_analysis.emotional_sentences,
            'additional_notes', article_analysis.additional_notes
          )
        END AS article_parse
      FROM literary_soundscape.article article
      LEFT JOIN literary_soundscape.article_type article_type ON article.article_type = article_type.id
      LEFT JOIN literary_soundscape.article_tag_association article_tag_association ON article.id = article_tag_association.article_id
      LEFT JOIN literary_soundscape.article_tag article_tag ON article_tag_association.tag_id = article_tag.id
      LEFT JOIN literary_soundscape.attractions attractions ON article.attractions_id = attractions.id
      LEFT JOIN literary_soundscape.article_analysis article_analysis ON article.id = article_analysis.article_id
      LEFT JOIN literary_soundscape.article_image article_image ON article.id = article_image.article_id
      WHERE article.id = ?
      GROUP BY article.id;`,
      [id]
    );

    return result;
  }

  // 查詢文章列表
  static async find_articles(filter) {
    const {
      page = 1,
      limit = 5,
      article_type,
      attraction,
      school,
      tag,
    } = filter;

    const offset = limit * (page - 1);
    let conditions = [];
    let params = [];

    // 資料列表篩選條件，依照傳入的參數組合 SQL 查詢條件
    // 景點編號
    if (attraction) {
      conditions.push("article.attractions_id = ?");
      params.push(attraction);
    }
    // 文章類型，可為數值或數組
    if (article_type) {
      conditions.push("article.article_type IN (?)");
      params.push(article_type);
    }
    // 文章標籤，可為數值或數組
    if (tag) {
      conditions.push(
        `article.id IN ( SELECT DISTINCT article_id FROM article_tag_association WHERE tag_id IN (?))`
      );
      params.push(tag);
    }
    // 學校編號
    if (school) {
      conditions.push("school.id = ?");
      params.push(school);
    }

    // 組合 SQL WHERE 條件
    const filter_items = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    // SQL 查詢條件參數
    // const data_params = [...params, limit, offset];

    const total_sql = `
      SELECT COUNT(id) AS total 
      FROM literary_soundscape.article 
      WHERE 
        id IN (
          SELECT article.id
          FROM literary_soundscape.article article
          LEFT JOIN literary_soundscape.article_type article_type ON article.article_type = article_type.id
          LEFT JOIN literary_soundscape.article_tag_association article_tag_association ON article.id = article_tag_association.article_id
          LEFT JOIN literary_soundscape.article_tag article_tag ON article_tag_association.tag_id = article_tag.id
          LEFT JOIN literary_soundscape.attractions attractions ON article.attractions_id = attractions.id
          LEFT JOIN literary_soundscape.school school ON attractions.school_id = school.id
          ${filter_items}
          GROUP BY article.id
        );`;

    const data_sql = `
      SELECT 
        article.id, 
        JSON_OBJECT('id', school.id, 'name', school.name) AS school, 
        JSON_OBJECT('id', article.attractions_id, 'name', attractions.name) attraction,
        JSON_OBJECT('id', article.article_type, 'name', article_type.name) article_type,
        ANY_VALUE(article.title) title, 
        COALESCE(
          IF (
            COUNT(article_tag.id) > 0, 
            JSON_ARRAYAGG(JSON_OBJECT('id', article_tag.id, 'name', article_tag.name)), 
            NULL
          ), 
          JSON_ARRAY()
        ) AS tags
      FROM literary_soundscape.article article
      LEFT JOIN literary_soundscape.article_type article_type ON article.article_type = article_type.id
      LEFT JOIN literary_soundscape.article_tag_association article_tag_association ON article.id = article_tag_association.article_id
      LEFT JOIN literary_soundscape.article_tag article_tag ON article_tag_association.tag_id = article_tag.id
      LEFT JOIN literary_soundscape.attractions attractions ON article.attractions_id = attractions.id
      LEFT JOIN literary_soundscape.school school ON attractions.school_id = school.id
      ${filter_items}
      GROUP BY article.id
      ORDER BY article.id DESC
      LIMIT ?
      OFFSET ?;`;

    // 查詢總筆數
    const [[result_total]] = await pool.query(total_sql, [...params]);

    // 查詢資料列表
    const [result_data] = await pool.query(data_sql, [
      ...params,
      limit,
      offset,
    ]);

    return { total: result_total.total, datas: result_data };
  }

  // 查詢該文章的其他相關文章
  static async find_related_articles(filter) {
    try {
      const { article_id, page, limit } = filter;
      const offset = limit * (page - 1);

      const [[result_total]] = await pool.query(
        `
        SELECT COUNT(id) AS total
        FROM literary_soundscape.article
        WHERE 
          id IN (
          SELECT article.id 
          FROM literary_soundscape.related_article related_article
          LEFT JOIN literary_soundscape.article article ON related_article.related_article_id = article.id
          LEFT JOIN literary_soundscape.article_type article_type ON article.article_type = article_type.id
          LEFT JOIN literary_soundscape.article_tag_association article_tag_association ON article.id = article_tag_association.article_id
          LEFT JOIN literary_soundscape.article_tag article_tag ON article_tag_association.tag_id = article_tag.id
          LEFT JOIN literary_soundscape.attractions attractions ON article.attractions_id = attractions.id
          WHERE related_article.article_id = 4
          GROUP BY related_article.related_article_id
          );`,
        [article_id]
      );

      const [result_data] = await pool.query(
        `
      SELECT 
        article.id, 
        JSON_OBJECT('id', article.attractions_id, 'name', attractions.name) attraction,
        JSON_OBJECT('id', article.article_type, 'name', article_type.name) article_type,
        ANY_VALUE(article.title) title, 
        COALESCE(
          IF (
            COUNT(article_tag.id) > 0, 
                  JSON_ARRAYAGG(JSON_OBJECT('id', article_tag.id, 'name', article_tag.name)), 
                  NULL
          ), 
          JSON_ARRAY()
        ) AS tags
      FROM related_article
      LEFT JOIN article ON related_article.related_article_id = article.id
      LEFT JOIN article_type ON article.article_type = article_type.id
      LEFT JOIN article_tag_association ON article.id = article_tag_association.article_id
      LEFT JOIN article_tag ON article_tag_association.tag_id = article_tag.id
      LEFT JOIN attractions ON article.attractions_id = attractions.id
      WHERE related_article.article_id = ?
      GROUP BY related_article.related_article_id
      ORDER BY related_article.related_article_id DESC
      LIMIT ?
      OFFSET ?;`,
        [article_id, limit, offset]
      );

      return { total: result_total.total, datas: result_data };
    } catch (err) {
      console.log(err);
      return { total: 0, datas: [] };
    }
  }

  static async keyword_search_articles(filter) {
    const { keyword, page, limit } = filter;
    const offset = limit * (page - 1);
    if (Array.isArray(keyword)) keyword = keyword.join(" ");
    const keywordArray = new Array(10).fill(keyword);

    const [result_total] = await pool.query(
      `
      SELECT COUNT(id) AS total 
      FROM literary_soundscape.article article 
      WHERE 
        id in (
          SELECT article.id
          FROM literary_soundscape.article article 
          LEFT JOIN literary_soundscape.article_analysis article_analysis ON article.id = article_analysis.article_id
          LEFT JOIN literary_soundscape.article_tag_association article_tag_association ON article.id = article_tag_association.article_id
          LEFT JOIN literary_soundscape.article_tag article_tag ON article_tag_association.tag_id = article_tag.id
          LEFT JOIN literary_soundscape.article_type article_type ON article.article_type = article_type.id
          LEFT JOIN literary_soundscape.attractions attractions ON article.attractions_id = attractions.id
          WHERE 
            MATCH(article.title, article.auther, article.content) AGAINST(? IN NATURAL LANGUAGE MODE) 
              OR MATCH(article_tag.name) AGAINST(? IN NATURAL LANGUAGE MODE) 
              OR MATCH(article_type.name) AGAINST(? IN NATURAL LANGUAGE MODE) 
              OR MATCH(
              article_analysis.word, 
                  article_analysis.method, 
                  article_analysis.emotional_narrative, 
                  article_analysis.emotional_sentences, 
                  article_analysis.additional_notes
            ) AGAINST(? IN NATURAL LANGUAGE MODE)
            GROUP BY article.id
        );
        `,
      [...Array(4).fill(keyword)]
    );

    const [result_data] = await pool.query(
      `
      SELECT 
        MAX(
          MATCH(article.title) AGAINST(? IN BOOLEAN MODE) * 3
          + MATCH(article.auther) AGAINST(? IN BOOLEAN MODE)
          + MATCH(article.content) AGAINST(? IN BOOLEAN MODE)
          + MATCH(article_tag.name) AGAINST(? IN BOOLEAN MODE) * 2
          + MATCH(article_type.name) AGAINST(? IN BOOLEAN MODE) * 1.5
          + MATCH(
            article_analysis.word, 
            article_analysis.method, 
            article_analysis.emotional_narrative, 
            article_analysis.emotional_sentences, 
            article_analysis.additional_notes
          ) AGAINST(? IN BOOLEAN MODE)
        ) AS score,
        article.id, 
        JSON_OBJECT('id', article.attractions_id, 'name', attractions.name) attraction,
        JSON_OBJECT('id', article.article_type, 'name', article_type.name) article_type,
        ANY_VALUE(article.title) title, 
        COALESCE(
          IF (
            COUNT(article_tag.id) > 0, 
                  JSON_ARRAYAGG(JSON_OBJECT('id', article_tag.id, 'name', article_tag.name)), 
                  NULL
          ), 
          JSON_ARRAY()
        ) AS tags
      FROM literary_soundscape.article article
      LEFT JOIN literary_soundscape.article_analysis article_analysis ON article.id = article_analysis.article_id
      LEFT JOIN literary_soundscape.article_tag_association article_tag_association ON article.id = article_tag_association.article_id
      LEFT JOIN literary_soundscape.article_tag article_tag ON article_tag_association.tag_id = article_tag.id
      LEFT JOIN literary_soundscape.article_type article_type ON article.article_type = article_type.id
      LEFT JOIN literary_soundscape.attractions attractions ON article.attractions_id = attractions.id
      WHERE 
        MATCH(article.title, article.auther, article.content) AGAINST(? IN NATURAL LANGUAGE MODE) 
          OR MATCH(article_tag.name) AGAINST(? IN NATURAL LANGUAGE MODE) 
          OR MATCH(article_type.name) AGAINST(? IN NATURAL LANGUAGE MODE) 
          OR MATCH(
          article_analysis.word, 
              article_analysis.method, 
              article_analysis.emotional_narrative, 
              article_analysis.emotional_sentences, 
              article_analysis.additional_notes
        ) AGAINST(? IN NATURAL LANGUAGE MODE) 
      GROUP BY article.id
      ORDER BY score DESC
      LIMIT ? 
      OFFSET ?;`,
      [...keywordArray, limit, offset]
    );

    return { total: result_total.total, datas: result_data };
  }

  static async find_img_gen_article() {
    
  }
}

module.exports = Article;
