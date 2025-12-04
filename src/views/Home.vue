<script setup lang="ts">
import { computed, ref, getCurrentInstance, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { parse } from 'marked'
import { snapdom } from '@zumer/snapdom'
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
let isGeneratingBlob = false
let genBlobPromise: Promise<void> | null = null
// 添加缓存相关变量
let lastContentHash = ''
const { proxy } = getCurrentInstance() as any

// snapdom 配置选项
const snapdomOptions = {
	backgroundColor: '#ffffff',
	quality: 1,
	type: 'png' as const,
	filter: (node: HTMLElement) => {
		return !node.classList?.contains('exclude-from-image')
	},
}

// 生成内容和样式的哈希值用于缓存判断
function generateContentHash() {
	const content = editor.value?.innerHTML || ''
	const theme = currentTheme.value
	const size = currentSize.value
	const withDate = contentStore.isWithDate
	return btoa(encodeURIComponent(`${content}-${theme}-${size}-${withDate}`)).slice(0, 16)
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

function onPreviewImage() {
	visble.value = true
}

// 优化的 generateBlob 函数
async function generateBlob() {
	const currentContentHash = generateContentHash()

	if (imageBlob && lastContentHash === currentContentHash) {
		return
	}

	if (isGeneratingBlob) {
		if (genBlobPromise) {
			await genBlobPromise
		}
		return
	}

	isGeneratingBlob = true
	genBlobPromise = new Promise(async (resolve, reject) => {
		const container = document.getElementById('container')
		const editorEl: HTMLInputElement = container.querySelector('#editor')
		try {
			// 预处理：确保所有字体和图片已加载
			await Promise.all([
				document.fonts.ready,
				...Array.from(container.querySelectorAll('img')).map(img => {
					if (img.complete) return Promise.resolve()
					return new Promise((resolve) => {
						img.onload = resolve
						img.onerror = resolve // 即使图片加载失败也继续
						setTimeout(resolve, 1000) // 1秒超时
					})
				})
			])

			// 临时优化样式
			const originalStyles = {
				transition: container.style.transition,
				animation: container.style.animation,
				contentEditable: editorEl.contentEditable,
				transform: container.style.transform
			}

			// 应用优化样式
			container.style.transition = 'none'
			container.style.animation = 'none'
			container.style.transform = 'translateZ(0)' // 启用硬件加速
			editorEl.contentEditable = 'false'

			// 强制重排和重绘
			container.offsetHeight

			// 使用 snapdom 生成图片
			imageBlob = await snapdom.toBlob(container, snapdomOptions)

			// 恢复原始样式
			Object.assign(container.style, originalStyles)
			editorEl.contentEditable = originalStyles.contentEditable

			// 更新缓存哈希
			lastContentHash = currentContentHash

			resolve()
		} catch (error) {
			editorEl.contentEditable = 'true'
			console.error('Failed to generate the image blob:', error)
			reject(error)
		} finally {
			isGeneratingBlob = false
			genBlobPromise = null
		}
	})
	await genBlobPromise
}

// 预生成图片（在用户可能点击复制前）
function preGenerateBlob() {
	if (!isGeneratingBlob && !imageBlob) {
		generateBlob().catch(console.error)
	}
}

/* -------------------On Event Callback------------------- */
function handleDate(value: boolean) {
	contentStore.updateWithDate(value)
	updatePreview()
	imageBlob = null // 清除缓存
	setTimeout(preGenerateBlob, 100)
	proxy.$reortGaEvent('home-date-change', 'main')
}

function handleSelectTheme(item: Theme) {
	contentStore.updateCurrentTheme(item.id)
	imageBlob = null // 清除缓存
	setTimeout(preGenerateBlob, 100)
	proxy.$reortGaEvent('home-theme', 'main')
	proxy.$reortGaEvent(`home-theme-${item.name}`, 'main')
}

function handleSelectSize(item: Size) {
	contentStore.updateCurrentSize(item.id)
	imageBlob = null // 清除缓存
	setTimeout(preGenerateBlob, 100)
	proxy.$reortGaEvent('home-size', 'main')
}

function onEditorFocus() {
	switch2editor()
	proxy.$reortGaEvent('home-focus', 'main')
}

function onEditorBlur() {
	contentStore.updateContent(editor.value.innerText)
	switch2preview()
	updatePreview()
	proxy.$reortGaEvent('home-blur', 'main')

	// 延迟预生成图片，避免阻塞 UI
	setTimeout(preGenerateBlob, 100)
}

async function onCopyImage() {
	if (isCopying.value) return
	isCopying.value = true

	try {
		const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
		// 桌面 Safari 允许尝试复制，iOS Safari 基本不支持图片写入剪贴板
		if (isIOS) {
			toastStore.info('iOS 环境暂不支持复制图片，请选择"保存图片"')
			return
		}

		// 如果没有缓存的图片或内容已变化，生成新图片
		if (!imageBlob || lastContentHash !== generateContentHash()) {
			await generateBlob()
		}

		if (imageBlob) {
			// 能力检测：仅在支持 ClipboardItem 与 clipboard.write 时尝试
			if (!('clipboard' in navigator) || !(window as any).ClipboardItem) {
				throw new Error('当前浏览器不支持图片复制 API')
			}
			const pngBlob = imageBlob.type === 'image/png' ? imageBlob : new Blob([imageBlob], { type: 'image/png' })
			const item = new (window as any).ClipboardItem({ 'image/png': pngBlob })
			await navigator.clipboard.write([item])
			toastStore.success('已复制图片至您的剪切板')
			proxy.$reortGaEvent('copy-img-success', 'main')
		}
	} catch (error) {
		console.error('复制图片失败:', error)
		toastStore.error('复制图片失败，请重试')
		proxy.$reortGaEvent('copy-img-failed', 'main')
	} finally {
		proxy.$reortGaEvent(`copy-img-${currentTheme.value}`, 'main')
		isCopying.value = false
	}
}

function onPreviewDialogChange(state: boolean) {
	visble.value = state
	proxy.$reortGaEvent('preview-dialog-change', 'main')
}

async function onSave2Image() {
	if (isSaving.value) return
	isSaving.value = true

	try {
		// 如果没有缓存的图片或内容已变化，生成新图片
		if (!imageBlob || lastContentHash !== generateContentHash()) {
			await generateBlob()
		}
		if (imageBlob) {
			// 确保在用户交互上下文中调用下载
			download2png(imageBlob)
			// 延迟显示成功消息，给 Safari 更多时间处理下载
			setTimeout(() => {
				toastStore.success('已成功为你保存图片')
			}, 200)
		}
		proxy.$reortGaEvent('save-img-success', 'main')
	} catch (error) {
		console.error('保存图片失败:', error)
		toastStore.error('保存图片失败，请重试')
		proxy.$reortGaEvent('save-img-failed', 'main')
	} finally {
		isSaving.value = false
	}
}
</script>

<template>
	<section class="flex justify-center w-full m-auto">
		<div id="container" class="container" style="text-autospace: normal;" :style="currentSizeObj.style">
			<div :class="`${currentThemeObj.id}-box warpper`">
				<div class="bg exclude-from-image" v-if="currentThemeObj.id === 'official'"></div>
				<div class="content" :class="currentThemeObj.id">
					<div id="editor" ref="editor" @blur="onEditorBlur" @focus="onEditorFocus" class="editor markdown"
						contenteditable="true">
					</div>
				</div>
			</div>
		</div>
	</section>

	<div class="flex flex-col items-center w-full px-6 py-4 mx-auto mt-8 mb-4 bg-white rounded-md shadow-lg operate-area">
		<div class="flex flex-wrap justify-between w-full space-x-6 item-center">
			<div class="flex justify-between flex-auto mobile-adjust md:justify-evenly">
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
		<div class="flex flex-row items-center justify-between w-full px-0 py-4 space-x-6 md:justify-evenly md:space-x-0"
			role="group">
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

<style lang="scss" scoped>
.container {
	transition: box-shadow 1s ease-out;
	transition-delay: 2s;

	.warpper {
		padding: 3rem;
		box-shadow: 0 2px 5px rgb(0 0 25 / 10%), 0 5px 75px 1px rgb(0 0 50 / 20%);
	}

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

.sakura-box {
	background-image: linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%);

	.sakura {
		background-color: transparent;

		.editor {
			color: #5a3d2b;
			background-color: rgba(255, 255, 255, 0.7);
			border-radius: 0.75rem;
			backdrop-filter: blur(4px);
		}
	}
}

.ocean-box {
	background-image: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);

	.ocean {
		background-color: transparent;

		.editor {
			color: #ffffff;
			background-color: rgba(255, 255, 255, 0.15);
			border-radius: 1rem;
			backdrop-filter: blur(8px);
		}
	}
}

.forest-box {
	background-image: linear-gradient(to bottom, #a8edea 0%, #fed6e3 25%, #d299c2 50%, #fef9d7 75%, #89f7fe 100%);

	.forest {
		background-color: transparent;

		.editor {
			color: #2d5016;
			background-color: rgba(255, 255, 255, 0.85);
			border-radius: 0.5rem;
		}
	}
}

.starry-box {
	background-image: radial-gradient(ellipse at center, #1e3c72 0%, #2a5298 35%, #1a1a2e 100%);

	.starry {
		background-color: transparent;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-image:
				radial-gradient(2px 2px at 20% 30%, white, transparent),
				radial-gradient(2px 2px at 60% 70%, white, transparent),
				radial-gradient(1px 1px at 50% 50%, white, transparent),
				radial-gradient(1px 1px at 80% 10%, white, transparent),
				radial-gradient(2px 2px at 90% 60%, white, transparent);
			background-size: 200% 200%;
			opacity: 0.6;
			animation: twinkle 20s infinite;
		}

		.editor {
			color: #e8eaf6;
			background-color: rgba(0, 0, 0, 0.3);
			border-radius: 0.75rem;
			backdrop-filter: blur(4px);
		}
	}
}

@keyframes twinkle {

	0%,
	100% {
		background-position: 0% 0%;
	}

	50% {
		background-position: 100% 100%;
	}
}

.aurora-box {
	background-image: linear-gradient(45deg,
			#667eea 0%,
			#764ba2 20%,
			#f093fb 40%,
			#4facfe 60%,
			#00f2fe 80%,
			#43e97b 100%);
	background-size: 400% 400%;
	animation: aurora 15s ease infinite;

	.aurora {
		background-color: transparent;

		.editor {
			color: #1a1a1a;
			background-color: rgba(255, 255, 255, 0.9);
			border-radius: 1rem;
			box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		}
	}
}

@keyframes aurora {
	0% {
		background-position: 0% 50%;
	}

	50% {
		background-position: 100% 50%;
	}

	100% {
		background-position: 0% 50%;
	}
}

.mint-box {
	background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);

	.mint {
		background-color: transparent;

		.editor {
			color: #0d4f3c;
			background-color: rgba(255, 255, 255, 0.8);
			border-radius: 1rem;
		}
	}
}

.sunset-box {
	background-image: linear-gradient(to bottom, #fa709a 0%, #fee140 50%, #ff6b6b 100%);

	.sunset {
		background-color: transparent;

		.editor {
			color: #3d1f00;
			background-color: rgba(255, 255, 255, 0.85);
			border-radius: 0.75rem;
			box-shadow: 0 2px 10px rgba(250, 112, 154, 0.3);
		}
	}
}

.purple-box {
	background-image: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);

	.purple {
		background-color: transparent;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			top: -50%;
			left: -50%;
			width: 200%;
			height: 200%;
			background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
			background-size: 50px 50px;
			animation: float 20s linear infinite;
		}

		.editor {
			color: #ffffff;
			background-color: rgba(118, 75, 162, 0.4);
			border-radius: 1rem;
			backdrop-filter: blur(6px);
		}
	}
}

@keyframes float {
	0% {
		transform: translate(0, 0) rotate(0deg);
	}

	100% {
		transform: translate(50px, 50px) rotate(360deg);
	}
}

.minimal-box {
	background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

	.minimal {
		background-color: #ffffff;
		border: 1px solid #e0e0e0;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

		.editor {
			color: #333333;
			background-color: transparent;
		}
	}
}

.tech-box {
	background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
	position: relative;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image:
			linear-gradient(90deg, transparent 79px, rgba(0, 255, 255, 0.03) 81px, rgba(0, 255, 255, 0.03) 82px, transparent 84px),
			linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px);
		background-size: 100px 20px;
		opacity: 0.5;
	}

	.tech {
		background-color: transparent;

		.editor {
			color: #00ffff;
			background-color: rgba(0, 0, 0, 0.4);
			border-radius: 0.25rem;
			box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
			text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
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