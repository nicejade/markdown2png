<template>
	<header class="top-0 left-0 flex flex-col items-center w-screen py-5">
		<nav class="w-screen px-6">
			<RouterLink
				class="inline-flex flex-row items-center space-x-2 link"
				@click.native="$reortGaEvent('recommand', 'footer')"
				to="/"
			>
				<img
					src="@/assets/images/logo.png"
					alt="玉桃文飨轩"
					width="50"
					height="50"
				/>
				<h1 class="text-xl font-bold rainbow-text">玉桃文飨轩</h1>
			</RouterLink>
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
		background-image: linear-gradient(0deg, #ff6768 28%, #a3cd39 60%);
		background-clip: text;
		-webkit-background-clip: text;
	}
}
</style>
