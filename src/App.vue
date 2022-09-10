<template>
	<Header />
	<RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
</script>
