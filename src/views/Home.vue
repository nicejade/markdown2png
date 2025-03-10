<template>
	<section class="flex justify-center m-auto my-4 w-full">
		<div id="container" class="container" :style="currentSizeObj.style" :class="`${currentThemeObj.id}-box`">
			<div class="bg exclude-from-image" v-if="currentThemeObj.id === 'official'"></div>
			<div class="content" :class="currentThemeObj.id">
				<div id="editor" ref="editor" @blur="onEditorBlur" @focus="onEditorFocus" class="editor markdown"
					contenteditable="true">
				</div>
			</div>
		</div>
	</section>

	<div class="flex flex-col items-center px-4 py-4 mx-auto my-4 w-full bg-white rounded-md shadow-lg operate-area">
		<div class="flex flex-wrap justify-between space-x-6 w-full item-center">
			<div class="flex flex-auto justify-between mobile-adjust">
				<div class="flex flex-col justify-between items-center h-20">
					<p class="pb-2 font-medium text-gray-400">选择主题</p>
					<HeadlessSelect className="w-24" :sourceArr="THEME_ARR" :defaultId="currentTheme"
						@selected="handleSelectTheme" />
				</div>
				<div class="flex flex-col justify-between items-center h-20 select-zize">
					<p class="pb-2 font-medium text-gray-400">选择尺寸</p>
					<HeadlessSelect className="w-28" :sourceArr="SIZES_ARR" :defaultId="currentSize"
						@selected="handleSelectSize" />
				</div>
				<div class="flex flex-col justify-between items-center w-24 h-20">
					<p class="pb-2 font-medium text-gray-400">日期</p>
					<Switch :state="contentStore.isWithDate" @check="handleDate" class="block"></Switch>
				</div>
			</div>
		</div>
		<div class="flex flex-row justify-evenly items-center px-4 py-4 space-x-6 w-full md:space-x-0" role="group">
			<button class="general-btn md:hidden" @click="onPreviewImage">
				预览图片
			</button>
			<button class="space-x-1 general-btn" :disabled="isCopying" @click="onCopyImage">
				<Spinner v-if="isCopying" :size="20" />
				<span>{{ isCopying ? '复制中...' : '复制图片' }}</span>
			</button>
			<button class="space-x-1 general-btn" :disabled="isSaving" @click="onSave2Image">
				<Spinner v-if="isSaving" :size="20" />
				<span>{{ isSaving ? '保存中...' : '保存图片' }}</span>
			</button>
		</div>
	</div>
	<PreviewDialog :visble="visble" @change="onPreviewDialogChange" />
	<Recommand />
</template>

<script setup lang="ts">
import { computed, ref, getCurrentInstance, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { parse } from 'marked'
import { toBlob } from 'html-to-image'
import { useToastStore } from './../stores/toast'
import Switch from './../components/Switch.vue'
import Spinner from './../components/Spinner.vue'
import HeadlessSelect from './../components/HeadlessSelect.vue'
import Recommand from './../components/Recommand.vue'
import PreviewDialog from './../components/PreviewDialog.vue'
import { useContentStore } from './../stores/content'
import { download2png, getCurrentDate } from './../helper/util'
import { THEME_ARR, SIZES_ARR } from './../helper/constant'

const toastStore = useToastStore()

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
const isCopying = ref(false) as any
const isSaving = ref(false) as any
let imageBlob = null
let isGeneratingBlob = false // 添加标记位
let genBlobPromise: Promise<void> | null = null // 用于存储当前的 Promise
const { proxy } = getCurrentInstance() as any

const options = {
	quality: 0.8,
	pixelRatio: 1,
	skipAutoScale: true,
	cacheBust: false,
	backgroundColor: '#ffffff',
	filter: (node) => {
		return !node.classList?.contains('exclude-from-image')
	},
}

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

function onPreviewImage() {
	visble.value = true
}

async function generateBlob() {
	imageBlob = null
	if (isGeneratingBlob) {
		if (genBlobPromise) {
			await genBlobPromise
		}
		return
	}

	isGeneratingBlob = true
	genBlobPromise = new Promise(async (resolve, reject) => {
		try {
			const container = document.getElementById('container')
			const editorEl: HTMLInputElement = container.querySelector('#editor')
			// 临时移除所有动画和过渡效果 & 临时禁用 contenteditable
			container.style.transition = 'none'
			container.style.animation = 'none'
			editorEl.contentEditable = 'false'
			// 使用 requestAnimationFrame 确保样式更新已应
			await new Promise(resolve => requestAnimationFrame(resolve))
			imageBlob = await toBlob(container, options)
			// 恢复原始状态 & 恢复 contenteditable
			container.style.transition = ''
			container.style.animation = ''
			editorEl.contentEditable = 'true'
			resolve()
		} catch (error) {
			console.error('生成图片 blob 失败:', error)
			reject(error)
		} finally {
			isGeneratingBlob = false
			genBlobPromise = null
		}
	})
	await genBlobPromise
}

async function onCopyImage() {
	if (isCopying.value) return
	isCopying.value = true
	proxy.$reortGaEvent('save-img', 'main')

	try {
		const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
		const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

		if (isIOS || isSafari) {
			toastStore.info('iOS/Safari 环境请选择"保存图片"')
			return
		}

		if (!imageBlob) {
			await generateBlob()
		}
		if (imageBlob) {
			await navigator.clipboard.write([
				new ClipboardItem({
					'image/png': imageBlob
				})
			])
			toastStore.success('已复制图片至您的剪切板')
		}
	} catch (error) {
		console.error('复制图片失败:', error)
		toastStore.error('复制图片失败，请重试')
	} finally {
		isCopying.value = false
	}
}

function onPreviewDialogChange(state: boolean) {
	visble.value = state
}

async function onSave2Image() {
	if (isSaving.value) return
	isSaving.value = true
	proxy.$reortGaEvent('save-img', 'main')

	try {
		if (!imageBlob) {
			await generateBlob()
		}
		if (imageBlob) {
			download2png(imageBlob)
			toastStore.success('已成功为你保存图片')
		}
	} catch (error) {
		console.error('保存图片失败:', error)
		toastStore.error('保存图片失败，请重试')
	} finally {
		isSaving.value = false
	}
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
