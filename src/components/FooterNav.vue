<template>
	<footer class="px-5 pt-10 pb-10 text-sm text-center text-gray-400">
		<div
			class="flex flex-row items-center justify-center mt-2 mb-2 space-x-6 friends"
		>
			<a
				target="_blank"
				class="mx-3 text-gray-400 cursor-pointer hover:text-amber-500"
				:href="assembleExternalLink('https://nicelinks.site/')"
				>倾城之链</a
			>
			<a
				target="_blank"
				class="mx-3 text-gray-400 cursor-pointer hover:text-amber-500"
				:href="assembleExternalLink('https://read.lovejade.cn/')"
				>曼妙句子</a
			>
			<a
				target="_blank"
				class="mx-3 text-gray-400 cursor-pointer hover:text-amber-500"
				:href="assembleExternalLink('https://quickapp.lovejade.cn/')"
				>静轩之别苑</a
			>
			<a
				target="_blank"
				class="mx-3 text-gray-400 cursor-pointer hover:text-amber-500"
				:href="assembleExternalLink('https://forum.lovejade.cn/')"
				>悠然宜想亭</a
			>
			<a
				target="_blank"
				class="mx-3 text-gray-400 cursor-pointer hover:text-amber-500"
				:href="assembleExternalLink('https://wiki.lovejade.cn/')"
				>清风明月阁</a
			>
		</div>
		<div class="icp">
			<span class="mx-3 text-gray-400">{{ copyright }}</span>
			<a
				class="text-gray-400 cursor-pointer hover:text-amber-500"
				target="_blank"
				@click="onReortEvent('link-jeffjade')"
				rel="external noopener"
				:href="assembleExternalLink('https://www.jeffjade.com')"
				>晚晴幽草轩</a
			>出品<br class="show-on-mobile" />
			<a
				class="mx-3 text-gray-400 cursor-pointer hover:text-amber-500"
				target="_blank"
				rel="external noopener"
				@click="onReortEvent('beian')"
				:href="assembleExternalLink('https://beian.miit.gov.cn/')"
				>粤ICP备17099767号</a
			>
			<img
				class="zero"
				src="./../assets/images/zero.gif"
				alt="深圳市市场监督管理局企业主体身份公示"
			/>
		</div>
	</footer>
</template>

<script setup>
import { ref } from 'vue'
const copyright = ref(`Copyright © ${new Date().getFullYear()}`)

const assembleExternalLink = (url) => {
	return `${url}?ref=nicelinks.site`
}

const onReortEvent = (scene) => {
	const gtag = window.gtag || (() => {})
	gtag('event', scene, {
		event_category: 'conversion',
		event_label: scene,
	})
}
</script>

<style lang="scss">
.show-on-mobile {
	display: none;
}

@media (max-width: 960px) {
	.show-on-big-screen {
		display: none;
	}

	.show-on-mobile {
		display: block;
	}
}

.zero {
	display: inline-block;
	height: 1.5rem;
	width: 1.1rem;
	margin-left: 0.5rem;
}
</style>
