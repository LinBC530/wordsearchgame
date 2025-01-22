import { api } from "src/boot/axios";

export const get_all_coordinate = async () => {
  try {
    const res = await api.get("/map/attractions?detail=coordinate");
    return res.data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const get_attractions_card_info = async (marker_id) => {
  try {
    const res = await api.get(`/map/attractions/${marker_id}?detail=card`);
    return res.data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
