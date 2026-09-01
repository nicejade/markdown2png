export const DEFAULT_QUOTE_INPUT = `"You've got to find what you love." — Steve Jobs`

export const QUOTE_STORAGE_KEY = 'quote-settings'

export type QuoteTemplateId = 'paper' | 'folio' | 'midnight' | 'ivory' | 'editorial'
export type QuoteSizeId = 'portrait' | 'square' | 'story'

export interface QuoteTemplate {
	id: QuoteTemplateId
	name: string
	description: string
	fontFamily: string
	quoteColor: string
	authorColor: string
	fontScale: number
	quoteWeight: number
	maxCh: number
	align: 'center' | 'left'
}

export interface QuoteSize {
	id: QuoteSizeId
	name: string
	width: number
	height: number
}

export const QUOTE_TEMPLATES: QuoteTemplate[] = [
	{
		id: 'paper',
		name: '素纸',
		description: '留白衬字',
		fontFamily: 'Libre Baskerville',
		quoteColor: '#1c1c1c',
		authorColor: '#4f4f4f',
		fontScale: 1,
		quoteWeight: 400,
		maxCh: 18,
		align: 'center',
	},
	{
		id: 'folio',
		name: '书页',
		description: '布面书页',
		fontFamily: 'EB Garamond',
		quoteColor: '#1a1916',
		authorColor: '#2f2e2a',
		fontScale: 0.98,
		quoteWeight: 500,
		maxCh: 20,
		align: 'center',
	},
	{
		id: 'midnight',
		name: '夜墨',
		description: '暗夜金句',
		fontFamily: 'Playfair Display',
		quoteColor: '#f3ead8',
		authorColor: '#d4b896',
		fontScale: 1.04,
		quoteWeight: 400,
		maxCh: 16,
		align: 'center',
	},
	{
		id: 'ivory',
		name: '暖笺',
		description: '信笺暖意',
		fontFamily: 'Cormorant Garamond',
		quoteColor: '#3a3228',
		authorColor: '#6b5e4e',
		fontScale: 1.12,
		quoteWeight: 500,
		maxCh: 16,
		align: 'center',
	},
	{
		id: 'editorial',
		name: '刊首',
		description: '杂志引语',
		fontFamily: 'Playfair Display',
		quoteColor: '#1a1814',
		authorColor: '#5c574e',
		fontScale: 1.06,
		quoteWeight: 500,
		maxCh: 18,
		align: 'left',
	},
]

export const QUOTE_SIZES: QuoteSize[] = [
	{ id: 'portrait', name: '竖图 4:5', width: 1080, height: 1350 },
	{ id: 'square', name: '方图 1:1', width: 1080, height: 1080 },
	{ id: 'story', name: '故事 9:16', width: 1080, height: 1920 },
]

const SEPARATORS = ['——', '──', '—', '–', '―', ' -- ', ' - '] as const

const QUOTE_PAIRS: Array<[string, string]> = [
	['\u201C', '\u201D'],
	['\u2018', '\u2019'],
	['"', '"'],
	["'", "'"],
	['「', '」'],
	['『', '』'],
	['《', '》'],
]

function stripWrappingQuotes(value: string): string {
	if (value.length < 2) return value
	for (const [left, right] of QUOTE_PAIRS) {
		if (value.startsWith(left) && value.endsWith(right)) {
			return value.slice(left.length, value.length - right.length).trim()
		}
	}
	return value
}

function stripAuthorPrefix(author: string): string {
	return author.replace(/^[-—–―\s]+/, '').trim()
}

export function parseQuoteInput(raw: string): { quote: string; author: string } {
	const text = raw.replace(/\r\n/g, '\n').trim()
	if (!text) return { quote: '', author: '' }

	let splitAt = -1
	let sepLen = 0
	for (const sep of SEPARATORS) {
		const idx = text.lastIndexOf(sep)
		if (idx > 0) {
			splitAt = idx
			sepLen = sep.length
			break
		}
	}

	if (splitAt === -1) {
		return { quote: stripWrappingQuotes(text), author: '' }
	}

	return {
		quote: stripWrappingQuotes(text.slice(0, splitAt).trim()),
		author: stripAuthorPrefix(text.slice(splitAt + sepLen).trim()),
	}
}

export function assembleQuoteInput(quote: string, author: string): string {
	const q = quote.trim()
	const a = author.trim()
	if (!a) return q
	return `${q} — ${a}`
}

export function formatAuthor(author: string): string {
	const value = author.trim()
	if (!value) return ''
	if (/^[-—–―]/.test(value)) return value
	return `— ${value}`
}

export function resolveQuoteFontSize(text: string, cardWidth: number, fontScale = 1): number {
	const len = text.trim().length
	const k = cardWidth / 1080
	let base = 52
	if (len <= 24) base = 64
	else if (len <= 40) base = 56
	else if (len <= 70) base = 48
	else if (len <= 110) base = 42
	else if (len <= 160) base = 36
	else if (len <= 220) base = 32
	else base = 28
	return Math.round(base * k * fontScale)
}

export function resolveAuthorFontSize(quoteSize: number): number {
	return Math.max(18, Math.round(quoteSize * 0.42))
}

export function getQuoteTemplate(id: string): QuoteTemplate {
	return QUOTE_TEMPLATES.find((item) => item.id === id) ?? QUOTE_TEMPLATES[0]
}

export function getQuoteSize(id: string): QuoteSize {
	return QUOTE_SIZES.find((item) => item.id === id) ?? QUOTE_SIZES[0]
}
