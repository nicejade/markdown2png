export const download2png = (canvas) => {
  const tempDomNode = document.createElement('a')
  tempDomNode.href = canvas.toDataURL('image/png')
  tempDomNode.download = new Date().getTime() + '.png'
  tempDomNode.click()
}

export const getCurrentDate = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`
  const day = `${date.getDate()}`
  return [year, month.padStart(2, 0), day.padStart(2, 0)].join('-')
}
