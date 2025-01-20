<template>
  <div class="p-6 space-y-6">
    <!-- 编辑区域 -->
    <div class="mb-4">
      <textarea v-model="text" rows="6" maxlength="1000"
        class="w-full min-h-[120px] p-4 rounded-lg border border-gray-200 resize-none focus:outline-none focus:border-gray-300"
        placeholder="请输入想要呈现的文字...">
      </textarea>
    </div>

    <div id="container" class="mb-4">
      <canvas ref="canvasRef" width="702" height="912" class="w-full border rounded-lg"></canvas>
    </div>

    <div class="w-full px-6 py-6 mx-auto my-4 space-y-6 bg-white rounded-md shadow-sm">
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

    <!-- 文字样式设置 -->
    <div class="w-full px-6 py-6 mx-auto my-4 space-y-6 bg-white rounded-md shadow-lg">
      <div class="grid grid-cols-2 gap-6">
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

      <div class="grid grid-cols-2 gap-6">
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

      <div class="grid grid-cols-2 gap-6">
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
        <div class="grid grid-cols-4 gap-4">
          <div v-for="(bg, index) in backgrounds" :key="index"
            class="w-24 h-24 overflow-hidden border rounded-lg cursor-pointer"
            :class="{ 'ring-2 ring-blue-500': selectedBg === index }" @click="selectedBg = index">
            <img :src="bg" class="object-cover w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref, onMounted, watch } from 'vue'
import { toBlob } from 'html-to-image'
import { download2png } from './../helper/util'

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
  '/share/bg1.png',
  '/share/bg2.png',
  '/share/bg3.png',
  '/share/bg4.png',
  '/share/bg5.png',
  '/share/bg6.png',
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

  // 清空画布
  context.clearRect(0, 0, canvas.width, canvas.height)

  // 绘制背景
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

  // 设置文字样式
  context.font = `${fontWeight.value} ${fontSize.value}px ${fontFamily.value}`
  context.fillStyle = textColor.value
  context.textAlign = 'center'

  // 计算行高
  const lineHeightPx = fontSize.value * lineHeight.value

  // 分割文本行
  const lines = text.value.split('\n')

  // 计算文本总高度
  const totalHeight = lines.length * lineHeightPx

  // 计算起始 Y 坐标（垂直居中）
  let startY = (canvas.height - totalHeight) / 2

  // 绘制每一行文本
  lines.forEach((line) => {
    const chars = line.split('')
    // 计算每个字符实际占用的宽度（包含字间距）
    const charWidth = context.measureText('测').width // 使用一个汉字作为基准宽度
    const spacing = letterSpacing.value / 50 // 调整字间距的比例
    const totalWidth = chars.length * (charWidth + spacing)
    let currentX = canvas.width / 2 - totalWidth / 2

    chars.forEach((char) => {
      context.fillText(char, currentX, startY)
      currentX += charWidth + spacing
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
  const container = document.getElementById('container')

  toBlob(container, options)
    .then((blob) => {
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ])
      // actionMsg.value = '已复制图片至您的剪切板'
    })
    .catch((error) => {
      console.error('复制图片失败:', error)
      // actionMsg.value = '复制图片失败，请重试'
    })
}

function onSave2Image() {
  proxy.$reortGaEvent('save-img', 'share')
  const container = document.getElementById('container')
  toBlob(container, options)
    .then((blob) => {
      download2png(blob)
      actionMsg.value = '已成功为你保存图片'
    })
    .catch((error) => {
      console.error('保存图片失败:', error)
      actionMsg.value = '保存图片失败，请重试'
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