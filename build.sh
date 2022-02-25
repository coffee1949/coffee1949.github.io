rm -rf node_modules    # 删除node_modules文件夹
rm -rf _book    # 删除_book文件夹
rm -rf docs     # 删除docs文件夹
gitbook install # 安装依赖
gitbook build   # 打包
mv _book docs   # _book改名为docs