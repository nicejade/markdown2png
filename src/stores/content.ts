import { defineStore } from 'pinia'

const defaultText = `## 如何使用？

在 Foucs 状态，输入您的内容（支持 \`Markdown\` 格式）；在 Blur 状态，查看预览效果；点击「保存图片」，即可将内容生成图片并下载至本地。
`

export const useContentStore = defineStore({
  id: 'content',

  state: () => {
    return {
      content: defaultText
    }
  },

  getters: {},

  actions: {}
})
