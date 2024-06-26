<template>
	<div
		class="mx-auto w-full h-32 my-4 max-w-[450px] border border-gray-200 flex flex-row items-center bg-white rounded-md shadow-md z-0">
		<a class="flex flex-row items-center justify-between w-full h-full px-4 py-4"
			href="https://niceshare.site/?ref=share.lovejade.cn" @click="$reortGaEvent('recommand', 'footer')"
			target="_blank">
			<div class="flex flex-col items-center justify-around w-full h-full text-sm text-left">
				<p class="w-full text-base font-semibold">逍遥自在轩</p>
				<p class="w-full text-gray-400">基于 Astro, Starlight, Svelte, Markdown, MDX，TailwindCSS, TypeScript
					所构建的个人主页，快速、易用、易于访问、高度可定制。</p>
			</div>
			<div class="flex flex-col items-end w-1/4">
				<img class="w-20 h-auto border border-gray-300 rounded-md aspect-square"
					src="https://niceshare.site/apple-touch-icon.png" />
			</div>
		</a>
	</div>
</template>
