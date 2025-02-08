<template>
  <div class="spinner" :style="spinnerStyle">
    <svg viewBox="0 0 50 50" :width="size" :height="size">
      <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="4" :style="{ stroke: color }" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: '#000000'
})

const spinnerStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`
}))
</script>

<style scoped>
.spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.path {
  animation: rotate 1.4s linear infinite;
  stroke-linecap: round;
  transform-origin: center;
}

@keyframes rotate {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>