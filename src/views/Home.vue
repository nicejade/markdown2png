<template>
	<div id="container" ref="container" class="container my-4" :style="currentSizeObj.style"
		:class="`${currentThemeObj.id}-box`">
		<div class="bg" v-if="currentThemeObj.id === 'official'"></div>
		<div class="content" :class="currentThemeObj.id">
			<div id="editor" ref="editor" @blur="onEditorBlur" @focus="onEditorFocus" class="editor markdown"
				contenteditable="true"></div>
		</div>
	</div>
	<div class="flex flex-col items-center w-full px-4 py-4 mx-auto my-4 bg-white rounded-md shadow-lg operate-area">
		<div class="flex flex-wrap justify-between w-full space-x-6 item-center">
			<div class="flex justify-between flex-auto mobile-adjust">
				<div class="flex flex-col items-center justify-between h-20">
					<p class="pb-2 font-medium text-gray-400">选择主题</p>
					<HeadlessSelect className="w-24" :sourceArr="THEME_ARR" :defaultId="currentTheme"
						@selected="handleSelectTheme" />
				</div>
				<div class="flex flex-col items-center justify-between h-20 select-zize">
					<p class="pb-2 font-medium text-gray-400">选择尺寸</p>
					<HeadlessSelect className="w-28" :sourceArr="SIZES_ARR" :defaultId="currentSize"
						@selected="handleSelectSize" />
				</div>
				<div class="flex flex-col items-center justify-between w-24 h-20">
					<p class="pb-2 font-medium text-gray-400">日期</p>
					<Switch :state="contentStore.isWithDate" @check="handleDate" class="block"></Switch>
				</div>
			</div>
		</div>
		<div
			class="flex flex-row items-center w-full px-4 py-4 space-x-6 md:space-x-0 md:space-y-6 md:flex-col justify-evenly "
			role="group">
			<button class="block px-4 py-2 text-lg font-bold text-gray-900 border border-gray-300 rounded-md md:w-full"
				@click="onPreviewImage">
				预览图片
			</button>
			<button class="block px-4 py-2 text-lg font-bold text-gray-900 border border-gray-300 rounded-md md:w-full"
				@click="onCopyImage">
				复制图片
			</button>
			<button class="block px-4 py-2 text-lg font-bold text-gray-900 border border-gray-300 rounded-md md:w-full"
				@click="onSave2Image">
				保存图片
			</button>
		</div>
		<div id="toast-success" v-show="actionMsg"
			class="fixed flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow top-10"
			role="alert">
			<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
				<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
					viewBox="0 0 20 20">
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
				</svg>
			</div>
			<div class="text-sm font-normal ms-3">{{ actionMsg }}</div>
			<button type="button" @click="onCloseAlert"
				class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
				data-dismiss-target="#toast-success" aria-label="Close">
				<span class="sr-only">Close</span>
				<svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
					<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
				</svg>
			</button>
		</div>
	</div>
	<PreviewDialog :visble="visble" @change="onPreviewDialogChange" />
	<Recommand />
	<FooterNav />
</template>

<script setup lang="ts">
import { computed, ref, watch, getCurrentInstance, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { parse } from 'marked'
import html2canvas from 'html2canvas'

import Switch from './../components/Switch.vue'
import HeadlessSelect from './../components/HeadlessSelect.vue'
import FooterNav from './../components/FooterNav.vue'
import Recommand from './../components/Recommand.vue'
import PreviewDialog from './../components/PreviewDialog.vue'
import { useContentStore } from './../stores/content'
import { copy2clipboard, download2png, getCurrentDate, sleep } from './../helper/util'
import { THEME_ARR, SIZES_ARR } from './../helper/constant'

interface Theme {
	id: string
	name: string
}

interface Size {
	id: string
	name: string
	style: string
}

const contentStore = useContentStore()
let { currentSize, currentTheme } = storeToRefs(contentStore)

const editor = ref(null) as any
let visble = ref(false) as any
let actionMsg = ref(null)
const { proxy } = getCurrentInstance() as any

watch(actionMsg, async () => {
	await sleep(5000)
	actionMsg.value = null
})

onMounted(() => {
	// editor.value.focus() // NOTE: Cannot enter foucs state (at mobile end)
	switch2preview()

	updatePreview()

	handlePasteEvent()
})

const currentSizeObj = computed(() => {
	return SIZES_ARR.filter((item: Size) => item.id === currentSize.value)[0]
})

const currentThemeObj = computed(() => {
	return THEME_ARR.filter((item: Theme) => item.id === currentTheme.value)[0]
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

function switch2preview() {
	editor.value.innerHTML = parse(contentStore.content, {
		breaks: true,
	})
}

function switch2editor() {
	editor.value.innerText = contentStore.content
}

function handlePasteEvent() {
	const editor: Element | null = document.querySelector('#editor')
	editor?.addEventListener('paste', (event: any) => {
		const target = event.clipboardData || event?.dataTransfer
		let htmlPlain = target.getData('text/plain')
		htmlPlain = htmlPlain.replaceAll('\n', '<br />')
		const selection: Selection | null = window.getSelection()
		if (!selection?.rangeCount) return false
		selection.deleteFromDocument()
		document.execCommand('insertHTML', false, htmlPlain)
		event.preventDefault()
	})
}

/* -------------------On Event Callback------------------- */
function handleDate(value: boolean) {
	contentStore.updateWithDate(value)
	updatePreview()
}

function handleSelectTheme(item: Theme) {
	contentStore.updateCurrentTheme(item.id)
	proxy.$reortGaEvent('item', 'main')
}

function handleSelectSize(item: Size) {
	contentStore.updateCurrentSize(item.id)
	proxy.$reortGaEvent('size', 'main')
}

function onEditorFocus() {
	switch2editor()
	proxy.$reortGaEvent('focus', 'main')
}

function onEditorBlur() {
	contentStore.updateContent(editor.value.innerText)
	switch2preview()
	updatePreview()
	proxy.$reortGaEvent('blur', 'main')
}

function onSave2Image() {
	proxy.$reortGaEvent('save-img', 'main')
	const container = document.getElementById('container')
	html2canvas(container).then((canvas) => {
		download2png(canvas)
		actionMsg.value = '已成功为你保存图片'
	})
}

function onCloseAlert() {
	actionMsg.value = null
}

function onPreviewImage() {
	visble.value = true
}

function onCopyImage() {
	proxy.$reortGaEvent('save-img', 'main')
	const container = document.getElementById('container')
	html2canvas(container).then((canvas) => {
		copy2clipboard(canvas)
		actionMsg.value = '已复制图片至您的剪切板'
	})
}

function onPreviewDialogChange(state: boolean) {
	visble.value = state
}
</script>

<style lang="scss" scoped>
.container {
	// height: auto;
	padding: 3rem;
	box-shadow: 0 2px 5px rgb(0 0 25 / 10%), 0 5px 75px 1px rgb(0 0 50 / 20%);
	transition: box-shadow 1s ease-out;
	transition-delay: 2s;
	background-color: transparent;

	.content {
		position: relative;
		width: 100%;
		height: 100%;
		flex: 1 1 0%;

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
		position: relative !important;
		border: 3px solid #c02c38;
		padding: 1rem;
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
		background: linear-gradient(180deg,
				#04629d 0,
				#037dcc 49.48%,
				#0289e0 100%);
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

		.mobile-w-full+.mobile-w-full {
			margin-top: 1rem;
		}

		.select-zize {
			display: none;
		}
	}
}
</style>
