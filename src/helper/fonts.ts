/**
 * On-demand web font loader.
 *
 * Font stylesheets used to be imported globally in the critical CSS bundle,
 * which blocked first paint with ~1MB of external CSS. Instead, each font's
 * stylesheet is injected lazily, only when the user actually selects it.
 */

const GOOGLE_FONTS_BASE = 'https://fonts.googleapis.com/css2'

// Font family name -> remote stylesheet URL
const FONT_STYLESHEET_MAP: Record<string, string> = {
	'Noto Sans SC': `${GOOGLE_FONTS_BASE}?family=Noto+Sans+SC&display=swap`,
	'Noto Serif SC': `${GOOGLE_FONTS_BASE}?family=Noto+Serif+SC&display=swap`,
	Inter: `${GOOGLE_FONTS_BASE}?family=Inter:wght@400;500;600;700&display=swap`,
	Roboto: `${GOOGLE_FONTS_BASE}?family=Roboto:wght@400;500;700&display=swap`,
	Montserrat: `${GOOGLE_FONTS_BASE}?family=Montserrat:wght@400;500;600;700&display=swap`,
	'Playfair Display': `${GOOGLE_FONTS_BASE}?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap`,
	'Libre Baskerville': `${GOOGLE_FONTS_BASE}?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap`,
	'Cormorant Garamond': `${GOOGLE_FONTS_BASE}?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap`,
	'EB Garamond': `${GOOGLE_FONTS_BASE}?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap`,
	ChillKai: 'https://fontsapi.zeoseven.com/5/main/result.css',
	'Huiwen-Fangsong': 'https://fontsapi.zeoseven.com/440/main/result.css',
	'LXGW WenKai': 'https://fontsapi.zeoseven.com/292/main/result.css',
	'Sarasa Gothic SC': 'https://fontsapi.zeoseven.com/161/main/result.css',
}

// Bilingual options declare a Chinese web font fallback that must load together
const FONT_FALLBACK_MAP: Record<string, string[]> = {
	Inter: ['Noto Sans SC'],
	Roboto: ['Noto Sans SC'],
	Montserrat: ['Noto Sans SC'],
	'Playfair Display': ['Noto Serif SC'],
}

const injectedStylesheets = new Map<string, Promise<void>>()

function injectStylesheet(href: string): Promise<void> {
	const pending = injectedStylesheets.get(href)
	if (pending) return pending

	const promise = new Promise<void>((resolve) => {
		const link = document.createElement('link')
		link.rel = 'stylesheet'
		link.href = href
		link.onload = () => resolve()
		// Never block the caller on a failed font stylesheet
		link.onerror = () => resolve()
		document.head.appendChild(link)
	})
	injectedStylesheets.set(href, promise)
	return promise
}

/**
 * Ensure the stylesheet(s) and font face(s) for the given family are loaded.
 * Resolves immediately for the system default font.
 */
export async function ensureFontLoaded(family: string): Promise<void> {
	if (!family || family === 'default' || !FONT_STYLESHEET_MAP[family]) return

	const families = [family, ...(FONT_FALLBACK_MAP[family] ?? [])]
	await Promise.all(families.map((name) => injectStylesheet(FONT_STYLESHEET_MAP[name])))
	await Promise.allSettled(families.map((name) => document.fonts.load(`1rem "${name}"`)))
}
