<template>
	<div
		class="mx-auto w-full h-28 mt-8 max-w-[450px] border border-gray-200 flex flex-row items-center bg-white rounded-md shadow-md z-0"
	>
		<a
			class="flex flex-row items-center justify-between w-full h-full px-4 py-4"
			href="https://nicelinks.site/?ref=share.lovejade.cn"
			@click="$reortGaEvent('recommand', 'footer')"
			target="_blank"
		>
			<div
				class="flex flex-col items-center justify-around w-3/4 h-full text-sm text-left"
			>
				<p class="w-full font-semibold">倾城之链 NICE LINKS</p>
				<p class="w-full text-gray-400">新一代导航平台，旨在云集全球优质网站</p>
			</div>
			<div class="flex flex-col items-end w-1/4">
				<img
					class="w-20 h-auto border border-gray-300 rounded-md aspect-square"
					src="https://image.nicelinks.site/nicelinks-miniprogram-code.jpeg?imageView2/1/w/250/h/250/interlace/1/ignore-error/1"
				/>
			</div>
		</a>
	</div>
</template>
