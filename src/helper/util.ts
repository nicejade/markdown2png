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

export function download2png(canvas: any) {
  const tempDomNode = document.createElement('a')
  tempDomNode.href = canvas.toDataURL('image/png')
  tempDomNode.download = genFileName() + '.png'
  tempDomNode.click() 
}

export function copy2clipboard(canvas: any) {
  canvas.toBlob((blob) => {
    const item = new ClipboardItem({ 'image/png': blob })
    navigator.clipboard.write([item]).then( () => {
      console.log('Image copied to clipboard')
    }).catch( (err) => {
      console.error('Could not copy image to clipboard: ', err)
    })
    }, 'image/png')
}

export function getCurrentDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`
  const day = `${date.getDate()}`
  return [year, month.padStart(2, 0), day.padStart(2, 0)].join('-')
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