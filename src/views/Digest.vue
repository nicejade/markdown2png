<template>
  <div class="w-[80rem] md:w-full flex md:flex-col items-start justify-between p-6 md:p-0">

    <div class="relative w-3/5 mb-4 mr-8 bg-transparent md:w-full">
      <!-- Skeleton loading -->
      <div v-if="isLoading" class="absolute top-0 w-full aspect-[500/660] rounded-xl overflow-hidden bg-gray-50">
        <!-- 主体骨架 -->
        <div class="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100"></div>
        <!-- 文字区域骨架 -->
        <div class="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-4">
          <div class="w-1/2 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div class="w-2/3 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div class="w-2/3 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div class="w-3/4 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div class="w-2/3 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div class="w-1/2 h-4 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <!-- 闪光效果 -->
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer">
          </div>
        </div>
      </div>
      <!-- Canvas content -->
      <canvas id="digest" ref="canvasRef" width="500" height="660" :style="{ borderRadius: `${roundedRadius}px` }"
        class="w-full border">
      </canvas>
      <DigestHistory />
    </div>

    <div class="w-2/5 md:w-full">
      <!-- 文字样式设置 -->
      <div class="w-full px-6 py-6 mx-auto space-y-6 bg-white shadow-lg rounded-xl">
        <div class="flex flex-row items-center justify-between">
          <strong class="text-lg font-medium">编辑文字</strong>
          <button class="space-x-2 general-btn" @click="onSaveText2Storage">
            <SvgIcon name="save" />
            <span>保存</span>
          </button>
        </div>
        <!-- 编辑区域 -->
        <div class="mb-4">
          <textarea v-model.trim="digest" rows="5" maxlength="1000"
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
            <div class="flex items-center justify-center h-10">
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
          <div class="w-full">
            <label class="block mb-2 text-sm font-medium text-gray-400">弧度</label>
            <div class="flex items-center justify-center h-10">
              <input type="range" v-model="roundedRadius" min="0" max="250" class="flex-1 mr-4" />
              <span class="text-sm">{{ roundedRadius }}px</span>
            </div>
          </div>
          <div class="w-full">
            <label class="block mb-2 text-sm font-medium text-gray-400">边距</label>
            <div class="flex items-center justify-center h-10">
              <input type="range" v-model="edgePadding" min="20" max="200" class="flex-1 mr-4" />
              <span class="text-sm">{{ edgePadding }}px</span>
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
        <div class="grid grid-cols-3 gap-6 md:grid-cols-2 md:justify-items-center">
          <div v-for="(bg, index) in backgrounds" :key="index"
            class="w-24 h-24 overflow-hidden transition-all duration-200 border rounded-lg cursor-pointer group hover:shadow-md"
            :class="{ 'ring-2 ring-blue-500 shadow-lg': selectedBg === index }" @click="selectedBg = index"
            role="button" :aria-label="`选择文摘背景图片 ${index + 1}`" :title="`背景图片 ${index + 1}`">
            <img :src="bg" class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              loading="lazy" :alt="`文摘背景图片 ${index + 1}`" @error="handleImageError(index)" @load="handleImageLoad()" />
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

      <div class="w-full px-2 py-2 mx-auto my-4 space-y-6 bg-white shadow-sm rounded-xl">
        <div class="flex flex-row items-center w-full px-2 py-2 justify-evenly" role="group">
          <button class="space-x-2 general-btn" @click="onCopyImage">
            <SvgIcon name="copy" />
            <span>复制图片</span>
          </button>
          <button class="space-x-2 general-btn" @click="onSave2Image">
            <SvgIcon name="download" />
            <span>保存图片</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref, onMounted, watch } from 'vue'
import HeadlessSelect from './../components/HeadlessSelect.vue'
import DigestHistory from './../components/DigestHistory.vue'
import { download2png, generateHash } from './../helper/util'
import { useToastStore } from './../stores/toast'
import { useDigestStore } from './../stores/digest'

const toastStore = useToastStore()
const digestStore = useDigestStore()

const digest = ref(digestStore.currentDigest)
const fontFamily = ref('system-ui')
const fontSize = ref(16)
const lineHeight = ref(2)
const letterSpacing = ref(100)
const edgePadding = ref(80)
const roundedRadius = ref(0)
const fontWeight = ref('normal')
const textColor = ref('#000000')
const selectedBg = ref(0)
const isLoading = ref(true)
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
  { id: 'Noto Sans SC', name: '思源黑体' },
  { id: 'ShouJinTi', name: '瘦金体' },
  { id: 'Huiwen-Fangsong', name: '汇文仿宋' },
  { id: 'ChillKai', name: '寒蝉正楷' },
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

// 监听所有样式变化
watch(
  [digest, fontFamily, fontSize, lineHeight, letterSpacing, edgePadding, fontWeight, textColor, selectedBg],
  () => {
    loadBackgroundImage()
  },
  { deep: true }
)

watch(
  () => digestStore.currentDigest,
  (newValue) => {
    digest.value = newValue
  }
)

onMounted(() => {
  ctx.value = canvasRef.value.getContext('2d')
  loadBackgroundImage()
})

// 修改 loadBackgroundImage 函数
const loadBackgroundImage = () => {
  isLoading.value = true
  const img = new Image()
  img.onload = () => {
    drawCanvas(img)
    isLoading.value = false
  }
  img.onerror = () => {
    toastStore.error('背景图片加载失败')
    isLoading.value = false
  }
  img.src = backgrounds.value[selectedBg.value]
}

const drawCanvas = async (backgroundImage) => {
  const canvas = canvasRef.value
  const context = ctx.value

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
    const maxWidth = canvas.width - (edgePadding.value * 2) // 考虑左右内边距

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
  const paragraphs = digest.value.split('\n')
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

function onCopyImage() {
  // 检测是否为 iOS 或 Safari, iOS/Safari 环境下使用替代方案
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

  if (isIOS || isSafari) {
    toastStore.info('iOS/Safari 环境请选择"保存图片"')
    return
  }

  proxy.$reortGaEvent('save-img', 'digest')
  const canvas = canvasRef.value

  // 直接从 canvas 获取 blob
  canvas.toBlob((blob) => {
    navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob
      })
    ])
      .then(() => {
        toastStore.success('已复制图片至您的剪切板')
        proxy.$reortGaEvent('copy-image', 'digest')
      })
      .catch((error) => {
        console.error('复制图片失败:', error)
        toastStore.error('复制图片失败，请重试')
        proxy.$reortGaEvent('copy-image-failed', 'digest')
      })
  }, 'image/png')
}

function onSave2Image() {
  proxy.$reortGaEvent('save-img', 'digest')
  const canvas = canvasRef.value
  try {
    canvas.toBlob((blob) => {
      if (blob) {
        download2png(blob)
        toastStore.success('已成功为你保存图片')
        proxy.$reortGaEvent('save-image', 'digest')
      } else {
        throw new Error('生成图片失败')
      }
    }, 'image/png')
  } catch (error) {
    console.error('保存图片失败:', error)
    toastStore.error('保存图片失败，请重试')
    proxy.$reortGaEvent('save-image-failed', 'digest')
  }
}

// 修改保存函数
function onSaveText2Storage() {
  proxy.$reortGaEvent('save-digest', 'digest')
  const hash = generateHash(digest.value)

  // 检查是否已存在相同内容
  if (digestStore.digestList.some(item => item.hash === hash)) {
    return toastStore.info('该书摘内容已被保存过')
  }

  digestStore.addDigest({
    hash,
    text: digest.value,
    timestamp: Date.now(),
    click: 0
  })
  toastStore.success('已成功为你保存书摘')
}

// 处理图片上传
const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    toastStore.info('请上传图片格式文件')
    return
  }

  const imageUrl = URL.createObjectURL(file)
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

const handleImageError = (index: number) => {
  const message = `背景图片 ${index + 1} 加载失败`
  console.debug(message)
  toastStore.error(message)
  proxy.$reortGaEvent('load-bg-failed', 'digest')
}

const handleImageLoad = () => { }
</script>

<style scoped>
input[type="range"] {
  @apply h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-blue-500 rounded-full cursor-pointer;
}

/* 添加闪光动画 */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
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
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC&display=swap');
@import url('https://static.zeoseven.com/zsft/440/main/result.css');
@import url('https://static.zeoseven.com/zsft/5/main/result.css');
</style>
