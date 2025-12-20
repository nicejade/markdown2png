import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import * as path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]'
    })
  ],
  build: {
    target: ['edge90', 'chrome90', 'firefox90', 'safari15'],
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 构建后是否生成 source map 文件
    sourcemap: false,
    // chunk 大小警告的限制（单位：kbs）
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 静态资源分类打包
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        // 代码分割策略
        manualChunks: {
          // 将 Vue 相关库单独打包
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // UI 组件库
          'ui-vendor': ['@headlessui/vue', '@heroicons/vue'],
          // 核心插件（Markdown 解析与 DOM 处理）
          'libs-vendor': ['marked', '@zumer/snapdom']
        }
      }
    },
    // 生产环境压缩配置
    minify: 'esbuild'
  },
  // esbuild 特有配置：移除 console 和 debugger
  esbuild: {
    drop: ['console', 'debugger']
  },
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@views': path.resolve(__dirname, './src/views'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@helper': path.resolve(__dirname, './src/helper')
    }
  },
  worker: {
    format: 'es'
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'marked',
      '@headlessui/vue'
    ]
  },
  // 性能优化
  server: {
    // 预热常用文件
    warmup: {
      clientFiles: [
        './src/views/Home.vue',
        './src/views/Digest.vue',
        './src/components/**/*.vue'
      ]
    }
  }
})
