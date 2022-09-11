import { defineStore } from 'pinia'
import { deepClone } from './../helper/util'
import { DEFAULT_TEXT, STORAGE_CONTENT, STORAGE_DATE, STORAGE_THEME, STORAGE_SIZE, THEME_ARR, SIZES_ARR } from './../helper/constant'

const parseJSONSafely = (str: string) => {
  try {
    return JSON.parse(str);
  }
  catch (err: any) {
    console.error(`Something Error @ ${err.message}`);
    return {}
  }
}

const getStorageItem = (key: string) => {
  const value: any = localStorage.getItem(key)
  return parseJSONSafely(value)
}

export const useContentStore = defineStore({
  id: 'content',

  state: () => {
    return {
      isWithDate: !!localStorage.getItem(STORAGE_DATE),
      content: localStorage.getItem(STORAGE_CONTENT) || DEFAULT_TEXT,
      currentTheme: getStorageItem(STORAGE_THEME) || deepClone(THEME_ARR[0]),
      currentSize: getStorageItem(STORAGE_SIZE) || deepClone(SIZES_ARR[0]),
    }
  },

  getters: {},

  actions: {
    updateContent(content: string) {
      if (!content || 'undefined' === content) return

      this.content = content
      localStorage.setItem(STORAGE_CONTENT, content)
    },

    updateWithDate(isWith: boolean) {
      this.isWithDate = isWith
      localStorage.setItem(STORAGE_DATE, isWith ? '1' : '')
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
