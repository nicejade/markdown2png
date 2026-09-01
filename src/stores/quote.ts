import { defineStore } from 'pinia'
import {
	assembleQuoteInput,
	DEFAULT_QUOTE_INPUT,
	getQuoteSize,
	getQuoteTemplate,
	parseQuoteInput,
	QUOTE_SIZES,
	QUOTE_STORAGE_KEY,
	QUOTE_TEMPLATES,
	type QuoteSizeId,
	type QuoteTemplateId,
} from '../helper/quote'

const VALID_TEMPLATE_IDS = new Set(QUOTE_TEMPLATES.map((item) => item.id))
const VALID_SIZE_IDS = new Set(QUOTE_SIZES.map((item) => item.id))

interface QuotePersistedState {
	rawInput: string
	quote: string
	author: string
	templateId: QuoteTemplateId
	sizeId: QuoteSizeId
}

function createDefaultState(): QuotePersistedState {
	const parsed = parseQuoteInput(DEFAULT_QUOTE_INPUT)
	return {
		rawInput: DEFAULT_QUOTE_INPUT,
		quote: parsed.quote,
		author: parsed.author,
		templateId: 'paper',
		sizeId: 'portrait',
	}
}

function loadState(): QuotePersistedState {
	const fallback = createDefaultState()
	try {
		const saved = localStorage.getItem(QUOTE_STORAGE_KEY)
		if (!saved) return fallback
		const data = JSON.parse(saved)
		return {
			rawInput: typeof data.rawInput === 'string' ? data.rawInput : fallback.rawInput,
			quote: typeof data.quote === 'string' ? data.quote : fallback.quote,
			author: typeof data.author === 'string' ? data.author : fallback.author,
			templateId: VALID_TEMPLATE_IDS.has(data.templateId) ? data.templateId : fallback.templateId,
			sizeId: VALID_SIZE_IDS.has(data.sizeId) ? data.sizeId : fallback.sizeId,
		}
	} catch {
		return fallback
	}
}

export const useQuoteStore = defineStore('quote', {
	state: (): QuotePersistedState => loadState(),

	getters: {
		template: (state) => getQuoteTemplate(state.templateId),
		size: (state) => getQuoteSize(state.sizeId),
	},

	actions: {
		persist() {
			localStorage.setItem(
				QUOTE_STORAGE_KEY,
				JSON.stringify({
					rawInput: this.rawInput,
					quote: this.quote,
					author: this.author,
					templateId: this.templateId,
					sizeId: this.sizeId,
				})
			)
		},

		setRawInput(value: string) {
			this.rawInput = value
			const parsed = parseQuoteInput(value)
			this.quote = parsed.quote
			this.author = parsed.author
			this.persist()
		},

		setQuote(value: string) {
			this.quote = value
			this.rawInput = assembleQuoteInput(this.quote, this.author)
			this.persist()
		},

		setAuthor(value: string) {
			this.author = value
			this.rawInput = assembleQuoteInput(this.quote, this.author)
			this.persist()
		},

		setTemplate(id: QuoteTemplateId) {
			if (!VALID_TEMPLATE_IDS.has(id)) return
			this.templateId = id
			this.persist()
		},

		setSize(id: QuoteSizeId) {
			if (!VALID_SIZE_IDS.has(id)) return
			this.sizeId = id
			this.persist()
		},
	},
})
