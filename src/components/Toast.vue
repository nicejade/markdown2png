<template>
  <Transition name="toast">
    <div v-if="isVisible"
      class="fixed z-50 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow top-10"
      role="alert">
      <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg" :class="[
      typeStyles[type].iconBg,
      typeStyles[type].color
    ]">
        <SvgIcon :name="typeStyles[type].icon" :color="typeStyles[type].color" />
      </div>
      <div :class="['text-sm font-normal ms-3', typeStyles[type].color]">{{ message }}
      </div>
      <button type="button" @click="onCloseAlert"
        class="inline-flex justify-center items-center p-1.5 -mx-1.5 -my-1.5 w-8 h-8 text-gray-400 bg-white rounded-lg ms-auto hover:text-gray-900 focus:ring-2 focus:ring-gray-300 hover:bg-gray-100">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToastStore } from './../stores/toast'
const store = useToastStore()
const { message, isVisible, type } = storeToRefs(store)

const typeStyles = {
  success: {
    icon: 'success',
    color: 'text-green-500',
    iconBg: 'bg-green-100'
  },
  error: {
    icon: 'error',
    color: 'text-red-500',
    iconBg: 'bg-red-100'
  },
  info: {
    icon: 'info',
    color: 'text-blue-500',
    iconBg: 'bg-blue-100'
  }
}

function onCloseAlert() {
  store.hide()
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>