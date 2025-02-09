<template>
  <div class="w-full px-2 py-4 my-4 overflow-y-scroll sm:px-0 max-h-128">
    <TabGroup>
      <TabList class="flex p-1 space-x-1 bg-gray-300 rounded-xl">
        <Tab v-for="category in Object.keys(digestHistory)" as="template" :key="category" v-slot="{ selected }">
          <button :class="[
          'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
          'ring-white/60 ring-offset-2 ring-offset-gray-300 focus:outline-none focus:ring-2',
          selected
            ? 'bg-white text-[#ea552d] shadow'
            : 'text-black hover:bg-white/[0.12] hover:text-white',
        ]">
            {{ TAB_LABELS[category] }}
          </button>
        </Tab>
      </TabList>
      <TabPanels class="mt-2">
        <TabPanel v-for="(posts, idx) in Object.values(digestHistory)" :key="idx" :class="[
          'rounded-xl bg-white p-3',
          'ring-white/60 ring-offset-2 focus:outline-none focus:ring-2',
        ]">
          <ul v-if="posts.length > 0">
            <li v-for="post in posts" :key="post.hash" class="relative p-3 rounded-md cursor-pointer hover:bg-gray-100"
              @click="handleDigestClick(post)">
              <section class="text-sm font-medium leading-5"
                style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                {{ post.digest }}
              </section>
              <div class="mt-1 text-xs text-gray-500">
                {{ post.date }}
              </div>
            </li>
          </ul>
          <div v-else class="flex items-center justify-center w-full my-4">
            <SvgIcon name="empty" width="92" height="76" />
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { TAB_LABELS } from './../helper/constant'
import { useDigestStore } from './../stores/digest'
import { useToastStore } from './../stores/toast'

const toastStore = useToastStore()
const digestStore = useDigestStore()
const digestHistory = ref({
  recent: [],
  earliest: [],
  popular: []
})

watch(() => digestStore.digestList, () => {
  updateDigestHistory()
}, { deep: true, immediate: true })

const handleDigestClick = (post) => {
  digestStore.updateCurrentDigest(post.digest)
  digestStore.updateDigestClick(post.hash)
  toastStore.success('文摘内容已更新至文本框')
}

function updateDigestHistory() {
  const digests = digestStore.digestList
  const sortedDigests = [...digests].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  // 最近的摘要
  digestHistory.value.recent = sortedDigests.slice(0, 5).map((item, index) => ({
    digest: item.text,
    hash: item.hash,
    click: item.click,
    date: new Date(item.timestamp).toLocaleString(),
  }))

  // 最早的摘要
  digestHistory.value.earliest = [...sortedDigests].reverse().slice(0, 5).map((item, index) => ({
    digest: item.text,
    hash: item.hash,
    click: item.click,
    date: new Date(item.timestamp).toLocaleString(),
  }))

  // 最流行的摘要（根据 click 数值）
  digestHistory.value.popular = [...digests]
    .sort((a, b) => b.click - a.click)
    .slice(0, 5)
    .map((item, index) => ({
      digest: item.text,
      hash: item.hash,
      click: item.click,
      date: new Date(item.timestamp).toLocaleString(),
    }))
}
</script>
