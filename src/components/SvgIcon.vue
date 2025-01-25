<template>
  <svg
    aria-hidden="true"
    :style="{ color }"
    :fill="color"
    :width="`${width}px`"
    :height="`${height}px`">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  color?: string
  name: string
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  color: '#696969',
  width: 20,
  height: 20
})

const symbolId = computed(() => `#icon-${props.name}`)
</script>