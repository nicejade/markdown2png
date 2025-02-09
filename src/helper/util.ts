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

export function download2png(blob: Blob) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `玉桃文飨轩-${genFileName()}.png`
  link.click()
  window.URL.revokeObjectURL(url)
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