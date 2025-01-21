<template>
  <div class="w-[80rem] md:w-full flex md:flex-col items-start justify-between p-6">

    <div class="w-3/5 mb-4 mr-8 md:w-full">
      <canvas id="digest" ref="canvasRef" width="500" height="660" class="w-full border rounded-xl"></canvas>
    </div>

    <div class="w-2/5 md:w-full">
      <!-- 文字样式设置 -->
      <div class="w-full px-6 py-6 mx-auto space-y-6 bg-white shadow-lg rounded-xl">
        <strong class="text-lg font-medium">编辑文字</strong>
        <!-- 编辑区域 -->
        <div class="mb-4">
          <textarea v-model="text" rows="6" maxlength="1000"
            class="w-full min-h-[120px] p-4 rounded-lg border border-gray-200 resize-none focus:outline-none focus:border-gray-300"
            placeholder="请输入想要呈现的文字...">
          </textarea>
        </div>

        <div class="grid grid-cols-2 gap-6 md:grid-cols-1">
          <!-- 字体 -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-400">字体</label>
            <select v-model="fontFamily" class="w-full h-10 px-3 border border-gray-200 rounded-lg">
              <option value="system-ui">系统默认</option>
            </select>
          </div>
          <!-- 字号 -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-400">字号</label>
            <div class="flex items-center">
              <input type="range" v-model="fontSize" min="12" max="72" class="flex-1 mr-4" />
              <span class="text-sm">{{ fontSize }}px</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6 md:grid-cols-1">
          <!-- 行高 -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-400">行高</label>
            <div class="flex items-center">
              <input type="range" v-model="lineHeight" min="1" max="3" step="0.1" class="flex-1 mr-4" />
              <span class="text-sm">{{ lineHeight }}倍</span>
            </div>
          </div>
          <!-- 间距 -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-400">间距</label>
            <div class="flex items-center">
              <input type="range" v-model="letterSpacing" min="0" max="200" class="flex-1 mr-4" />
              <span class="text-sm">{{ letterSpacing }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6 md:grid-cols-1">
          <!-- 字重 -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-400">字重</label>
            <select v-model="fontWeight" class="w-full h-10 px-3 border border-gray-200 rounded-lg">
              <option value="normal">常规</option>
              <option value="medium">中等</option>
              <option value="bold">粗体</option>
            </select>
          </div>
          <!-- 文字颜色 -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-400">文字颜色</label>
            <input type="color" v-model="textColor" class="w-full h-10 border border-gray-200 rounded-lg" />
          </div>
        </div>

        <!-- 背景选择 -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-400">选择背景</label>
          <div class="grid grid-cols-3 gap-3">
            <div v-for="(bg, index) in backgrounds" :key="index"
              class="w-24 h-24 overflow-hidden border rounded-lg cursor-pointer"
              :class="{ 'ring-2 ring-blue-500': selectedBg === index }" @click="selectedBg = index">
              <img :src="bg" class="object-cover w-full h-full" />
            </div>
          </div>
        </div>
      </div>

      <div class="w-full px-4 py-4 mx-auto my-4 space-y-6 bg-white shadow-sm rounded-xl">
        <div
          class="flex flex-row items-center w-full px-4 py-4 space-x-6 justify-evenly md:space-x-0 md:space-y-6 md:flex-col"
          role="group">
          <button class="block px-4 py-2 text-lg font-bold text-gray-900 border border-gray-300 rounded-md md:w-full"
            @click="onCopyImage">
            复制图片
          </button>
          <button class="block px-4 py-2 text-lg font-bold text-gray-900 border border-gray-300 rounded-md md:w-full"
            @click="onSave2Image">
            保存图片
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref, onMounted, watch } from 'vue'
import { toBlob } from 'html-to-image'
import { download2png } from './../helper/util'
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
const text = ref(`庐山烟雨浙江潮，
未至千般恨不消。
到得还来别无事，
庐山烟雨浙江潮。
──〔北宋〕· 苏轼《观潮》`)
const fontFamily = ref('system-ui')
const fontSize = ref(16)
const lineHeight = ref(2)
const letterSpacing = ref(100)
const fontWeight = ref('normal')
const textColor = ref('#000000')
const selectedBg = ref(0)
const { proxy } = getCurrentInstance() as any

const backgrounds = ref([
  '/share/bg0.png',
  '/share/bg1.png',
  '/share/bg2.png',
  '/share/bg3.png',
  '/share/bg4.png',
  '/share/bg5.png',
])

const canvasRef = ref(null)
const ctx = ref(null)

const options = {
  quality: 1.0,
  pixelRatio: window.devicePixelRatio,
  skipAutoScale: true,
  filter: (node) => {
    return !node.classList || !node.classList.contains('exclude-from-image')
  }
}

onMounted(() => {
  ctx.value = canvasRef.value.getContext('2d')
  loadBackgroundImage()
})

// 加载背景图
const loadBackgroundImage = () => {
  const img = new Image()
  img.onload = () => {
    drawCanvas(img)
  }
  img.src = backgrounds.value[selectedBg.value]
}

// 绘制 canvas
const drawCanvas = (backgroundImage) => {
  const canvas = canvasRef.value
  const context = ctx.value
  const padding = 10 // 设置内边距

  // 清空画布
  context.clearRect(0, 0, canvas.width, canvas.height)

  // 绘制背景
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

  // 设置文字样式
  context.font = `${fontWeight.value} ${fontSize.value}px ${fontFamily.value}`
  context.fillStyle = textColor.value
  context.textAlign = 'left' // 改为左对齐以便处理换行

  // 文本换行处理函数
  const wrapText = (text) => {
    const words = text.split('')
    const lines = []
    let currentLine = ''
    const maxWidth = canvas.width - (padding * 2) // 考虑左右内边距

    words.forEach(char => {
      const testLine = currentLine + char
      const metrics = context.measureText(testLine)
      const testWidth = metrics.width

      if (testWidth > maxWidth && currentLine !== '') {
        lines.push(currentLine)
        currentLine = char
      } else {
        currentLine = testLine
      }
    })
    lines.push(currentLine)
    return lines
  }

  // 处理每一段文本
  const paragraphs = text.value.split('\n')
  const allLines = []
  paragraphs.forEach(para => {
    allLines.push(...wrapText(para))
  })

  // 计算行高和总高度
  const lineHeightPx = fontSize.value * lineHeight.value
  const totalHeight = allLines.length * lineHeightPx

  // 计算起始 Y 坐标（垂直居中）
  let startY = (canvas.height - totalHeight) / 2

  // 绘制文本
  allLines.forEach(line => {
    const chars = line.split('')
    const spacing = letterSpacing.value / 50

    // 计算这一行文本的总宽度
    let totalLineWidth = 0
    chars.forEach(char => {
      totalLineWidth += context.measureText(char).width + spacing
    })

    // 计算居中的起始 X 坐标
    let currentX = (canvas.width - totalLineWidth) / 2

    chars.forEach(char => {
      context.fillText(char, currentX, startY)
      currentX += context.measureText(char).width + spacing
    })
    startY += lineHeightPx
  })
}

// 监听所有样式变化
watch(
  [text, fontFamily, fontSize, lineHeight, letterSpacing, fontWeight, textColor, selectedBg],
  () => {
    loadBackgroundImage()
  },
  { deep: true }
)

function onCopyImage() {
  proxy.$reortGaEvent('save-img', 'share')
  const container = document.getElementById('digest')

  toBlob(container, options)
    .then((blob) => {
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ])
      toast.show('已复制图片至您的剪切板')
    })
    .catch((error) => {
      console.error('复制图片失败:', error)
      toast.show('复制图片失败，请重试')
    })
}

function onSave2Image() {
  proxy.$reortGaEvent('save-img', 'share')
  const container = document.getElementById('digest')
  toBlob(container, options)
    .then((blob) => {
      download2png(blob)
      toast.show('已成功为你保存图片')
    })
    .catch((error) => {
      console.error('保存图片失败:', error)
      toast.show('保存图片失败，请重试')
    })
}
</script>

<style scoped>
input[type="range"] {
  @apply h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-blue-500 rounded-full cursor-pointer;
}
</style>