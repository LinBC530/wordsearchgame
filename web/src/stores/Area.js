import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", {
  state: () => ({
    attractionsBySchool: [],
    attractionDetails: {}
  }),
  getters: {
    // 根據 schoolId 獲取景點列表
    getAttractionsBySchool: (state) => {
      return state.attractionsBySchool || [];
    },
    // 根據 attractionId 獲取景點詳細資料
    getAttractionDetails: (state) => {
      return state.attractionDetails[attractionId] || null;
    },
  },
  actions: {

  },
});
