import { defineStore } from 'pinia'
import { DEFAULT_TEXT, CURRENT_CONTENT, HAVE_DATE, CURRENT_THEME, CURRENT_SIZE, THEME_ARR, SIZES_ARR } from './../helper/constant'

export const useContentStore = defineStore({
  id: 'content',

  state: () => {
    const defaultSizeIdx = window.innerWidth >= 960 ? 'laptop' : 'mobile'
    return {
      isWithDate: !!localStorage.getItem(HAVE_DATE),
      content: localStorage.getItem(CURRENT_CONTENT) || DEFAULT_TEXT,
      currentTheme: localStorage.getItem(CURRENT_THEME) || THEME_ARR[0].id,
      currentSize: localStorage.getItem(CURRENT_SIZE) || defaultSizeIdx,
    }
  },

  getters: {},

  actions: {
    updateContent(content: string) {
      if (!content || 'undefined' === content) return

      this.content = content
      localStorage.setItem(CURRENT_CONTENT, content)
    },

    updateWithDate(isWith: boolean) {
      this.isWithDate = isWith
      localStorage.setItem(HAVE_DATE, isWith ? '1' : '')
    },

    updateCurrentTheme(id: string) {
      this.currentTheme = id
      localStorage.setItem(CURRENT_THEME, id)
    },

    updateCurrentSize(id: string) {
      this.currentSize = id
      localStorage.setItem(CURRENT_SIZE, id)
    }
  },
})
