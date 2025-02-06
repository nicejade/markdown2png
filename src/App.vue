<template>
	<Toast />
	<Header />
	<RouterView />
	<FooterNav />
</template>

<script setup lang="ts">
import Toast from './components/Toast.vue'
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import FooterNav from './components/FooterNav.vue'
</script>
