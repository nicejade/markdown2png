import { defineStore } from 'pinia'

type ToastType = 'success' | 'error' | 'info'

interface ToastOptions {
  message: string
  duration?: number
  type?: ToastType
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    message: '',
    isVisible: false,
    timeout: 5000,
    type: 'info' as ToastType
  }),

  actions: {
    show(messageOrOptions: string | ToastOptions) {
      const options = typeof messageOrOptions === 'string' 
        ? { message: messageOrOptions } 
        : messageOrOptions

      this.message = options.message
      this.type = options.type || 'info'
      this.isVisible = true

      setTimeout(() => {
        this.isVisible = false
      }, options.duration || this.timeout)
    },

    success(message: string, duration?: number) {
      this.show({ message, type: 'success', duration })
    },

    error(message: string, duration?: number) {
      this.show({ message, type: 'error', duration })
    },

    info(message: string, duration?: number) {
      this.show({ message, type: 'info', duration })
    },

    hide() {
      this.isVisible = false
      this.message = ''
      this.type = 'info'
    }
  }
})