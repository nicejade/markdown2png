<template>
	<div class="container" ref="container">
		<div class="content">
			<div ref="editor" @blur="onEditorBlur" @focus="onEditorFocus" class="editor markdown" contenteditable="true">
			</div>
		</div>
	</div>
	<div class="operate-area flex flex-row items-center space-x-4 px-4 bg-white h-24 shadow-lg rounded-md">
		<div class="flex flex-col justify-center items-center w-24 h-full">
			<p class="pb-2 font-medium">日期</p>
			<Switch :state="isHaveDate" @check="handleDate" class="block" />
		</div>
		<button
			class="flex flex-row items-center	h-10 px-8 py-4 bg-gray-100 rounded-md font-medium border border-solid border-gray hover:bg-gray-50 dark:hover:bg-gray-900"
			@click="onSave2Image">保存图片
		</button>
		<Select :active="0" @change="onSelectChange"></Select>
	</div>
</template>

<script lang="ts">
import { parse } from 'marked'
import html2canvas from "html2canvas"

import { useContentStore } from './../stores/content'
import Switch from './Switch.vue'
import Select from './Select.vue'

export default {
	setup() {
		const contentStore = useContentStore()
		const isHaveDate = false

		return {
			isHaveDate,
			contentStore,
		}
	},

	mounted() {
		this.$refs.editor.focus()
	},

	components: {
		Switch,
		Select,
	},

	methods: {
		download2png(canvas) {
			const tempDomNode = document.createElement("a");
			tempDomNode.href = canvas.toDataURL("image/png");
			tempDomNode.download = new Date().getTime() + ".png";
			tempDomNode.click();
		},

		updatePreview() {
			this.$refs.editor.innerHTML += `<p>2022.02.21</p>`
		},

		enter2preview() {
			this.$refs.editor.innerHTML = parse(this.contentStore.content)
		},

		enter2editor() {
			this.$refs.editor.innerText = this.contentStore.content
		},

		/* -------------------On Event Callback------------------- */
		handleDate(value) {
			value ? this.updatePreview() : ''
		},

		onEditorFocus() {
			this.enter2editor()
		},

		onEditorBlur() {
			const innerText = this.$refs.editor.innerText
			this.contentStore.content = innerText
			this.enter2preview()
		},

		onSave2Image() {
			html2canvas(this.$refs.container).then(canvas => {
				this.download2png(canvas)
			})
		},

		onSelectChange(index: number) {
			console.log(index)
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #e9e7d9 url('./../assets/images/classical.png') repeat 0 0;
	padding: 2rem 1rem;
	box-shadow: 0 2px 5px rgb(0 0 25 / 10%), 0 5px 75px 1px rgb(0 0 50 / 20%);
	transition: box-shadow 1s ease-out;
	transition-delay: 2s;

	.content {
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

.operate-area {
	width: 50rem;
	margin: 2rem auto;
}
</style>