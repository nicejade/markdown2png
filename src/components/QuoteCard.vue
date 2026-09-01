<script setup lang="ts">
import { computed } from 'vue'
import paperBg from '../assets/images/quote/paper.jpg'
import folioBg from '../assets/images/quote/folio.jpg'
import midnightBg from '../assets/images/quote/midnight.jpg'
import ivoryBg from '../assets/images/quote/ivory.jpg'
import editorialBg from '../assets/images/quote/editorial.jpg'
import {
	formatAuthor,
	resolveAuthorFontSize,
	resolveQuoteFontSize,
	type QuoteSize,
	type QuoteTemplate,
} from '../helper/quote'

const backgrounds: Record<string, string> = {
	paper: paperBg,
	folio: folioBg,
	midnight: midnightBg,
	ivory: ivoryBg,
	editorial: editorialBg,
}

const props = defineProps<{
	quote: string
	author: string
	template: QuoteTemplate
	size: QuoteSize
}>()

const displayQuote = computed(() => props.quote.trim() || 'Your quote goes here.')
const displayAuthor = computed(() => formatAuthor(props.author))
const quoteFontSize = computed(() =>
	resolveQuoteFontSize(displayQuote.value, props.size.width, props.template.fontScale)
)
const authorFontSize = computed(() => resolveAuthorFontSize(quoteFontSize.value))

const cardStyle = computed(() => ({
	width: `${props.size.width}px`,
	height: `${props.size.height}px`,
	backgroundImage: `url(${backgrounds[props.template.id]})`,
	'--quote-font': `'${props.template.fontFamily}', 'Times New Roman', serif`,
	'--quote-color': props.template.quoteColor,
	'--author-color': props.template.authorColor,
	'--quote-size': `${quoteFontSize.value}px`,
	'--author-size': `${authorFontSize.value}px`,
	'--quote-weight': String(props.template.quoteWeight),
	'--quote-max': `${props.template.maxCh}ch`,
	'--quote-align': props.template.align,
}))
</script>

<template>
	<div
		id="quote-card"
		class="quote-card"
		:class="[`quote-card--${template.id}`, `quote-card--${size.id}`]"
		:style="cardStyle"
		role="img"
		:aria-label="displayAuthor ? `${displayQuote} ${displayAuthor}` : displayQuote">
		<div class="quote-card__ornament" aria-hidden="true">“</div>
		<div class="quote-card__body">
			<p class="quote-card__text">{{ displayQuote }}</p>
			<p v-if="displayAuthor" class="quote-card__author">{{ displayAuthor }}</p>
		</div>
	</div>
</template>

<style lang="scss">
.quote-card {
	position: relative;
	overflow: hidden;
	background-color: #f3f1ed;
	background-size: cover;
	background-position: center center;
	background-repeat: no-repeat;
	color: var(--quote-color);
	font-family: var(--quote-font);
	user-select: none;
	-webkit-font-smoothing: antialiased;
}

.quote-card__ornament {
	display: none;
}

.quote-card__body {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	padding: 16% 14%;
	text-align: var(--quote-align);
	box-sizing: border-box;
}

.quote-card__text {
	margin: 0;
	max-width: var(--quote-max);
	color: var(--quote-color);
	font-family: var(--quote-font);
	font-size: var(--quote-size);
	font-weight: var(--quote-weight);
	line-height: 1.45;
	letter-spacing: 0.01em;
	text-wrap: balance;
	word-break: break-word;
}

.quote-card__author {
	margin: 0;
	max-width: var(--quote-max);
	color: var(--author-color);
	font-family: var(--quote-font);
	font-size: var(--author-size);
	font-weight: 400;
	line-height: 1.4;
	letter-spacing: 0.04em;
}

.quote-card--paper {
	background-position: center center;

	.quote-card__body {
		padding: 18% 16%;
	}

	.quote-card__author {
		margin-top: 2.6em;
		letter-spacing: 0.02em;
	}
}

.quote-card--folio {
	background-position: center top;

	.quote-card__body {
		justify-content: center;
		padding: 6% 14% 10%;
		height: 70%;
		margin-top: auto;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.quote-card__text {
		line-height: 1.5;
	}

	.quote-card__author {
		margin-top: 2.2em;
	}
}

.quote-card--folio.quote-card--story .quote-card__body {
	height: 62%;
	padding-bottom: 16%;
}

.quote-card--folio.quote-card--square .quote-card__body {
	height: 68%;
	padding-bottom: 12%;
}

.quote-card--midnight {
	background-color: #161310;
	background-position: center center;

	.quote-card__body {
		padding: 18% 16%;
	}

	.quote-card__text {
		line-height: 1.4;
		letter-spacing: 0.015em;
	}

	.quote-card__author {
		margin-top: 2.8em;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		font-size: calc(var(--author-size) * 0.82);
	}

	.quote-card__author::before {
		content: '';
		display: block;
		width: 42px;
		height: 1px;
		margin: 0 auto 1.5em;
		background: currentColor;
		opacity: 0.7;
	}
}

.quote-card--ivory {
	background-color: #e8dcc8;
	background-position: center center;

	.quote-card__body {
		padding: 22% 20%;
	}

	.quote-card__text {
		line-height: 1.4;
		letter-spacing: 0.02em;
	}

	.quote-card__author {
		margin-top: 2.2em;
		letter-spacing: 0.12em;
		font-style: italic;
	}
}

.quote-card--editorial {
	background-color: #f4f1ea;
	background-position: center center;

	.quote-card__ornament {
		display: block;
		position: absolute;
		top: 7%;
		left: 9%;
		z-index: 0;
		color: var(--quote-color);
		font-family: 'Playfair Display', serif;
		font-size: 220px;
		font-weight: 500;
		line-height: 0.7;
		opacity: 0.1;
		pointer-events: none;
	}

	.quote-card__body {
		align-items: flex-start;
		padding: 22% 18% 16% 14%;
	}

	.quote-card__text {
		max-width: 16ch;
		line-height: 1.35;
		letter-spacing: -0.01em;
	}

	.quote-card__author {
		margin-top: 2.4em;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		font-size: calc(var(--author-size) * 0.78);
	}

	.quote-card__author::before {
		content: '';
		display: block;
		width: 36px;
		height: 1px;
		margin: 0 0 1.3em;
		background: currentColor;
		opacity: 0.55;
	}
}
</style>
