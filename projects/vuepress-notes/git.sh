npm run docs:build # 打包
rm -rf ./website/* # 删除之前的文件
mv ./docs/.vuepress/dist/* ./website # 拷贝新文件
git add .
git commit -m'fix'
git push