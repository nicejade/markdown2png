#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
pnpm build-only

# 生成 sitemap.xml
pnpm generate:sitemap

# 进入生成的文件夹
cd ./dist

# 如果是发布到自定义域名
echo 'share.lovejade.cn' > CNAME

echo 'google.com, pub-8586652723015758, DIRECT, f08c47fec0942fa0' > ads.txt

git init
git add -A
git commit -m '🚀 local build for deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:nicejade/markdown2png.git master:gh-pages
cd -
