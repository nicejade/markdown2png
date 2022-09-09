<template>
	<footer class="z-0 px-5 pt-10 pb-10 text-sm text-center text-gray-400">
		<div
			class="flex flex-row flex-wrap items-center justify-center mt-2 mb-2 space-x-6 friends"
		>
			<a
				target="_blank"
				class="mx-3 text-gray-400 cursor-pointer hover:text-amber-500"
				:href="assembleExternalLink('https://nicelinks.site/')"
				@click="$reortGaEvent('nicelinks-site', 'footer')"
				>倾城之链</a
			>
			<a
				target="_blank"
				class="mx-3 text-gray-400 cursor-pointer hover:text-amber-500"
				:href="assembleExternalLink('https://read.lovejade.cn/')"
				@click="$reortGaEvent('read-lovejade', 'footer')"
				>曼妙句子</a
			>
			<a
				target="_blank"
				class="mx-3 text-gray-400 cursor-pointer hover:text-amber-500"
				:href="assembleExternalLink('https://quickapp.lovejade.cn/')"
				@click="$reortGaEvent('quickapp-lovejade', 'footer')"
				>静轩之别苑</a
			>
			<a
				target="_blank"
				class="mx-3 text-gray-400 cursor-pointer hover:text-amber-500"
				:href="assembleExternalLink('https://forum.lovejade.cn/')"
				@click="$reortGaEvent('forum-lovejade', 'footer')"
				>悠然宜想亭</a
			>
			<a
				target="_blank"
				class="mx-3 text-gray-400 cursor-pointer hover:text-amber-500"
				:href="assembleExternalLink('https://wiki.lovejade.cn/')"
				@click="$reortGaEvent('beian', 'footer')"
				>清风明月阁</a
			>
		</div>
		<div class="icp">
			<span class="mx-3 text-gray-400">{{ copyright }}</span>
			<a
				target="_blank"
				class="text-gray-400 cursor-pointer hover:text-amber-500"
				@click="$reortGaEvent('jeffjade', 'footer')"
				rel="external noopener"
				:href="assembleExternalLink('https://www.jeffjade.com')"
				>晚晴幽草轩</a
			>出品<br class="show-on-mobile" />
			<a
				target="_blank"
				class="mx-3 text-gray-400 cursor-pointer hover:text-amber-500"
				rel="external noopener"
				@click="$reortGaEvent('beian', 'footer')"
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

<script setup lang="ts">
import { ref } from 'vue'
const copyright = ref(`Copyright © ${new Date().getFullYear()}`)

const assembleExternalLink = (url: string) => {
	return `${url}?ref=nicelinks.site`
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
