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
          <textarea v-model="text" rows="5" maxlength="1000"
            class="w-full min-h-[120px] p-4 rounded-lg border border-gray-200 resize-none focus:outline-none focus:border-gray-300"
            placeholder="请输入想要呈现的文字...">
          </textarea>
        </div>

        <div class="grid grid-cols-2 gap-6 md:grid-cols-1">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-400">字体</label>
            <HeadlessSelect className="w-full" :sourceArr="fontFamilys" defaultId="system-ui"
              @selected="handleSelectFont" />
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
            <HeadlessSelect className="w-full" :sourceArr="fontWeights" defaultId="normal"
              @selected="handleSelectWeight" />
          </div>
          <!-- 文字颜色 -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-400">文字颜色</label>
            <input type="color" v-model="textColor" class="w-full h-10 border border-gray-200 rounded-lg" />
          </div>
        </div>
      </div>

      <div class="w-full px-6 py-6 mx-auto my-4 space-y-6 bg-white shadow-lg rounded-xl">
        <!-- 背景选择部分的修改 -->
        <strong class="text-lg font-medium">选择背景</strong>
        <div class="grid grid-cols-3 gap-3">
          <!-- 现有背景选项部分保持不变 -->
          <div v-for="(bg, index) in backgrounds" :key="index"
            class="w-24 h-24 overflow-hidden border rounded-lg cursor-pointer"
            :class="{ 'ring-2 ring-blue-500': selectedBg === index }" @click="selectedBg = index">
            <img :src="bg" class="object-cover w-full h-full" />
          </div>
        </div>

        <!-- 上传按钮改为虚线框风格 -->
        <div class="relative w-full h-24 my-4 group">
          <input type="file" accept="image/*" class="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
            @change="handleImageUpload" />
          <div
            class="flex flex-col items-center justify-center w-full h-full border border-gray-300 border-dashed rounded-lg">
            <div class="flex flex-col items-center justify-center p-2 text-gray-500">
              <div class="flex items-center text-xs text-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mb-1 text-gray-400" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                使用我自己的图片
              </div>
              <div class="text-[10px] text-center text-gray-400">(您的图片不会上传到服务器)</div>
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
import HeadlessSelect from './../components/HeadlessSelect.vue'
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

// 添加字重选项配置
const fontWeights = [
  { id: 'normal', name: '常规' },
  { id: 'medium', name: '中等' },
  { id: 'bold', name: '粗体' }
]

// script setup 部分添加字体配置
const fontFamilys = [
  { id: 'system-ui', name: '系统默认' },
  { id: 'Noto Sans TC', name: '简体中文' },
  { id: 'ShouJinTi', name: '瘦金体' },
]
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
const drawCanvas = async (backgroundImage) => {
  const canvas = canvasRef.value
  const context = ctx.value
  const padding = 10 // 设置内边距

  // 清空画布
  context.clearRect(0, 0, canvas.width, canvas.height)

  // 绘制背景
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

  try {
    await document.fonts.ready
    await document.fonts.load(`${fontSize.value}px ${fontFamily.value}`)
  } catch (e) {
    console.warn('字体加载失败，将使用后备字体:', e)
  }
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
  proxy.$reortGaEvent('save-img', 'digest')
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
  proxy.$reortGaEvent('save-img', 'digest')
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
// 处理图片上传
const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    toast.show('请上传图片文件')
    return
  }

  // 创建临时URL
  const imageUrl = URL.createObjectURL(file)

  // 添加到背景列表的开头
  backgrounds.value.unshift(imageUrl)

  // 选中新上传的图片
  selectedBg.value = 0;

  // 清空 input，允许重复上传同一张图片
  (event.target as HTMLInputElement).value = ''
}

function handleSelectWeight(item) {
  fontWeight.value = item.id
  proxy.$reortGaEvent('select-weight', 'digest')
}

function handleSelectFont(item) {
  fontFamily.value = item.id
  proxy.$reortGaEvent('select-font', 'digest')
}
</script>

<style scoped>
input[type="range"] {
  @apply h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-blue-500 rounded-full cursor-pointer;
}

@font-face {
  font-family: 'ShouJinTi';
  font-style: normal;
  font-weight: 500;
  font-display: block;
  src: url('./../assets/fonts/ShouJinTi.woff2') format('woff2');
  unicode-range: U+2E80-2EFF,
    U+2F00-2FDF,
    U+2FF0-2FFF,
    U+3000-303F,
    U+31C0-31EF,
    U+3200-4DBF,
    U+4E00-9FFF,
    U+F900-FAFF,
    U+FE30-FE4F;
}
</style>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap');
</style>