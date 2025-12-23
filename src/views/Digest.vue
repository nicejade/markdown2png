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
          <div class="absolute inset-0 bg-gradient-to-r from-transparent to-transparent via-white/20 animate-shimmer">
          </div>
        </div>
      </div>
      <!-- Canvas content -->
      <canvas id="digest" ref="canvasRef" :width="canvasWidth" :height="canvasHeight"
        :style="{ borderRadius: `${roundedRadius}px` }" class="w-full border">
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
            placeholder="请输入要呈现的文字，支持 Markdown 语法: &#10;**加粗**&#10;__下划线__&#10;==高亮==&#10;~~删除线~~">
          </textarea>
        </div>

        <div class="grid grid-cols-2 gap-6 md:grid-cols-1">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-400">字体</label>
            <HeadlessSelect className="w-full" :sourceArr="fontFamilys" :defaultId="fontFamily"
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
          <!-- 对齐方式 -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-400">比例</label>
            <HeadlessSelect className="w-full" :sourceArr="ratios" :defaultId="selectedRatio"
              @selected="handleSelectRatio" />
          </div>
          <!-- 对齐方式 -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-400">对齐</label>
            <HeadlessSelect className="w-full" :sourceArr="alignments" :defaultId="textAlign"
              @selected="handleSelectAlignment" />
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
              <input type="range" v-model="letterSpacing" min="0" max="100" class="flex-1 mr-4" />
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
            <HeadlessSelect className="w-full" :sourceArr="fontWeights" :defaultId="fontWeight"
              @selected="handleSelectWeight" />
          </div>
          <!-- 文字颜色 -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-400">文字颜色</label>
            <input type="color" v-model="textColor" class="w-full h-10 border border-gray-200 rounded-lg" />
          </div>
        </div>
      </div>

      <div class="w-full px-6 py-6 mx-auto my-8 space-y-6 bg-white shadow-lg rounded-xl">
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
import { download2png, debounce, generateHash, getStyleSettings, setStyleSettings, getStorageItem } from './../helper/util'
import { BACKGROUNDS_STORAGE_KEY } from './../helper/constant'
import { useToastStore } from './../stores/toast'
import { useDigestStore } from './../stores/digest'

const toastStore = useToastStore()
const digestStore = useDigestStore()

// 获取已保存的设置或使用默认值
const savedSettings = getStyleSettings()

const digest = ref(digestStore.currentDigest)
const fontFamily = ref(savedSettings.fontFamily)
const fontSize = ref(savedSettings.fontSize)
const textAlign = ref(savedSettings.textAlign)
const lineHeight = ref(savedSettings.lineHeight)
const letterSpacing = ref(savedSettings.letterSpacing)
const edgePadding = ref(savedSettings.edgePadding)
const roundedRadius = ref(savedSettings.roundedRadius)
const fontWeight = ref(savedSettings.fontWeight)
const textColor = ref(savedSettings.textColor)
const selectedBg = ref(savedSettings.selectedBg)
const selectedRatio = ref(savedSettings.selectedRatio)
const canvasWidth = ref(500)
const canvasHeight = ref(660)
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
  { id: 'Playfair Display', name: 'Playfair Display' },
  { id: 'Montserrat', name: 'Montserrat' },
  { id: 'Dancing Script', name: 'Dancing Script' },
  { id: 'Huiwen-Fangsong', name: '汇文仿宋' },
  { id: 'ChillKai', name: '寒蝉正楷' },
  { id: 'PING FANG ZHUI FENG', name: '平方追风' },
  { id: 'PING FANG SHAO HUA', name: '手写韶华' },
]

// 添加对齐方式选项配置
const alignments = [
  { id: 'left', name: '居左对齐' },
  { id: 'center', name: '居中对齐' },
]

// 添加比例选项配置
const ratios = [
  { id: 'default', name: '默认比例', width: 500, height: 660 },
  { id: 'xiaohongshu', name: '小红书', width: 540, height: 720 },
  { id: 'douyin', name: '抖音', width: 540, height: 768 },
  { id: 'square', name: '正方形', width: 600, height: 600 },
  { id: 'weixin', name: '微信', width: 900, height: 500 },
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

const debouncedUpdate = debounce(() => {
  loadBackgroundImage()
  const settings = {
    fontFamily, fontSize, textAlign, lineHeight, letterSpacing, edgePadding,
    fontWeight, textColor, selectedBg, roundedRadius, selectedRatio
  }
  setStyleSettings(settings)
}, 100)

// 监听所有样式变化
watch(
  [digest, fontFamily, fontSize, textAlign, lineHeight, letterSpacing, edgePadding, fontWeight, textColor, selectedBg, selectedRatio, roundedRadius],
  () => {
    debouncedUpdate()
  },
  { deep: true }
)

watch(
  () => digestStore.currentDigest,
  (newValue) => {
    digest.value = newValue
  }
)

onMounted(async () => {
  // 确保 canvas 元素已经挂载
  if (!canvasRef.value) {
    console.error('Canvas 元素未找到')
    toastStore.error('页面初始化失败，请刷新重试')
    return
  }

  // 从 localStorage 中加载用户保存的背景图片（Data URL 列表）
  try {
    const saved = getStorageItem(BACKGROUNDS_STORAGE_KEY)
    if (Array.isArray(saved) && saved.length > 0) {
      // 将用户上传的图片放到默认背景前面，便于优先选择
      backgrounds.value = [...saved, ...backgrounds.value]
      // 若存在用户保存的图片，默认选中新上传的第一张
      selectedBg.value = 0
    }
  } catch (e) {
    console.warn('加载已保存背景失败', e)
  }

  // 根据保存的比例 ID 设置初始宽高
  const selectedRatioObj = ratios.find(r => r.id === selectedRatio.value) || ratios[0]
  updateCanvasSize(selectedRatioObj)

  // 获取 canvas 上下文
  try {
    ctx.value = canvasRef.value.getContext('2d')
    if (!ctx.value) {
      throw new Error('无法获取 Canvas 2D 上下文')
    }
  } catch (e) {
    console.error('Canvas 初始化失败:', e)
    toastStore.error('Canvas 初始化失败，请刷新重试')
    return
  }

  // 预加载字体（可选，不阻塞渲染）
  try {
    await Promise.race([
      document.fonts.ready,
      new Promise(resolve => setTimeout(resolve, 1000))
    ])
  } catch (e) {
    console.warn('字体预加载失败:', e)
  }

  // 加载背景图片
  loadBackgroundImage()
})

// 保存用户上传的背景图片（只保存 data: 开头的图片，防止把内置资源写入 localStorage）
const saveBackgroundsToStorage = () => {
  try {
    const dataUrls = backgrounds.value.filter(b => typeof b === 'string' && b.startsWith('data:'))
    // 只保留最近 10 张，防止占用过多 localStorage
    const trimmed = dataUrls.slice(0, 10)
    localStorage.setItem(BACKGROUNDS_STORAGE_KEY, JSON.stringify(trimmed))
  } catch (e) {
    console.warn('保存背景图片失败', e)
  }
}

const updateCanvasSize = (item) => {
  canvasWidth.value = item.width
  canvasHeight.value = item.height

  // 更新 canvas 尺寸
  if (canvasRef.value) {
    canvasRef.value.width = item.width
    canvasRef.value.height = item.height
  }
}

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

// 解析 Markdown 语法，返回文本片段数组
const parseMarkdown = (text: string) => {
  const segments: Array<{ text: string; bold?: boolean; underline?: boolean; mark?: boolean; strikethrough?: boolean }> = []
  let i = 0

  while (i < text.length) {
    // 检查各种标记
    if (text.substring(i, i + 2) === '**' && text.indexOf('**', i + 2) !== -1) {
      // 加粗 **text**
      const endIndex = text.indexOf('**', i + 2)
      if (endIndex !== -1) {
        segments.push({ text: text.substring(i + 2, endIndex), bold: true })
        i = endIndex + 2
        continue
      }
    } else if (text.substring(i, i + 2) === '__' && text.indexOf('__', i + 2) !== -1) {
      // 下划线 __text__
      const endIndex = text.indexOf('__', i + 2)
      if (endIndex !== -1) {
        segments.push({ text: text.substring(i + 2, endIndex), underline: true })
        i = endIndex + 2
        continue
      }
    } else if (text.substring(i, i + 2) === '==' && text.indexOf('==', i + 2) !== -1) {
      // 高亮 ==text==
      const endIndex = text.indexOf('==', i + 2)
      if (endIndex !== -1) {
        segments.push({ text: text.substring(i + 2, endIndex), mark: true })
        i = endIndex + 2
        continue
      }
    } else if (text.substring(i, i + 2) === '~~' && text.indexOf('~~', i + 2) !== -1) {
      // 删除线 ~~text~~
      const endIndex = text.indexOf('~~', i + 2)
      if (endIndex !== -1) {
        segments.push({ text: text.substring(i + 2, endIndex), strikethrough: true })
        i = endIndex + 2
        continue
      }
    }

    // 普通文本，找到下一个标记的开始位置
    let nextMarkIndex = text.length
    const marks = ['**', '__', '==', '~~']
    marks.forEach(mark => {
      const index = text.indexOf(mark, i)
      if (index !== -1 && index < nextMarkIndex) {
        nextMarkIndex = index
      }
    })

    if (nextMarkIndex > i) {
      segments.push({ text: text.substring(i, nextMarkIndex) })
      i = nextMarkIndex
    } else {
      segments.push({ text: text.substring(i) })
      break
    }
  }

  return segments
}

const drawCanvas = async (backgroundImage) => {
  const canvas = canvasRef.value
  const context = ctx.value

  context.clearRect(0, 0, canvas.width, canvas.height)
  // 绘制背景
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

  // 优化字体加载：添加超时机制，避免无限期等待外部字体
  try {
    const fontLoadTimeout = new Promise((resolve) => setTimeout(resolve, 800))
    const fontLoad = document.fonts.load(`${fontSize.value}px ${fontFamily.value}`)

    // 使用 Promise.race 实现超时控制，最多等待 800ms
    await Promise.race([fontLoad, fontLoadTimeout])
  } catch (e) {
    console.warn('字体加载失败，将使用后备字体:', e)
  }

  // 文本换行处理函数（处理已解析的片段）
  const wrapTextSegments = (segments) => {
    const lines: Array<Array<{ text: string; bold?: boolean; underline?: boolean; mark?: boolean; strikethrough?: boolean }>> = []
    const maxWidth = canvas.width - (edgePadding.value * 2)
    const spacing = letterSpacing.value / 50

    // 将片段展开为字符数组（保留样式信息）
    const charSegments: Array<{ char: string; bold?: boolean; underline?: boolean; mark?: boolean; strikethrough?: boolean }> = []
    segments.forEach(segment => {
      segment.text.split('').forEach(char => {
        charSegments.push({
          char,
          bold: segment.bold,
          underline: segment.underline,
          mark: segment.mark,
          strikethrough: segment.strikethrough
        })
      })
    })

    // 按字符换行
    let currentLine: Array<{ text: string; bold?: boolean; underline?: boolean; mark?: boolean; strikethrough?: boolean }> = []
    let currentLineText = ''
    let currentLineWidth = 0
    let currentStyle = null

    charSegments.forEach((charSeg, index) => {
      const char = charSeg.char
      const style = {
        bold: charSeg.bold,
        underline: charSeg.underline,
        mark: charSeg.mark,
        strikethrough: charSeg.strikethrough
      }

      // 检查样式是否改变
      const styleChanged = !currentStyle ||
        currentStyle.bold !== style.bold ||
        currentStyle.underline !== style.underline ||
        currentStyle.mark !== style.mark ||
        currentStyle.strikethrough !== style.strikethrough

      // 设置字体以测量
      const testFont = style.bold ? `bold ${fontSize.value}px ${fontFamily.value}` : `${fontWeight.value} ${fontSize.value}px ${fontFamily.value}`
      context.font = testFont
      const charWidth = context.measureText(char).width + spacing

      // 如果样式改变或行宽超限，需要换行或开始新片段
      if (styleChanged && currentLineText) {
        // 保存当前片段
        currentLine.push({ ...currentStyle, text: currentLineText })
        currentLineText = ''
      }

      // 检查是否需要换行
      if (currentLineWidth + charWidth > maxWidth && (currentLine.length > 0 || currentLineText !== '')) {
        // 保存当前行
        if (currentLineText) {
          currentLine.push({ ...currentStyle, text: currentLineText })
        }
        lines.push(currentLine)
        currentLine = []
        currentLineText = ''
        currentLineWidth = 0
        currentStyle = null
      }

      // 添加字符到当前行
      if (!currentStyle || styleChanged) {
        currentStyle = { ...style }
        if (currentLineText) {
          currentLine.push({ ...currentStyle, text: currentLineText })
          currentLineText = ''
        }
      }

      currentLineText += char
      currentLineWidth += charWidth
    })

    // 添加最后一行
    if (currentLineText) {
      currentLine.push({ ...currentStyle, text: currentLineText })
    }
    if (currentLine.length > 0) {
      lines.push(currentLine)
    }

    return lines
  }

  // 笔刷质感的高亮绘制（用于 ==text==）
  const drawBrushMark = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, size: number) => {
    const paddingX = Math.max(2, size * 0.12)
    const paddingY = Math.max(1, size * 0.1)
    const markHeight = size * 0.9
    const startX = x - paddingX
    const startY = y - markHeight + paddingY * 0.3
    const markWidth = width + paddingX * 2

    // 简单的可重复“随机”数，避免每次渲染抖动
    const rand = (seed: number) => {
      const s = Math.sin(seed * 12.9898) * 43758.5453
      return s - Math.floor(s)
    }

    ctx.save()
    ctx.globalAlpha = 0.9
    const gradient = ctx.createLinearGradient(startX, startY, startX, startY + markHeight)
    gradient.addColorStop(0, '#fff176')
    gradient.addColorStop(1, '#ffd54f')
    ctx.fillStyle = gradient

    const roughness = Math.max(1.5, size * 0.06)
    const topJitter = roughness * (0.5 + rand(startX + y))
    const bottomJitter = roughness * (0.8 + rand(markWidth + y))

    // 不规则多边形，模拟笔刷边缘
    ctx.beginPath()
    ctx.moveTo(startX, startY + topJitter)
    ctx.lineTo(startX + markWidth, startY + topJitter * 0.7)
    ctx.lineTo(startX + markWidth - roughness * rand(startX + markWidth), startY + markHeight - bottomJitter)
    ctx.lineTo(startX + roughness * rand(y + markWidth), startY + markHeight + bottomJitter * 0.5)
    ctx.closePath()
    ctx.fill()

    // 轻微覆涂，增加纹理层次
    ctx.globalAlpha = 0.15
    ctx.fillRect(startX + markWidth * 0.08, startY + markHeight * 0.3, markWidth * 0.35, roughness)
    ctx.fillRect(startX + markWidth * 0.5, startY + markHeight * 0.65, markWidth * 0.28, roughness * 0.9)
    ctx.restore()
  }

  // 处理每一段文本
  const paragraphs = digest.value.split('\n')
  const allLines: Array<Array<{ text: string; bold?: boolean; underline?: boolean; mark?: boolean; strikethrough?: boolean }>> = []
  paragraphs.forEach(para => {
    if (para.trim()) {
      const segments = parseMarkdown(para)
      allLines.push(...wrapTextSegments(segments))
    } else {
      // 空行
      allLines.push([])
    }
  })

  // 计算行高和总高度
  const lineHeightPx = fontSize.value * lineHeight.value
  const totalHeight = allLines.length * lineHeightPx

  // 计算起始 Y 坐标（垂直居中）
  let startY = (canvas.height - totalHeight) / 2

  // 绘制文本
  allLines.forEach(line => {
    if (line.length === 0) {
      startY += lineHeightPx
      return
    }

    const spacing = letterSpacing.value / 50
    let currentX = edgePadding.value

    // 先计算整行宽度（用于居中对齐）
    let totalLineWidth = 0
    context.font = `${fontWeight.value} ${fontSize.value}px ${fontFamily.value}`
    line.forEach(segment => {
      const segmentFont = segment.bold ? `bold ${fontSize.value}px ${fontFamily.value}` : `${fontWeight.value} ${fontSize.value}px ${fontFamily.value}`
      context.font = segmentFont
      const chars = segment.text.split('')
      chars.forEach(char => {
        totalLineWidth += context.measureText(char).width + spacing
      })
    })
    totalLineWidth = Math.min(totalLineWidth, canvas.width - (edgePadding.value * 2))

    // 根据对齐方式计算起始 X 坐标
    if (textAlign.value === 'left') {
      currentX = edgePadding.value
    } else if (textAlign.value === 'center') {
      currentX = (canvas.width - totalLineWidth) / 2
    }

    // 绘制每个片段
    line.forEach(segment => {
      const segmentFont = segment.bold ? `bold ${fontSize.value}px ${fontFamily.value}` : `${fontWeight.value} ${fontSize.value}px ${fontFamily.value}`
      context.font = segmentFont
      context.fillStyle = textColor.value
      context.textAlign = 'left'

      const chars = segment.text.split('')
      const segmentStartX = currentX
      let segmentWidth = 0

      // 先计算片段宽度
      chars.forEach(char => {
        segmentWidth += context.measureText(char).width + spacing
      })

      // 先绘制高亮背景（如果有）
      if (segment.mark) {
        const markWidth = Math.max(segmentWidth - spacing, 0)
        drawBrushMark(context, segmentStartX, startY, markWidth, fontSize.value)
        context.fillStyle = textColor.value
      }

      // 绘制文字
      chars.forEach(char => {
        context.fillText(char, currentX, startY)
        const charWidth = context.measureText(char).width
        currentX += charWidth + spacing
      })

      // 绘制下划线
      if (segment.underline) {
        context.strokeStyle = textColor.value
        context.lineWidth = Math.max(1, fontSize.value / 20)
        context.beginPath()
        context.moveTo(segmentStartX, startY + 4) // 距离文字更远 2px（从 +2 改为 +4）
        context.lineTo(segmentStartX + segmentWidth - spacing, startY + 4)
        context.stroke()
      }

      // 绘制删除线
      if (segment.strikethrough) {
        context.strokeStyle = textColor.value
        context.lineWidth = Math.max(1, fontSize.value / 20)
        context.beginPath()
        const strikeY = startY - fontSize.value * 0.3
        context.moveTo(segmentStartX, strikeY)
        context.lineTo(segmentStartX + segmentWidth - spacing, strikeY)
        context.stroke()
      }
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
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    toastStore.info('请上传图片格式文件')
    return
  }

  // 读取为 Data URL（可序列化到 localStorage）
  const reader = new FileReader()
  reader.onload = () => {
    const result = reader.result as string
    if (result) {
      backgrounds.value.unshift(result)
      // 选中新上传的图片
      selectedBg.value = 0
      // 持久化用户上传的图片（只保存 data URL）
      saveBackgroundsToStorage()
    }
    // 清空 input，允许重复上传同一张图片
    input.value = ''
  }
  reader.onerror = () => {
    toastStore.error('读取图片失败')
  }
  reader.readAsDataURL(file)
}

// 当 backgrounds 变化时，自动保存用户上传的 data URL
watch(backgrounds, () => {
  saveBackgroundsToStorage()
}, { deep: true })

function handleSelectWeight(item) {
  fontWeight.value = item.id
  proxy.$reortGaEvent('select-weight', 'digest')
}

function handleSelectFont(item) {
  fontFamily.value = item.id
  proxy.$reortGaEvent('select-font', 'digest')
}

const handleSelectAlignment = (item) => {
  textAlign.value = item.id
  proxy.$reortGaEvent('select-alignment', 'digest')
}

const handleSelectRatio = (item) => {
  selectedRatio.value = item.id
  updateCanvasSize(item)
  loadBackgroundImage()

  proxy.$reortGaEvent('select-ratio', 'digest')
}

const handleImageError = (index: number) => {
  const message = `背景图片 ${index + 1} 加载失败`
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
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Dancing+Script:wght@400..700&display=swap');
@import url('https://static.zeoseven.com/zsft/440/main/result.css');
@import url('https://static.zeoseven.com/zsft/5/main/result.css');
@import url('https://static.zeoseven.com/zsft/495/main/result.css');
@import url('https://static.zeoseven.com/zsft/157/main/result.css');
</style>
