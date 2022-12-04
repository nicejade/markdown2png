<template>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" @close="closeModal" class="relative z-10">
			<TransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black bg-opacity-25" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-y-auto">
				<div
					class="flex items-center justify-center min-h-full p-4 text-center"
				>
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<DialogPanel
							class="w-full max-w-4xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
						>
							<DialogTitle
								as="h3"
								class="text-lg font-medium leading-6 text-gray-900"
							>
								效果预览
							</DialogTitle>
							<div
								class="flex items-center justify-start flex-auto px-2 py-2 mx-4 my-2 rounded-md shadow-inner bg-slate-50"
							>
								<div
									class="flex flex-col items-center justify-between h-20 mx-2"
								>
									<p class="pb-2 font-medium text-gray-400">FILTERS</p>
									<HeadlessSelect
										className="w-36"
										:sourceArr="FILTERS_ARR"
										:defaultId="FILTERS_ARR[0].id"
										@selected="handleFilter"
									/>
								</div>
								<button
									class="block h-12 px-2 py-2 mx-2 border border-gray-300 rounded-md w-36 hover:bg-gray-50"
									@click="onOperateImage('emboss')"
								>
									EMBOSS
								</button>
								<button
									class="block h-12 px-2 py-2 mx-2 border border-gray-300 rounded-md w-36 hover:bg-gray-50"
									@click="onOperateImage('grayscale')"
								>
									GRAYSCALE
								</button>
								<button
									class="block h-12 px-2 py-2 mx-2 border border-gray-300 rounded-md w-36 hover:bg-gray-50"
									@click="onOperateImage('colorize')"
								>
									COLORIZE
								</button>
							</div>
							<canvas id="preview-area" class="m-auto my-2"></canvas>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import HeadlessSelect from './../components/HeadlessSelect.vue'

import { ref, watch } from 'vue'
import {
	TransitionRoot,
	TransitionChild,
	Dialog,
	DialogPanel,
	DialogTitle,
} from '@headlessui/vue'
import html2canvas from 'html2canvas'

const props = defineProps({
	visble: Boolean,
})

let photonIns: any = null
const emit = defineEmits(['change'])
const isOpen = ref(props.visble) as any

const FILTERS_ARR = [
	{ name: 'Golden', id: 'golden' },
	{ name: 'Seagreen', id: 'seagreen' },
	{ name: 'Islands', id: 'islands' },
	{ name: 'Twenties', id: 'twenties' },
	{ name: 'Radio', id: 'radio' },
	{ name: 'Bluechrome', id: 'bluechrome' },
	{ name: 'Obsidian', id: 'obsidian' },
	{ name: 'Vintage', id: 'vintage' },
	{ name: 'Pastel Pink', id: 'pastel pink' },
]

watch(
	() => props.visble,
	(visble) => {
		isOpen.value = visble
		if (!visble) return
		import('@silvia-odwyer/photon').then((photon) => {
			photonIns = photon
			debugger
			filterImage(FILTERS_ARR[0].id)
		})
	}
)

function closeModal() {
	isOpen.value = false
	emit('change', false)
}

function generateImg() {
	return new Promise((resolve, reject) => {
		const container = document.getElementById('container')
		html2canvas(container).then((canvas) => {
			const imgUrl = canvas.toDataURL('image/png')
			const img = new Image()
			img.src = imgUrl
			img.onload = () => {
				resolve(img)
			}
		})
	})
}

const filterImage = async (style: String) => {
	const img = await generateImg()
	const size = { width: img.width, height: img.height }
	const { canvas, ctx, image } = renderNewImage(img, size)
	// Filter the image, the PhotonImage's raw pixels are modified
	photonIns.filter(image, style)
	// Place the modified image back on the canvas
	photonIns.putImageData(canvas, ctx, image)
}

function renderNewImage(img: HTMLImageElement, size: Object) {
	// Create a canvas and get a 2D context from the canvas
	const canvas = document.getElementById('preview-area')
	const ctx = canvas.getContext('2d')
	// Draw the image element onto the canvas
	canvas.width = size.width / 2
	canvas.height = size.height / 2
	ctx.drawImage(img, 0, 0, size.width / 2, size.height / 2)
	// Convert the ImageData found in the canvas to a PhotonImage (so that it can communicate with the core Rust library)
	const image = photonIns.open_image(canvas, ctx)
	return { canvas, ctx, image }
}

function handleFilter(item: Object) {
	filterImage(item.id)
}

const onOperateImage = async (action: string) => {
	const img = await generateImg()
	const size = { width: img.width, height: img.height }
	const { canvas, ctx, image } = renderNewImage(img, size)
	// Filter the image, the PhotonImage's raw pixels are modified
	photonIns[action](image)
	// Place the modified image back on the canvas
	photonIns.putImageData(canvas, ctx, image)
}
</script>
