<template>
	<div
		class="container flex-1 m-auto"
		:style="currentSize.style"
		:class="`${currentTheme.id}-box`"
		ref="container"
	>
		<div class="bg" v-if="currentTheme.id === 'official'"></div>
		<div class="content" :class="currentTheme.id">
			<div
				ref="editor"
				@blur="onEditorBlur"
				@focus="onEditorFocus"
				class="editor markdown"
				contenteditable="true"
			></div>
		</div>
	</div>
	<div
		class="flex flex-row items-center px-4 space-x-4 bg-white rounded-md shadow-lg operate-area h-28"
	>
		<div class="flex flex-col items-center justify-center w-24 h-full">
			<p class="pb-2 font-medium">日期</p>
			<Switch
				:state="contentStore.isWithDate"
				@check="handleDate"
				class="block"
			></Switch>
		</div>
		<HeadlessSelect
			className="w-24"
			:sourceArr="themesArr"
			:defaultItem="currentTheme"
			@selected="handleSelectTheme"
		/>
		<HeadlessSelect
			className="w-28"
			:sourceArr="sizesArr"
			:defaultItem="currentSize"
			@selected="handleSelectSize"
		/>
		<button
			class="flex flex-row items-center justify-center w-24 h-10 py-4 font-medium bg-gray-100 border border-solid rounded-md border-gray hover:bg-gray-50 dark:hover:bg-gray-900"
			@click="onSave2Image"
		>
			保存图片
		</button>
	</div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { parse } from 'marked'
import html2canvas from 'html2canvas'

import Switch from './Switch.vue'
import HeadlessSelect from './HeadlessSelect.vue'
import { useContentStore } from './../stores/content'
import { download2png, getCurrentDate } from './../helper/util'

const themesArr = [
	{ name: '古风', id: 'antiquity' },
	{ name: '经典', id: 'classic' },
	{ name: '便签', id: 'note' },
	{ name: '暗黑', id: 'dark' },
	{ name: '元气', id: 'vitality' },
	{ name: '纸屑', id: 'bbburst' },
	{ name: '渐变', id: 'gradient' },
	{ name: '公务', id: 'official' },
	{ name: '芒黄', id: 'yellow' },
]

const sizesArr = [
	{
		name: '电脑端',
		id: 'desktop',
		style: 'width: 50rem; aspect-ratio: 16 / 9; padding: 3rem;',
	},
	{
		name: '平板端',
		id: 'tablet',
		style: 'width: 37.5rem; aspect-ratio: 4 / 3; padding: 2rem;',
	},
	{
		name: '移动端',
		id: 'mobile',
		style: 'width: 20rem; aspect-ratio: 3 / 4; padding: 1rem;',
	},
]

export default {
	setup() {
		const contentStore = useContentStore()
		const currentTheme = ref(contentStore.currentTheme || themesArr[0])
		const currentSize = ref(contentStore.currentSize || sizesArr[0])

		return {
			contentStore,
			currentTheme,
			currentSize,
			themesArr,
			sizesArr,
		}
	},

	mounted() {
		this.$refs.editor.focus()
	},

	components: {
		Switch,
		HeadlessSelect,
	},

	methods: {
		updatePreview() {
			if (!this.$refs.editor) return

			let dateDomNode: any = document.getElementById('date-time')
			if (dateDomNode) return dateDomNode.remove()

			dateDomNode = `<p id='date-time' style='text-align: right;'><time>${getCurrentDate()}</time></p>`
			this.$refs.editor.innerHTML += dateDomNode
		},

		enter2preview() {
			this.$refs.editor.innerHTML = parse(this.contentStore.content)
		},

		enter2editor() {
			this.$refs.editor.innerText = this.contentStore.content
		},

		/* -------------------On Event Callback------------------- */
		handleDate(value: boolean) {
			this.contentStore.updateWithDate(value)
			this.updatePreview()
		},

		handleSelectTheme(item: Object) {
			this.currentTheme = item
			this.contentStore.updateCurrentTheme(item)
		},

		handleSelectSize(item: Object) {
			this.currentSize = item
			this.contentStore.updateCurrentSize(item)
		},

		onEditorFocus() {
			this.enter2editor()
		},

		onEditorBlur() {
			this.contentStore.updateContent(this.$refs.editor.innerText)
			this.enter2preview()
		},

		onSave2Image() {
			html2canvas(this.$refs.container).then((canvas) => {
				download2png(canvas)
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.container {
	padding: 3rem;
	box-shadow: 0 2px 5px rgb(0 0 25 / 10%), 0 5px 75px 1px rgb(0 0 50 / 20%);
	transition: box-shadow 1s ease-out;
	transition-delay: 2s;
	background-color: transparent;
	.content {
		width: 100%;
		height: 100%;
		flex: 1 1 0%;
		position: relative;

		.editor {
			min-height: 12rem;
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

.antiquity-box {
	background: #e9e7d9 url('./../assets/images/classical.png') repeat 0 0;
	.antiquity {
		border: 4px solid #c02c38;
		padding: 1rem;
		&::before {
			position: absolute;
			z-index: -1;
			left: 5px;
			top: 5px;
			right: 5px;
			bottom: 5px;
			content: '';
			width: calc(100% - 10px);
			height: calc(100% - 10px);
			border: 1px solid #c02c38;
			opacity: 0.8;
			z-index: 0;
		}
	}
}

.classic-box {
	background-color: #f2f2f2;
	.classic {
		background-color: #f2f2f2;
	}
}

.note-box {
	background-color: #fffcf5;
	.note {
		border: 1px solid #e8e5dc;
		&::before {
			position: absolute;
			content: '';
			left: 3px;
			right: 3px;
			bottom: 3px;
			top: 3px;
			border: 1px solid #e8e5dc;
			z-index: 0;
		}
	}
}

.dark-box {
	background-image: linear-gradient(to right, #434343 0%, black 100%);
	.dark {
		background-color: transparent;
		.editor {
			color: #f2f2f2;
			background-color: transparent;
		}
	}
}

.bbburst-box {
	background: url(./../assets/images/bbburst.svg);
	background-size: 100%;
	.bbburst {
		background-color: transparent;
		.editor {
			background-color: rgba(255, 255, 255, 0.8);
			backdrop-filter: blur(2px);
		}
	}
}

.vitality-box {
	background: linear-gradient(225deg, #9cccfc 0, #e6cefd 99.54%);
	.vitality {
		background-color: #f2f2f2;
		border-radius: 1rem;
	}
}

.gradient-box {
	background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);
	.gradient {
		background-color: transparent;
		.editor {
			background-color: transparent;
		}
	}
}

.official-box {
	position: relative;
	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: -2;
		background: linear-gradient(
			180deg,
			#04629d 0,
			#037dcc 49.48%,
			#0289e0 100%
		);
	}
	.bg {
		position: absolute;
		z-index: -1;
		left: 0;
		top: -6.6rem;
		right: 0;
		bottom: 0;
		background: url(./../assets/images/official.svg);
		background-size: 80% auto;
		background-position: center top;
		background-repeat: no-repeat;
	}
	.official {
		.editor {
			color: #f2f2f2;
			background-color: transparent;
		}
	}
}

.yellow-box {
	background-image: radial-gradient(circle farthest-side, #fceabb, #f8b500);
	.yellow {
		.editor {
			color: #000;
			background-color: transparent;
		}
	}
}

.operate-area {
	max-width: 50rem;
	margin: 2rem auto;
}
</style>
