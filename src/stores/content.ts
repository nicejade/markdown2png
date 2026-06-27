import { defineStore } from 'pinia'
import { DEFAULT_TEXT, CURRENT_CONTENT, HAVE_DATE, HAVE_WATERMARK, CURRENT_THEME, CURRENT_SIZE, TEXT_ALIGN, WRAPPER_MARGIN, FONT_FAMILY, THEME_ARR, SIZES_ARR } from './../helper/constant'

export const useContentStore = defineStore({
  id: 'content',

  state: () => {
    const defaultSizeIdx = window.innerWidth >= 960 ? 'laptop' : 'mobile'
    return {
      isWithDate: !!localStorage.getItem(HAVE_DATE),
      isWithWatermark: !!localStorage.getItem(HAVE_WATERMARK),
      content: localStorage.getItem(CURRENT_CONTENT) || DEFAULT_TEXT,
      currentTheme: localStorage.getItem(CURRENT_THEME) || THEME_ARR[0].id,
      currentSize: localStorage.getItem(CURRENT_SIZE) || defaultSizeIdx,
      textAlign: localStorage.getItem(TEXT_ALIGN) || 'left',
      wrapperMargin: localStorage.getItem(WRAPPER_MARGIN) || 'standard',
      fontFamily: localStorage.getItem(FONT_FAMILY) || 'default',
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

    updateWithWatermark(isWith: boolean) {
      this.isWithWatermark = isWith
      localStorage.setItem(HAVE_WATERMARK, isWith ? '1' : '')
    },

    updateCurrentTheme(id: string) {
      this.currentTheme = id
      localStorage.setItem(CURRENT_THEME, id)
    },

    updateCurrentSize(id: string) {
      this.currentSize = id
      localStorage.setItem(CURRENT_SIZE, id)
    },

    updateTextAlign(id: string) {
      this.textAlign = id
      localStorage.setItem(TEXT_ALIGN, id)
    },

    updateWrapperMargin(id: string) {
      this.wrapperMargin = id
      localStorage.setItem(WRAPPER_MARGIN, id)
    },

    updateFontFamily(id: string) {
      this.fontFamily = id
      localStorage.setItem(FONT_FAMILY, id)
    },
  },
})
