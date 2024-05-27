# Obsidian Anytxt Search

这是 [Obsidian](https://obsidian.md) 的一个插件，用来与 [Anytxt Searcher](https://anytxt.cbewin.com/)联动，搜索obsidian除md笔记以外的附件内容。

## How to use

1. 安装 [Anytxt Searcher](https://anytxt.cbewin.com/)
2. 在anytxt对obsidian库文件夹建立索引，并且排除掉md文件和canvas文件
3. 后台运行Anytxt
4. 在使用obsidian的核心插件——搜索时，输入关键字，按下回车键，将会自动在anytxt中进行搜索
5. 弹出通知，提示搜索到的文件数量
6. 右键点击通知，会打开anytxt显示当前搜索结果

- [x] 添加设置页面，anytxt的安装路径
- [x] 屏蔽掉插件市场的搜索框，搜索已安装插件列表里的搜索框
- [x] 未启动anytxt.exe时提示用户，并且右键点击通知来启动anytxt.exe
- [ ] 配置文件后缀名范围，屏蔽掉md和canvas文件，需anytxt的api支持，需命令行支持
- [ ] 支持高级搜索模式，需anytxt的api支持，需命令行支持
- [ ] 支持正则模式，并与obsidian的正则搜索适配，需anytxt的api支持，需命令行支持
- [ ] 尝试提取obsidian搜索语法的关键字，转换为简单单词，到anytxt中搜索
- [ ] 尝试与anytxt的搜索模式相匹配，最好还是anytxt直接api支持设置搜索模式，命令行也得允许设置搜索模式
    - [The exact search and fuzzy search functions in the program do not affect HTTP | Anytxt Searcher](https://anytxt.net/forums/topic/the-exact-search-and-fuzzy-search-functions-in-the-program-do-not-affect-http/)
    - 命令行现在的搜索模式是和软件设置保持一致的，api只是高级搜索模式


## Manually installing the plugin

复制`main.js`, `styles.css`, `manifest.json` 到库目录下 `VaultFolder/.obsidian/plugins/obsidian-anytxt/`.
