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
				id="editor"
				ref="editor"
				@blur="onEditorBlur"
				@focus="onEditorFocus"
				class="editor markdown"
				contenteditable="true"
			></div>
		</div>
	</div>
	<div
		class="flex flex-row items-center w-full px-4 py-4 mx-auto my-8 bg-white rounded-md shadow-lg operate-area"
	>
		<div class="flex flex-wrap justify-between w-full space-x-6 item-center">
			<div class="flex justify-between flex-auto mobile-adjust">
				<div class="flex flex-col items-center justify-between h-20">
					<p class="pb-2 font-medium text-gray-400">选择主题</p>
					<HeadlessSelect
						className="w-24"
						:sourceArr="themesArr"
						:defaultItem="currentTheme"
						@selected="handleSelectTheme"
					/>
				</div>
				<div class="flex flex-col items-center justify-between h-20">
					<p class="pb-2 font-medium text-gray-400">选择尺寸</p>
					<HeadlessSelect
						className="w-28"
						:sourceArr="sizesArr"
						:defaultItem="currentSize"
						@selected="handleSelectSize"
					/>
				</div>
				<div class="flex flex-col items-center justify-between w-24 h-20">
					<p class="pb-2 font-medium text-gray-400">日期</p>
					<Switch
						:state="contentStore.isWithDate"
						@check="handleDate"
						class="block"
					></Switch>
				</div>
			</div>
			<div class="flex items-center mobile-w-full">
				<button
					class="block w-full py-3 text-lg font-bold text-gray-900 border border-gray-300 rounded-md dark:border-gray-900 px-9 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
					@click="onSave2Image"
				>
					保存图片
				</button>
			</div>
		</div>
	</div>
	<Recommand />
	<FooterNav />
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, reactive, onMounted } from 'vue'
import { parse } from 'marked'
import html2canvas from 'html2canvas'

import Switch from './../components/Switch.vue'
import HeadlessSelect from './../components/HeadlessSelect.vue'
import FooterNav from './../components/FooterNav.vue'
import Recommand from './../components/Recommand.vue'
import { useContentStore } from './../stores/content'
import { download2png, getCurrentDate } from './../helper/util'
import { themesArr, sizesArr } from './../helper/constant'

interface Theme {
	id: String
	name: String
}

interface Size {
	id: String
	name: String
	style: String
}

const contentStore = useContentStore()
let currentTheme = reactive(contentStore.currentTheme || themesArr[0])
let currentSize = reactive(contentStore.currentSize || sizesArr[0])

const editor = ref(null) as any
const container = ref({}) as any
const { proxy } = getCurrentInstance() as any

onMounted(() => {
	editor.value.focus()
})

function updatePreview() {
	if (!editor.value) return

	let dateDomNode: any = document.getElementById('date-time')
	if (dateDomNode) return dateDomNode.remove()

	if (!contentStore.isWithDate) return
	if (!editor.value.innerHTML) return

	dateDomNode = `<p id='date-time' style='text-align: right;'><time>${getCurrentDate()}</time></p>`
	editor.value.innerHTML += dateDomNode
}

function enter2preview() {
	editor.value.innerHTML = parse(contentStore.content)
}

function enter2editor() {
	editor.value.innerText = contentStore.content
}

/* -------------------On Event Callback------------------- */
function handleDate(value: boolean) {
	contentStore.updateWithDate(value)
	updatePreview()
}

function handleSelectTheme(item: Theme) {
	currentTheme.id = item.id
	currentTheme.name = item.name
	contentStore.updateCurrentTheme(item)
	proxy.$reortGaEvent('item', 'main')
}

function handleSelectSize(item: Size) {
	currentSize.id = item.id
	currentSize.name = item.name
	currentSize.style = item.style
	contentStore.updateCurrentSize(item)
	proxy.$reortGaEvent('size', 'main')
}

function onEditorFocus() {
	enter2editor()
	proxy.$reortGaEvent('focus', 'main')
}

function onEditorBlur() {
	contentStore.updateContent(editor.value.innerText)
	enter2preview()
	updatePreview()
	proxy.$reortGaEvent('blur', 'main')
}

function onSave2Image() {
	proxy.$reortGaEvent('save-img', 'main')
	html2canvas(container).then((canvas) => {
		download2png(canvas)
	})
}
</script>

<style lang="scss" scoped>
.container {
	height: auto;
	padding: 3rem;
	box-shadow: 0 2px 5px rgb(0 0 25 / 10%), 0 5px 75px 1px rgb(0 0 50 / 20%);
	transition: box-shadow 1s ease-out;
	transition-delay: 2s;
	background-color: transparent;
	.content {
		width: 100%;
		min-height: 100%;
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
	width: 40rem;
	.mobile-adjust {
		padding-right: 5rem;
	}

	.mobile-w-full {
		width: auto;
	}
}

@media (max-width: 960px) {
	.container {
		width: 100% !important;
	}
	#app .operate-area {
		width: 100%;
		.mobile-adjust {
			padding: 0;
			margin-bottom: 1rem;
		}
		.mobile-w-full {
			width: 100%;
			margin-left: 0;
		}
	}
}
</style>
