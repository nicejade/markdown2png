import { defineStore } from 'pinia'
import { DEFAULT_TEXT, STORAGE_CONTENT, STORAGE_DATE, STORAGE_THEME, STORAGE_SIZE } from './../helper/constant'

export const useContentStore = defineStore({
  id: 'content',

  state: () => {
    return {
      isWithDate: JSON.parse(localStorage.getItem(STORAGE_DATE)) || false,
      content: localStorage.getItem(STORAGE_CONTENT) || DEFAULT_TEXT,
      currentTheme: JSON.parse(localStorage.getItem(STORAGE_THEME)) || null,
      currentSize: JSON.parse(localStorage.getItem(STORAGE_SIZE)) || null,
    }
  },

  getters: {},

  actions: {
    updateContent(content: string) {
      this.content = content
      localStorage.setItem(STORAGE_CONTENT, content)
    },

    updateWithDate(isWith: boolean) {
      this.isWithDate = isWith
      localStorage.setItem(STORAGE_DATE, isWith)
    },

    updateCurrentTheme(obj: Object) {
      this.currentTheme = obj
      localStorage.setItem(STORAGE_THEME, JSON.stringify(obj))
    },

    updateCurrentSize(obj: Object) {
      this.currentSize = obj
      localStorage.setItem(STORAGE_SIZE, JSON.stringify(obj))
    }
  },
})
