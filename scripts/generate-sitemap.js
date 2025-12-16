/**
 * 生成 sitemap.xml 脚本
 * 在构建时执行: node scripts/generate-sitemap.js
 */

import { writeFileSync } from 'fs'
import { resolve } from 'path'

const baseUrl = 'https://share.lovejade.cn'
const today = new Date().toISOString().split('T')[0]

const urls = [
  {
    loc: `${baseUrl}/`,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0'
  },
  {
    loc: `${baseUrl}/digest`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    loc: `${baseUrl}/about`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.6'
  }
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

const outputPath = resolve(process.cwd(), 'dist', 'sitemap.xml')
writeFileSync(outputPath, sitemap, 'utf-8')

console.log('✅ Sitemap generated successfully at:', outputPath)