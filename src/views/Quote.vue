<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import QuoteCard from './../components/QuoteCard.vue'
import Spinner from './../components/Spinner.vue'
import { useQuoteStore } from './../stores/quote'
import { useToastStore } from './../stores/toast'
import { download2png } from './../helper/util'
import { ensureFontLoaded } from './../helper/fonts'
import { QUOTE_SIZES, QUOTE_TEMPLATES, type QuoteSizeId, type QuoteTemplateId } from './../helper/quote'
import paperBg from './../assets/images/quote/paper.jpg'
import folioBg from './../assets/images/quote/folio.jpg'
import midnightBg from './../assets/images/quote/midnight.jpg'
import ivoryBg from './../assets/images/quote/ivory.jpg'
import editorialBg from './../assets/images/quote/editorial.jpg'

const templateThumbs: Record<string, string> = {
	paper: paperBg,
	folio: folioBg,
	midnight: midnightBg,
	ivory: ivoryBg,
	editorial: editorialBg,
}

const quoteStore = useQuoteStore()
const toastStore = useToastStore()
const { rawInput, quote, author, templateId, sizeId, template, size } = storeToRefs(quoteStore)

const previewRef = ref<HTMLElement | null>(null)
const previewScale = ref(1)
const isCopying = ref(false)
const isSaving = ref(false)
const { proxy } = getCurrentInstance() as any

let snapdomModulePromise: Promise<typeof import('@zumer/snapdom')> | null = null
function loadSnapdom() {
	if (!snapdomModulePromise) {
		snapdomModulePromise = import('@zumer/snapdom')
	}
	return snapdomModulePromise
}

const scalerStyle = computed(() => ({
	width: `${size.value.width * previewScale.value}px`,
	height: `${size.value.height * previewScale.value}px`,
	'--preview-scale': String(previewScale.value),
}))

function updatePreviewScale() {
	if (!previewRef.value) return
	const availableWidth = previewRef.value.clientWidth
	if (availableWidth <= 0) return
	const availableHeight = Math.max(320, window.innerHeight - 180)
	const scaleX = availableWidth / size.value.width
	const scaleY = availableHeight / size.value.height
	previewScale.value = Math.min(1, scaleX, scaleY)
}

function preloadImage(src: string) {
	return new Promise<void>((resolve) => {
		const img = new Image()
		img.onload = () => resolve()
		img.onerror = () => resolve()
		img.src = src
		if (img.complete) resolve()
	})
}

async function loadTemplateFont() {
	await Promise.all([
		ensureFontLoaded(template.value.fontFamily),
		preloadImage(templateThumbs[template.value.id]),
	])
	try {
		await document.fonts.load(`${template.value.quoteWeight} 1rem "${template.value.fontFamily}"`)
	} catch {
		// Fallback fonts still render
	}
}

function onRawInput(event: Event) {
	const value = (event.target as HTMLTextAreaElement).value
	quoteStore.setRawInput(value)
	proxy.$reortGaEvent('quote-input', 'quote')
}

function onQuoteEdit(event: Event) {
	quoteStore.setQuote((event.target as HTMLInputElement).value)
}

function onAuthorEdit(event: Event) {
	quoteStore.setAuthor((event.target as HTMLInputElement).value)
}

function selectTemplate(id: QuoteTemplateId) {
	quoteStore.setTemplate(id)
	proxy.$reortGaEvent(`quote-template-${id}`, 'quote')
}

function selectSize(id: QuoteSizeId) {
	quoteStore.setSize(id)
	proxy.$reortGaEvent(`quote-size-${id}`, 'quote')
}

async function captureCard(): Promise<Blob> {
	const card = document.getElementById('quote-card')
	if (!card) {
		throw new Error('Quote card is not ready')
	}

	await loadTemplateFont()
	await nextTick()

	const images = Array.from(card.querySelectorAll('img'))
	await Promise.all([
		document.fonts.ready,
		preloadImage(templateThumbs[template.value.id]),
		...images.map((img) => {
			if (img.complete) return Promise.resolve()
			return new Promise<void>((resolve) => {
				img.onload = () => resolve()
				img.onerror = () => resolve()
				setTimeout(() => resolve(), 1200)
			})
		}),
	])

	const previousTransform = (card as HTMLElement).style.transform
	;(card as HTMLElement).style.transform = 'none'

	try {
		const { snapdom } = await loadSnapdom()
		const blob = await snapdom.toBlob(card, {
			type: 'png',
			embedFonts: true,
			dpr: 1,
			scale: 1,
			backgroundColor: null,
		} as any)
		if (!blob) {
			throw new Error('Failed to generate image')
		}
		return blob
	} finally {
		;(card as HTMLElement).style.transform = previousTransform
	}
}

async function onCopyImage() {
	if (isCopying.value) return
	if (!quote.value.trim()) {
		toastStore.info('请先输入一句金句')
		return
	}

	isCopying.value = true
	try {
		const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
		if (isIOS) {
			toastStore.info('iOS 环境暂不支持复制图片，请选择“保存图片”')
			return
		}

		const blob = await captureCard()
		if (!('clipboard' in navigator) || !(window as any).ClipboardItem) {
			throw new Error('当前浏览器不支持图片复制 API')
		}
		const pngBlob = blob.type === 'image/png' ? blob : new Blob([blob], { type: 'image/png' })
		const item = new (window as any).ClipboardItem({ 'image/png': pngBlob })
		await navigator.clipboard.write([item])
		toastStore.success('已复制图片至您的剪切板')
		proxy.$reortGaEvent('copy-img-success', 'quote')
	} catch (error) {
		console.error('复制图片失败:', error)
		toastStore.error('复制图片失败，请重试')
		proxy.$reortGaEvent('copy-img-failed', 'quote')
	} finally {
		isCopying.value = false
	}
}

async function onSave2Image() {
	if (isSaving.value) return
	if (!quote.value.trim()) {
		toastStore.info('请先输入一句金句')
		return
	}

	isSaving.value = true
	try {
		const blob = await captureCard()
		download2png(blob)
		setTimeout(() => {
			toastStore.success('已成功为你保存图片')
		}, 200)
		proxy.$reortGaEvent('save-img-success', 'quote')
	} catch (error) {
		console.error('保存图片失败:', error)
		toastStore.error('保存图片失败，请重试')
		proxy.$reortGaEvent('save-img-failed', 'quote')
	} finally {
		isSaving.value = false
	}
}

watch([size, template], async () => {
	await nextTick()
	updatePreviewScale()
})

watch(
	() => template.value.fontFamily,
	() => {
		void loadTemplateFont()
	}
)

onMounted(() => {
	updatePreviewScale()
	void loadTemplateFont()
	window.addEventListener('resize', updatePreviewScale)

	const idle = (window as any).requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1800))
	idle(() => loadSnapdom())
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', updatePreviewScale)
})
</script>

<template>
	<div class="quote-page w-[80rem] md:w-full flex md:flex-col items-start justify-between p-6 md:px-0 md:pt-2 md:pb-4">
		<div class="quote-preview-col relative w-3/5 mb-4 mr-8 md:w-full md:mr-0">
			<div ref="previewRef" class="quote-preview">
				<div class="quote-preview__scaler" :style="scalerStyle">
					<QuoteCard :quote="quote" :author="author" :template="template" :size="size" />
				</div>
			</div>
		</div>

		<div class="w-2/5 md:w-full">
			<div class="w-full px-5 py-5 mx-auto space-y-4 bg-white shadow-lg rounded-xl">
				<div>
					<strong class="text-lg font-medium">输入金句</strong>
					<p class="mt-1 text-sm text-gray-400">粘贴一句英文，破折号后面会自动识别为作者。</p>
				</div>

				<textarea
					:value="rawInput"
					rows="4"
					maxlength="500"
					class="w-full min-h-[96px] p-3 rounded-lg border border-gray-200 resize-none focus:outline-none focus:border-gray-400 text-base leading-relaxed"
					placeholder='"You’ve got to find what you love." — Steve Jobs'
					aria-label="金句原文"
					@input="onRawInput" />

				<div class="grid grid-cols-2 gap-4 md:grid-cols-1">
					<div>
						<label class="block mb-2 text-sm font-medium text-gray-400" for="quote-text">金句</label>
						<input
							id="quote-text"
							:value="quote"
							type="text"
							maxlength="400"
							class="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
							placeholder="金句正文"
							@input="onQuoteEdit" />
					</div>
					<div>
						<label class="block mb-2 text-sm font-medium text-gray-400" for="quote-author">作者</label>
						<input
							id="quote-author"
							:value="author"
							type="text"
							maxlength="80"
							class="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
							placeholder="可选"
							@input="onAuthorEdit" />
					</div>
				</div>
			</div>

			<div class="w-full px-5 py-5 mx-auto my-4 space-y-4 bg-white shadow-lg rounded-xl">
				<strong class="text-lg font-medium">选择模板</strong>
				<div class="grid grid-cols-5 gap-3 md:grid-cols-5 sm:grid-cols-3" role="listbox" aria-label="金句模板">
					<button
						v-for="item in QUOTE_TEMPLATES"
						:key="item.id"
						type="button"
						class="quote-thumb group"
						:class="{ 'is-active': item.id === templateId }"
						role="option"
						:aria-selected="item.id === templateId"
						:title="item.description"
						@click="selectTemplate(item.id)">
						<span
							class="quote-thumb__swatch"
							:style="{ backgroundImage: `url(${templateThumbs[item.id]})` }" />
						<span class="quote-thumb__name">{{ item.name }}</span>
					</button>
				</div>
			</div>

			<div class="w-full px-5 py-5 mx-auto my-4 space-y-4 bg-white shadow-lg rounded-xl">
				<strong class="text-lg font-medium">画幅</strong>
				<div class="flex flex-row p-1 bg-gray-100 rounded-lg" role="radiogroup" aria-label="画幅">
					<button
						v-for="item in QUOTE_SIZES"
						:key="item.id"
						type="button"
						class="flex-1 h-10 text-sm rounded-md cursor-pointer"
						:class="item.id === sizeId ? 'bg-white shadow font-medium text-gray-900' : 'text-gray-500 hover:text-gray-800'"
						role="radio"
						:aria-checked="item.id === sizeId"
						@click="selectSize(item.id)">
						{{ item.name }}
					</button>
				</div>
				<div class="flex flex-row items-center w-full pt-2 justify-evenly" role="group">
					<button class="space-x-2 general-btn" :disabled="isCopying" @click="onCopyImage">
						<Spinner v-if="isCopying" :size="20" />
						<SvgIcon v-else name="copy" />
						<span>{{ isCopying ? '复制中...' : '复制图片' }}</span>
					</button>
					<button class="space-x-2 general-btn" :disabled="isSaving" @click="onSave2Image">
						<Spinner v-if="isSaving" :size="20" />
						<SvgIcon v-else name="download" />
						<span>{{ isSaving ? '保存中...' : '保存图片' }}</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.quote-preview {
	width: 100%;
}

.quote-preview__scaler {
	position: relative;
	overflow: hidden;
	border-radius: 8px;
	box-shadow: 0 8px 32px rgb(0 0 50 / 12%);
}

.quote-preview__scaler :deep(#quote-card) {
	transform: scale(var(--preview-scale, 1));
	transform-origin: top left;
}

.quote-thumb {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	padding: 0;
	background: transparent;
	border: none;
	cursor: pointer;
}

.quote-thumb__swatch {
	display: block;
	width: 100%;
	aspect-ratio: 3 / 4;
	border-radius: 0.5rem;
	background-size: cover;
	background-position: center;
	box-shadow: inset 0 0 0 1px rgb(0 0 0 / 8%);
	transition: transform 180ms ease, box-shadow 180ms ease;
}

.quote-thumb:hover .quote-thumb__swatch,
.quote-thumb:focus-visible .quote-thumb__swatch {
	transform: translateY(-1px);
}

.quote-thumb.is-active .quote-thumb__swatch {
	box-shadow: 0 0 0 2px #fff, 0 0 0 4px #f59e0b;
}

.quote-thumb__name {
	font-size: 0.8rem;
	color: #6b7280;
}

.quote-thumb.is-active .quote-thumb__name {
	color: #111827;
	font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
	.quote-thumb__swatch {
		transition: none;
	}
}
</style>
