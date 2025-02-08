import { api } from "src/boot/axios";

export const get_attraction_related_artice = async (id, limit, artice_type) => {
  try {
    let url;
    if (Array.isArray(artice_type))
      url = `/articles/${id}/relatedarticles?limit=${limit}&artice_type[]=${artice_type.join(
        "&artice_type[]="
      )}`;
    else
      url = `/articles/${id}/relatedarticles?limit=${limit}&artice_type=${artice_type}`;
    const res = await api.get(url);
    return { success: true, data: res.data };
  } catch (err) {
    console.log(err);
    return { success: false, message: err.response.data.message };
  }
};

// 取得文章列表，過濾條件：*分頁(page)、*每頁筆數(limit)、文章類型(article_type)、景點(attraction)
export const get_articles = async (filter) => {
  try {
    const { page, limit, article_type, attraction, school, tag } = filter;

    // 建構查询参数
    const queryParams = new URLSearchParams({ limit, page });

    // 如果有 article_type 或 attraction，加入查询参数
    if (Array.isArray(article_type)) article_type.forEach((type_id) => queryParams.append("article_type", type_id));
    else if (article_type) queryParams.append("article_type[]", article_type);
    if (attraction) queryParams.append("attraction", attraction);
    if (Array.isArray(tag)) tag.forEach((tag_id) => queryParams.append("tag[]", tag_id));
    else if (tag) queryParams.append("tag", tag);
    if (school) queryParams.append("school", school);

    // 組合URL+查询参数
    const res = await api.get(`/articles?${queryParams.toString()}`);
    return { success: true, data: res.data };
  } catch (err) {
    console.log(err);
    return { success: false, message: err.response.data.message };
  }
};

export const get_article = async (id) => {
  try {
    const res = await api.get(`/articles/${id}`);
    return { success: true, data: res.data };
  } catch (err) {
    console.log(err);
    return { success: false, message: err.response.data.message };
  }
};

export const get_artice_related_artices = async (id, limit, page) => {
  try {
    const res = await api.get(`/articles/${id}/related?limit=${limit}&page=${page}`);
    return { success: true, data: res.data };
  } catch (err) {
    console.log(err);
    return { success: false, message: err.response.data.message };
  }
}

export const search_keyword_articles = async (filter) => {
  try {
    const { keyword, page, limit } = filter;

    console.log(keyword, page, limit);
    const res = await api.get(`/articles/search?keyword=${keyword}&page=${page}&limit=${limit}`);
    return { success: true, data: res.data };
  } catch (err) {
    console.log(err);
    return { success: false, message: err.response.data.message };
  }
}
