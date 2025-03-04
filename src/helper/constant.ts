export const CURRENT_CONTENT = 'current-content'

export const HAVE_DATE = 'is-with-date'

export const CURRENT_THEME = 'current-theme'

export const CURRENT_SIZE = 'current-size'

export const DIGEST_TEXT = 'digest-text'

export const TAB_LABELS = {
	recent: "最近",
  earliest: "最早",
  popular: "热门",
}

export const THEME_ARR = [
	{ name: '元气', id: 'vitality' },
	{ name: '便签', id: 'note' },
	{ name: '古风', id: 'antiquity' },
	{ name: '经典', id: 'classic' },
	{ name: '暗黑', id: 'dark' },
	{ name: '纸屑', id: 'bbburst' },
	{ name: '渐变', id: 'gradient' },
	{ name: '公务', id: 'official' },
	{ name: '芒黄', id: 'yellow' },
]

export const SIZES_ARR = [
	{
		name: '电脑端',
		id: 'laptop',
		style: 'width: 50rem; padding: 3rem;',
	},
	{
		name: '移动端',
		id: 'mobile',
		style: 'width: 20rem; padding: 1rem;',
	},
	{
		name: '平板端',
		id: 'tablet',
		style: 'width: 37.5rem; padding: 2rem;',
	},
	{
		name: '超级屏',
		id: 'desktop',
		style: 'width: 60rem; padding: 3rem;',
	},
]

export const DEFAULT_TEXT = `[玉桃文飨轩](https://share.lovejade.cn/)，简单好用的在线文本工具；支持将 Markdown、rich text、word 等格式内容，快速转化为 png、pdf、html、PPT 等文件，并支持一键下载、社交分享、自定义设置等功能。

## 如何使用？

在 Foucs 状态，输入您的内容（支持 \`Markdown\` 格式）；在 Blur 状态，查看预览效果；点击「保存图片」，即可将内容生成图片并下载至本地。
`

export const STYLE_STORAGE_KEY = 'digest-style-settings'

// 默认样式设置
export const DEFAULT_STYLE_SETTINGS = {
  fontFamily: 'system-ui',
	fontSize: 16,
	selectedRatio: "default",
	textAlign: 'center',
	canvasWidth: 500,
	canvasHeight: 500,
  lineHeight: 2,
  letterSpacing: 20,
  edgePadding: 80,
  roundedRadius: 0,
  fontWeight: 'normal',
  textColor: '#000000',
  selectedBg: 0
}