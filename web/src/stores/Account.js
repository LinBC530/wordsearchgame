import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", {
  state: () => ({
    id: null,
    school_number: null,
    name: null,
    islogin: false
  }),
  actions: {
    // 存放帳戶資訊
    set_account(id, school_number, name) {
      this.id = id;
      this.school_number = school_number;
      this.name = name;
      this.islogin = true
    },
    // 清除帳戶資訊
    get_account() {
      return {
        id: this.id,
        school_number: this.school_number,
        name: this.name,
      };
    },
  },
  // 啟用數據持久化，存儲在session
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user-store',
        storage: sessionStorage
      }
    ]
  }
});
