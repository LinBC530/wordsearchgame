import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", {
  state: () => ({
    id: null,
    school_number: null,
    name: null,
    islogin: false
  }),
  actions: {
    set_account(id, school_number, name) {
      this.id = id;
      this.school_number = school_number;
      this.name = name;
      this.islogin = true
    },
    get_account() {
      return {
        id: this.id,
        school_number: this.school_number,
        name: this.name,
      };
    },
  },
});
