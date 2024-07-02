<template>
	<header class="top-0 left-0 flex flex-col items-center w-screen">
		<nav class="flex items-center justify-between w-full px-6 py-2">
			<RouterLink class="inline-flex flex-row items-center space-x-2 link"
				@click.native="$reortGaEvent('recommand', 'footer')" to="/">
				<img src="@/assets/images/logo.png" alt="玉桃文飨轩" width="50" height="50" />
				<h1 class="text-xl font-bold rainbow-text">玉桃文飨轩</h1>
			</RouterLink>
			<div class="flex flex-row items-center justify-center space-x-6">
				<RouterLink to="/about" class="text-lg">关于</RouterLink>
				<a target="_blank" rel="noreferrer" class="mx-3 text-gray-400 cursor-pointer hover:text-amber-500"
					href="https://github.com/nicejade/markdown2png" @click="$reortGaEvent('github-repository', 'header')">
					<svg viewBox="0 0 16 16" fill="#131313" class="w-8 h-8">
						<path
							d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z">
						</path>
					</svg>
				</a>
			</div>
		</nav>
	</header>
</template>

<style lang="scss">
.link {

	&:hover,
	&:focus,
	&:active {
		border: none !important;
		outline: none !important;
	}

	.rainbow-text {
		color: transparent;
		background: linear-gradient(to top left, #ff8177, #ff867a, #ff8c7f, #f99185, #cf556c, #b12a5b);
		background-clip: text;
		-webkit-background-clip: text;
	}
}
</style>
