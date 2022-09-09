<template>
	<Header />
	<RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
</script>

<style lang="scss">
#app {
	padding: 0 1rem;
}
</style>
