import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: {
        title: '玉桃文飨轩 - 一键将文本转换为精美图片 | Markdown 转图片工具',
        description: '玉桃文飨轩，专业的文本转图片工具。一键将 Markdown 转换为精美图片，支持书摘模式、自定义主题、字体和背景。所有数据本地处理保障隐私安全。',
        keywords: '玉桃文飨轩,Markdown转图片,文本转图片工具,书摘生成器,文字转长图'
      }
    },
    {
      path: '/digest',
      name: 'digest',
      component: () => import('../views/Digest.vue'),
      meta: {
        title: '书摘模式 - 玉桃文飨轩 | 精美书摘图片生成器',
        description: '使用玉桃文飨轩的书摘模式，将您的读书笔记和精彩书摘转换为精美的分享图片。支持多种排版样式和背景选择。',
        keywords: '书摘生成器,读书笔记工具,书摘转图片,文章配图工具'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue'),
      meta: {
        title: '关于我们 - 玉桃文飨轩',
        description: '了解玉桃文飨轩的功能特性、使用方法和技术实现。基于 Vue3、Vite、TailwindCSS 构建的现代化文本转图片工具。',
        keywords: '关于玉桃文飨轩,工具介绍,使用说明'
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// 路由守卫：动态更新页面标题和 meta 标签
router.beforeEach((to, from, next) => {
  // 更新页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  
  // 更新 meta description
  const descriptionMeta = document.querySelector('meta[name="description"]')
  if (descriptionMeta && to.meta.description) {
    descriptionMeta.setAttribute('content', to.meta.description as string)
  }
  
  // 更新 meta keywords
  const keywordsMeta = document.querySelector('meta[name="keywords"]')
  if (keywordsMeta && to.meta.keywords) {
    keywordsMeta.setAttribute('content', to.meta.keywords as string)
  }
  
  // 更新 Open Graph 标签
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle && to.meta.title) {
    ogTitle.setAttribute('content', to.meta.title as string)
  }
  
  const ogDescription = document.querySelector('meta[property="og:description"]')
  if (ogDescription && to.meta.description) {
    ogDescription.setAttribute('content', to.meta.description as string)
  }
  
  next()
})

export default router
