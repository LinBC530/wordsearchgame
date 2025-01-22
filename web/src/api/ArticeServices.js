import { api } from "src/boot/axios";

export const get_related_artice = async (id, type) => {
  try {
    const url = type? `/articles/${id}/relatedarticles?type=${type}` : `/articles/${id}/related`;
    const res = await api.get(url);
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err.response.data.message };
  }
};

