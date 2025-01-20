import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    message: '',
    isVisible: false,
    timeout: 3000
  }),

  actions: {
    show(message: string, duration?: number) {
      this.message = message
      this.isVisible = true

      setTimeout(() => {
        this.isVisible = false
      }, duration || this.timeout)
    },

    hide() {
      this.isVisible = false
      this.message = ''
    }
  }
})