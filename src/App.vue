<template>
	<Toast />
	<Header />
	<RouterView />
</template>

<script setup lang="ts">
import Toast from '@/components/Toast.vue'
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
</script>
