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
	{ name: '便签', id: 'note' },
	{ name: '元气', id: 'vitality' },
	{ name: '渐变', id: 'gradient' },
	{ name: '古风', id: 'antiquity' },
	{ name: '经典', id: 'classic' },
	{ name: '暗黑', id: 'dark' },
	{ name: '纸屑', id: 'bbburst' },
	{ name: '公务', id: 'official' },
	{ name: '芒黄', id: 'yellow' },
	{ name: '樱花', id: 'sakura' },
	{ name: '海洋', id: 'ocean' },
	{ name: '森林', id: 'forest' },
	{ name: '星空', id: 'starry' },
	{ name: '极光', id: 'aurora' },
	{ name: '薄荷', id: 'mint' },
	{ name: '日落', id: 'sunset' },
	{ name: '紫霞', id: 'purple' },
	{ name: '极简', id: 'minimal' },
	{ name: '科技', id: 'tech' },
]

export const SIZES_ARR = [
	{
		name: '电脑端',
		id: 'laptop',
		style: 'width: 50rem;',
	},
	{
		name: '移动端',
		id: 'mobile',
		style: 'width: 20rem;',
	},
	{
		name: '平板端',
		id: 'tablet',
		style: 'width: 37.5rem;',
	},
	{
		name: '超级屏',
		id: 'desktop',
		style: 'width: 60rem;',
	},
]

export const DEFAULT_TEXT = `[玉桃文飨轩](https://share.lovejade.cn/)🍑 ，专业的文本转图片工具。一键将 Markdown 转换为精美图片，支持书摘模式、自定义主题、字体和背景。所有数据本地处理保障隐私安全，完美适配多端展示。让文章分享、读书笔记、社交传播更有格调。 基于 Vue3、Vite、Pinia、TailwindCSS、TypeScript 等技术栈构建。

## 如何使用？

在 Foucs 状态，输入您的内容（支持 \`Markdown\` 格式）；在 Blur 状态，查看预览效果；点击「保存图片」，即可将内容生成图片并下载至本地。

## 核心功能

- ✨ 一键将文本内容转换为高清图片，支持 Markdown 语法渲染；
- 🔒 所有数据本地处理，无需上传服务器，确保内容安全与隐私；
- 📱 灵活调整输出尺寸，完美适配手机、平板、电脑等多种设备；
- ⚡️ 一键复制图片至剪切板或下载图片，即时分享到各大社交平台；
`

export const STYLE_STORAGE_KEY = 'digest-style-settings'

// 存储用户上传的背景图片（Data URL 列表）
export const BACKGROUNDS_STORAGE_KEY = 'digest-backgrounds'

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