<template>
	<div class="wrapper">
		<div class="container">
			<div class="editor" contenteditable="true">
			</div>
		</div>
	</div>
	<div class="flex flex-row items-center px-4 bg-white h-20 border-zinc-100 shadow-lg mt-8 rounded-md">
		<button
			class="flex flex-row items-center	h-10 px-8 py-2 bg-gray-100 rounded-md border border-zinc-100 border-solid border-slate-100"
			@click="onSave2Image">保存图片
		</button>
	</div>
</template>

<script lang="ts">
export default {
	methods: {
		onSave2Image() {
			alert(1)
		}
	}
}
</script>

<style lang="scss" scoped>
.wrapper {
	width: 30rem;
	background: #e9e7d9 url('./../assets/images/classical.png') repeat 0 0;
	padding: 2rem 1rem;
	box-shadow: 0 2px 5px rgb(0 0 25 / 10%), 0 5px 75px 1px rgb(0 0 50 / 20%);
	transition: box-shadow 1s ease-out;
	transition-delay: 2s;

	.container {
		width: 100%;
		flex: 1 1 0%;
		position: relative;
		border: 4px solid #c02c38;
		padding: 1rem;

		&::before {
			position: absolute;
			z-index: -1;
			left: 5px;
			top: 5px;
			right: 5px;
			bottom: 5px;
			content: "";
			border: 1px solid #c02c38;
			opacity: .8;
			z-index: 0;
		}

		.editor {
			min-height: 20rem;
			padding: 1rem;
			border: none;
			outline: none;

			&:hover,
			&:active {
				border: none;
				outline: none;
			}
		}
	}
}
</style>