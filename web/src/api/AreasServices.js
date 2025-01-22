import { api } from "src/boot/axios";

export const get_school_areas_list = async (id) => {
  try {
    const res = await api.get(`/map/attractions?school=${id}`);
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err.response.data.message };
  }
};

export const get_areas_info = async (id) => { 
  try {
    const res = await api.get(`/map/attractions/${id}`);
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, message: err.response.data.message };
  }
};
