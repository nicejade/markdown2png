import { STYLE_STORAGE_KEY, DEFAULT_STYLE_SETTINGS } from './constant'

export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay || 1000))

const randomString = (length: number) => {
  const str: string = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  let result: string = ''
  const arr: Array<any> = new Array(length)
  Array.from(arr).map(() => result += str[Math.floor(Math.random() * str.length)])
  return result
}

const genFileName = () => {
  const datetime = new Date()
  const year = datetime.getFullYear().toString().replace('20', '')
  const month = datetime.getMonth().toString().padStart(2, '0')
  const day = datetime.getDate().toString().padStart(2, '0')
  const ramdom = randomString(4)
  return [year, month, day, ramdom].join('-')
}

// 检测是否为 Safari 浏览器
function isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export function download2png(blob: Blob) {
  const fileName = `玉桃文飨轩-${genFileName()}.png`
  
  // Safari 特殊处理
  if (isSafari()) {
    // Safari 需要使用 Data URL 方式
    const reader = new FileReader()
    reader.onloadend = function() {
      const dataUrl = reader.result as string
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = fileName
      link.style.display = 'none'
      
      // 必须将 link 添加到 DOM 中，Safari 才能触发下载
      document.body.appendChild(link)
      link.click()
      
      // 延迟移除，确保下载已开始
      setTimeout(() => {
        document.body.removeChild(link)
      }, 100)
    }
    reader.onerror = function() {
      console.error('读取 Blob 失败')
      // 降级方案：使用 Blob URL
      fallbackDownload(blob, fileName)
    }
    reader.readAsDataURL(blob)
  } else {
    // 其他浏览器使用标准方式
    fallbackDownload(blob, fileName)
  }
}

// 降级下载方案
function fallbackDownload(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.style.display = 'none'
  
  // 添加到 DOM 以确保兼容性
  document.body.appendChild(link)
  link.click()
  
  // 延迟清理
  setTimeout(() => {
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }, 100)
}

export function getCurrentDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`
  const day = `${date.getDate()}`
  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-')
}

export function deepClone(obj: Object) {
  return JSON.parse(JSON.stringify(obj))
}

const parseJSONSafely = (str: string) => {
  try {
    return JSON.parse(str);
  }
  catch (err: any) {
    console.error(`Something Error @[ParseJSON] ${err.message}`);
    return {}
  }
}

export function getStorageItem (key: string) {
  const value: any = localStorage.getItem(key)
  return parseJSONSafely(value)
}

export const generateHash = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

/**
 * 创建一个防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间(ms)
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void => {
  let timer: NodeJS.Timeout | null = null
  
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

// 从 localStorage 获取样式设置
export const getStyleSettings = () => {
  let savedSettings = localStorage.getItem(STYLE_STORAGE_KEY)
  savedSettings = savedSettings ? JSON.parse(savedSettings) : {}
  return Object.assign({}, DEFAULT_STYLE_SETTINGS, savedSettings)
}

// 保存样式设置到 localStorage
export const setStyleSettings = (settings: any) => {
  const currentSettings = {
    fontFamily: settings.fontFamily.value,
    fontSize: Number(settings.fontSize.value),
    selectedRatio: settings.selectedRatio.value,
    textAlign: settings.textAlign.value, 
    lineHeight: Number(settings.lineHeight.value),
    letterSpacing: settings.letterSpacing.value,
    edgePadding: Number(settings.edgePadding.value),
    roundedRadius: settings.roundedRadius.value,
    fontWeight: settings.fontWeight.value,
    textColor: settings.textColor.value,
    selectedBg: settings.selectedBg.value
  }
  localStorage.setItem(STYLE_STORAGE_KEY, JSON.stringify(currentSettings))
}