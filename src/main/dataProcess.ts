import { app, dialog } from 'electron'
import path from 'path'
import { mainWindow } from '.'
import ElectronStore from 'electron-store'

type recordGroupData =
	{
		dateTitle: string,
		recordData: Array<{ name: string, checked: boolean }>
	}
type recordData = Array<recordGroupData>
export const testData: recordData = [
	{
		dateTitle: "2024.07.11 13:04",
		recordData: [
			{ name: "Yuan Shen 原神 23.06.19 - 08.03生日礼物.png", checked: false },
			{ name: "Yuan Shen 原神  2023.07.05 ？？？卡出了奇怪的界面.png", checked: false },
			{ name: 'Yuan Shen 原神 23.06.19 - 13.27温迪传说.png', checked: false },
			{ name: 'Yuan Shen 原神 23.06.19 - 15.34公子传说.png', checked: false },
			{ name: 'Yuan Shen 原神 23.06.19 - 16.26公子传说.png', checked: false },
			{ name: 'Yuan Shen 原神 Screenshot 2023.07.06 花神诞祭 (61).png', checked: false },

		]
	},
	{
		dateTitle: "2024.07.12 22:00",
		recordData: [
			{ name: "Yuan Shen 原神 23.06.20 - 08.39七圣召唤.png", checked: false },
			{ name: 'Yuan Shen 原神 23.06.26 - 08.24钟离传说 (2).png', checked: false },
			{ name: 'Yuan Shen 原神 Screenshot 2023.07.05 须弥主线前段 (20).png', checked: false },

		]
	},
	{
		dateTitle: "2024.07.13 00:00",
		recordData: [
			{ name: "Yuan Shen 原神 Screenshot 2023.07.09 - 16.19.09.87.png", checked: false },
			{ name: 'Yuan Shen 原神 23.06.26 - 11.43钟离传说 (3).png', checked: false },
			{ name: 'Yuan Shen 原神 23.06.26 - 18.50甘雨传说.png', checked: false },
			{ name: 'Yuan Shen 原神 2023.07.05 1.jpg', checked: false },

		]
	},
]

export var store:ElectronStore;
import('electron-store').then(res => {
	// @ts-ignore
	const electronStore  = new res.default()// as ElectronStore<setting<string,any>> ;
	store = {
		// @ts-ignore
		get: electronStore.get.bind(electronStore),
		// @ts-ignore
		set: electronStore.set.bind(electronStore),
	}
})

// **配置默认设置
export function initDefaultSetting() {
	// @ts-ignore
	const displaySize = store.get('displaySize');
	if (!displaySize) {
		const defaultSetting = {
			curDir:path.join(app.getPath('videos'),"Yuan Shen 原神"),
			displaySize: 1,
			maxGroupCount: 5,
			autoSort: true,
			autoRefresh: 1
		}
		// @ts-ignore
		store.set(defaultSetting);
	}
}

export function changeCurDir() {
		const newDir =  dialog.showOpenDialogSync(mainWindow,{buttonLabel: '选择文件夹', properties: ["openDirectory"],defaultPath:app.getPath("videos"),message: "请选择需要整理回放的目录。"})
		console.log("newDir", newDir);

}