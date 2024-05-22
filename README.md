# Obsidian Anytxt Search

这是 [Obsidian](https://obsidian.md) 的一个插件，用来与anytxt联动进行搜索obsidian除md笔记以外的附件内容。

## How to use

安装anytxt

在anytxt对obsidian库建立索引，并且排除掉md文件和canvas文件

后台运行anytxt.exe

在使用obsidian的核心插件——搜索时，输入关键字，按下回车键，将会自动在anytxt中进行搜索，使用的是anytxt的精准搜索模式（好像anytxt的api就只能用这种模式）

并且弹出通知，提示搜索到的文件数量

右键点击通知，会打开anytxt显示当前搜索结果

- [ ] 暂时还没写设置页面，需要添加anytxt的安装路径，有能力先自己改源码吧


## Manually installing the plugin

复制`main.js`, `styles.css`, `manifest.json` 到库目录下 `VaultFolder/.obsidian/plugins/obsidian-anytxt/`.
