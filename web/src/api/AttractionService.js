import { api } from "src/boot/axios";

// 取得所有景點座標相關資訊
export const get_all_coordinate = async () => {
  try {
    const res = await api.get("/map/attractions?detail=coordinate");
    return res.data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

// 取得景點資訊卡資訊
export const get_attractions_card_info = async (marker_id) => {
  try {
    const res = await api.get(`/map/attractions/${marker_id}?detail=card`);
    return res.data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

// 取得與學校相關的景點列表
export const get_school_attraction_list = async (id) => {
  try {
    const res = await api.get(`/map/attractions?school=${id}`);
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err.response.data.message };
  }
};

// 取得景點詳細資訊
export const get_attraction_info = async (id) => {
  try {
    const res = await api.get(`/map/attractions/${id}`);
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err.response.data.message };
  }
};
