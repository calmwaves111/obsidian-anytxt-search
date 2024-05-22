import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

const DEFAULT_SETTINGS = {
	anytxtApiUrl: 'http://127.0.0.1:9920'
};

export default class AnytxtSearchPlugin extends Plugin {
	settings: any;

	async onload() {
		await this.loadSettings();

		this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
			const target = evt.target as HTMLInputElement;
			if (evt.key === 'Enter' && target.getAttribute('enterkeyhint') === 'search' && target.type === 'search') {
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
					pattern: `"${keyword}"`,
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
                const notice1 = new Notice(`anytxt 匹配的文件数量: ${data.result.data.output.count}\n右键点击本通知打开anytxt`, 10000);
            
                // 右键点击通知，打开Anytxt
                notice1.noticeEl.oncontextmenu = () => {
                    // 创建一个命令行参数，用于启动Anytxt并搜索文件
                    // const command = `"D:\\AnyTXT Searcher\\ATGUI.exe" /s "${keyword}" /d "${vaultBasePath}" /e png`;
                    const command = `"D:\\AnyTXT Searcher\\ATGUI.exe" /s "${keyword}" /d "${vaultBasePath}"`;

                    console.log(command);
            
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
                new Notice('无法连接到 Anytxt API 服务器，请运行anytxt.exe', 10000);
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

		new Setting(containerEl)
			.setName('Anytxt API URL')
			.setDesc('The URL of the Anytxt search API.')
			.addText(text => text
				.setPlaceholder('Enter API URL')
				.setValue(this.plugin.settings.anytxtApiUrl)
				.onChange(async (value) => {
					this.plugin.settings.anytxtApiUrl = value;
					await this.plugin.saveSettings();
				}));
	}
}