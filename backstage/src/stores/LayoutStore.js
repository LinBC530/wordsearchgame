import { defineStore, acceptHMRUpdate } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    isDrawerOpen: false,
  }),
  actions: {
    drawer_switch() {
      this.isDrawerOpen = !this.isDrawerOpen
    }
  }
})
