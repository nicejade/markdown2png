import { defineStore } from 'pinia'
import { DIGEST_TEXT } from '../helper/constant'

interface DigestItem {
  hash: string
  text: string
  timestamp: number
  click: number
}

const DEFAULT_DIGEST = `庐山烟雨浙江潮，
未至千般恨不消。
到得还来别无事，
庐山烟雨浙江潮。
──〔北宋〕· 苏轼《观潮》`

export const useDigestStore = defineStore('digest', {
  state: () => {
    const savedDigests = JSON.parse(localStorage.getItem(DIGEST_TEXT) || '[]')
    const isSvaedDigest = savedDigests.length > 0 
    const recentDigest = isSvaedDigest && savedDigests[savedDigests.length - 1].text
    return {
      digestList: savedDigests,
      currentDigest: isSvaedDigest ? recentDigest : DEFAULT_DIGEST
    }
  },
  
  actions: {
    updateCurrentDigest(text: string) {
      this.currentDigest = text
    },
    
    addDigest(item: DigestItem) {
      this.digestList.push(item)
      localStorage.setItem(DIGEST_TEXT, JSON.stringify(this.digestList))
    },

    updateDigestClick(hash: string) {
      const index = this.digestList.findIndex((item: DigestItem) => item.hash === hash)
      if (index !== -1) {
        this.digestList[index].click += 1
        localStorage.setItem(DIGEST_TEXT, JSON.stringify(this.digestList))
      }
    },
  }
})