import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface AnytxtSearchPluginSettings {
	anytxtInstallPath: string;
    anytxtApiUrl: string;

}


const DEFAULT_SETTINGS: AnytxtSearchPluginSettings = {
	anytxtInstallPath: "",
	anytxtApiUrl: 'http://127.0.0.1:9920',

};

export default class AnytxtSearchPlugin extends Plugin {
	settings: AnytxtSearchPluginSettings;

	async onload() {
		await this.loadSettings();
        this.addSettingTab(new AnytxtSearchSettingTab(this.app, this));

		this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
			const target = evt.target as HTMLInputElement;
			if (evt.key === 'Enter' && target.getAttribute('enterkeyhint') === 'search' && target.type === 'search' && target.placeholder=="输入并开始搜索……"){
				// && target.placeholder!="搜索已安装的插件……" && target.placeholder!="搜索社区插件……"&& target.placeholder!="搜索……") { //本来应该区查找父容器是不是设置界面，插件市场界面，但是太深层了呀，还是放弃吧，直接用placeholder也行，排除掉第三方插件页面，插件商店页面，快捷键页面的搜索框
				const keyword = target.value;
				this.searchAnytxt(keyword);
			}
		});
	}

	async searchAnytxt(keyword: string) {
		const apiURL = this.settings.anytxtApiUrl;
        //@ts-ignore
        const vaultBasePath = this.app.vault.adapter.basePath;
		const searchParams = {
			id: 123,
			jsonrpc: "2.0",
			method: "ATRpcServer.Searcher.V1.Search",
			params: {
				input: {
					// pattern: `"${keyword}"`,
					pattern: keyword,
					// 关于搜索模式的更改，看这个 [The exact search and fuzzy search functions in the program do not affect HTTP | Anytxt Searcher](https://anytxt.net/forums/topic/the-exact-search-and-fuzzy-search-functions-in-the-program-do-not-affect-http/)
					// ？如果改为精准搜索，给keyword以空格分隔然后加引号？
					filterDir: vaultBasePath,
					// filterExt: "png",
                    filterExt: "*",
				}
			}
		};

		const options = {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		};

		fetch(apiURL, {
			method: 'POST',
			headers: options.headers,
			body: JSON.stringify(searchParams)
		})
		.then(response => response.json())
		.then(data => {
			if (data.error) {
				new Notice('Anytxt API Error: ' + data.error.message, 10000);
			} else {
                // 创建一个Notice来显示匹配的文件数量
                const notice1 = new Notice(`anytxt 匹配的文件数量: ${data.result.data.output.count}\n右键点击本通知，打开anytxt.exe`, 10000);
            
                // 右键点击通知，打开Anytxt
                notice1.noticeEl.oncontextmenu = () => {
                    // 创建一个命令行参数，用于启动Anytxt并搜索文件
                    // const command = `"D:\\AnyTXT Searcher\\ATGUI.exe" /s "${keyword}" /d "${vaultBasePath}" /e png`;
                    const command = `"${this.settings.anytxtInstallPath}" /s "${keyword}" /d "${vaultBasePath}"`;

                    // console.log(command);
            
                    // 执行命令
                    require('child_process').exec(command, (error: Error, stdout: string, stderr: string) => {
                        if (error) {
                            // 如果有错误，显示错误消息
                            new Notice('命令执行错误: ' + error.message, 10000);
                        } else {
                            // 如果没有错误，可以在这里添加处理stdout和stderr的逻辑
                        }
                    });
                };
            }
            
		})
		.catch(error => {
            if (error.message === 'Failed to fetch') {
                const notice2 = new Notice('无法连接到 Anytxt API 服务器，可能是anytxt.exe没有启动\n右键点击本通知，启动并打开anytxt.exe', 10000);
				notice2.noticeEl.oncontextmenu = () => {
					// *启动 anytxt.exe
					// require('child_process').execFile(this.settings.anytxtInstallPath, (error: Error, stdout: string, stderr: string)=> {
                    //     if (error) {
                    //         new Notice('命令执行错误: ' + error.message, 10000);
                    //     } else {
                    //     }
                    // });
					// *启动 anytxt.exe，并且搜索当前关键词
					const command = `"${this.settings.anytxtInstallPath}" /s "${keyword}" /d "${vaultBasePath}"`;
					require('child_process').exec(command, (error: Error, stdout: string, stderr: string) => {
						if (error) {
							new Notice('命令执行错误: ' + error.message, 10000);
						} else {
						}
					});
				}



				
            }else {
            new Notice('请求过程中发生错误: ' + error.message, 10000);
            }
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
class AnytxtSearchSettingTab extends PluginSettingTab {
	plugin: AnytxtSearchPlugin;

	constructor(app: App, plugin: AnytxtSearchPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		// 添加一个新的设置项来设置Anytxt的安装路径
		new Setting(containerEl)
			.setName('Anytxt 安装路径')
			.setDesc('Anytxt的安装路径，写到ATGUI.exe')
			.addText(text => text
				.setPlaceholder('Enter Anytxt installation path')
				.setValue(this.plugin.settings.anytxtInstallPath || '')
				.onChange(async (value) => {
					this.plugin.settings.anytxtInstallPath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
		.setName('Anytxt API URL')
		.setDesc('在Anytxt上方菜单栏：帮助→API接口，默认不可改')
		.addText(text => text
			.setPlaceholder('Enter API URL')
			.setValue(this.plugin.settings.anytxtApiUrl)
			.onChange(async (value) => {
				this.plugin.settings.anytxtApiUrl = value;
				await this.plugin.saveSettings();
			}));
	}
}
