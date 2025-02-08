import { api } from "src/boot/axios";

// 取得遊戲
export const get_game = async (id) => {
  try {
    const res = await api.get(`/games/${id}`);
    return { success: true, data: res.data };
  } catch (err) {
    console.log(err);
    return { success: false, message: err.response.data.message };
  }
}

// 依分組取得遊戲列表
export const get_games_by_group = async () => {
  try {
    const res = await api.get(`/games`);
    return { success: true, data: res.data };
  } catch (err) {
    console.log(err);
    return { success: false, message: err.response.data.message };
  }
};
