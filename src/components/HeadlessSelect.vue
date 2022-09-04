<template>
	<Listbox v-model="selectedVal">
		<div class="relative w-24">
			<ListboxButton
				class="relative w-full h-10 pl-3 pr-10 text-left bg-white border border-solid rounded-lg cursor-pointer border-gray focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
			>
				<span class="block truncate">{{ selectedVal.name }}</span>
				<span
					class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
				>
					<SelectorIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
				</span>
			</ListboxButton>

			<transition
				leave-active-class="transition duration-100 ease-in"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<ListboxOptions
					class="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
				>
					<ListboxOption
						v-slot="{ active, selected }"
						v-for="item in sourceArr"
						:key="item.name"
						:value="item"
						as="template"
					>
						<li
							:class="[
								active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
								'relative cursor-pointer select-none py-2 pl-10 pr-4 bg-red-500 hover:bg-lime-500',
							]"
						>
							<span
								:class="[
									selected ? 'font-medium' : 'font-normal',
									'block truncate',
								]"
								>{{ item.name }}</span
							>
							<span
								v-if="selected"
								class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
							>
								<CheckIcon class="w-5 h-5" aria-hidden="true" />
							</span>
						</li>
					</ListboxOption>
				</ListboxOptions>
			</transition>
		</div>
	</Listbox>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
	Listbox,
	ListboxLabel,
	ListboxButton,
	ListboxOptions,
	ListboxOption,
} from '@headlessui/vue'
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'

const props = defineProps({
	sourceArr: Array,
})

const emits = defineEmits(['selected'])

const selectedVal = ref(props.sourceArr[0])
watch(selectedVal, (newValue, oldValue) => {
	emits('selected', newValue)
})
</script>