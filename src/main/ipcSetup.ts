import {  BrowserWindow, ipcMain } from "electron";
import { changeCurDir, getRenameInfo, getSetting, initSetting, renameMainProcess, searchRecordData, store,  updateAutoRefresh, updateAutoSort, updateDisplaySize, updateMaxGoupCount, updateMaxGroupGapSeconds, updateRenamePreview, updateRenamineRecord } from "./dataProcess";
import { mainWindow } from ".";
import test from "node:test";
import path from "node:path";
import { is } from "@electron-toolkit/utils";
export function ipcSetup() {
	// setTimeout(() => {
		// }, 500)
		// !人家明明有专门的事件的…………你上个项目…………
		// document.addEventListener('DOMContentLoaded', () => {
	// })
	// !咳咳并不能在主进程内使用，只能在渲染或者preload
	ipcMain.once('DOMContentLoaded', () => {
		initSetting();
	})

	//**----------------------------Data-----------------------------------------------------
	ipcMain.handle("electron-store-get", async(event, key) => {
		// @ts-ignore
		return store.get(key);
	})
	ipcMain.on("electron-store-set", (event, key, value) => {
		// @ts-ignore
		store.set(key, value);
	})
	ipcMain.on('request-init-setting', () => {
		SettingWindow?.webContents.send('init-setting', getSetting());
	})

	ipcMain.on('request-update-record-data', () => {
    mainWindow.webContents.send('update-record-data', searchRecordData());
    // console.log('index update-record-data', testData)
	})

	ipcMain.on('request-change-cur-dir', (event, arg) => {
		const curDir = changeCurDir();
		if(curDir)
		mainWindow.webContents.send('update-cur-dir', curDir);
	})

	ipcMain.on("request-change-display-size", (e, arg) => {
		updateDisplaySize(arg);
	})
	var updateRecordDataTimer: NodeJS.Timeout | null = null;
	function refreshRecordData() {
		if(updateRecordDataTimer)clearTimeout(updateRecordDataTimer)
		updateRecordDataTimer = setTimeout(() => {
			mainWindow.webContents.send('update-record-data', searchRecordData());
		},500)
	}
	ipcMain.on("request-change-max-group-gap-seconds", (e, arg) => {
		updateMaxGroupGapSeconds(arg);
		refreshRecordData();
	})
	ipcMain.on("request-change-max-group-count", (e, arg) => {
		updateMaxGoupCount(arg);
		refreshRecordData();
	})
	ipcMain.on("request-change-auto-sort", (e, arg) => {
		updateAutoSort(arg);
		refreshRecordData();
	})
	ipcMain.on("request-change-auto-refresh", (e, arg) => {
		updateAutoRefresh(arg);
	})

	//**----------------------------Renaming Process-----------------------------------------------------
	type renamingRecordData = {
		name: string,
		checked: boolean
	}
	ipcMain.on("request-update-renaming-record", (e, arg:renamingRecordData) => {
		updateRenamineRecord(arg.name, arg.checked);
	})
	ipcMain.handle('request-init-rename-info', () => {
		return getRenameInfo();
	})
	type renameProps = {renameScheme:string, game:string, message:string}
	ipcMain.handle('request-update-rename-preview', (e, arg:renameProps) => {
		return updateRenamePreview(arg.renameScheme,arg.game,arg.message);
	})
	ipcMain.on('request-rename-process', (e, arg:renameProps) => {
		// setTimeout(() => {mainWindow.webContents.send('finish-rename-process',1)}, 2000)
		renameMainProcess(arg.renameScheme, arg.game, arg.message).then(() =>
			// mainWindow.webContents.send('finish-rename-process', 1)
			e.reply('finish-rename-process', 1)
		)
	})

	//**----------------------------Window-----------------------------------------------------
	var SettingWindow: BrowserWindow | null = null;
	ipcMain.on("open-settings", () => {
		if(BrowserWindow.getAllWindows().some(win => win.title === "Settings")){SettingWindow?.show();return}
		SettingWindow = new BrowserWindow({
			width: 400,
			height: 450,
			title: "Settings",
			webPreferences: {
				preload: path.join(__dirname, '../preload/index.js'),
				sandbox: false,
				contextIsolation: false,
				nodeIntegration: true,
				webSecurity: false
			},
			parent: mainWindow,
			modal: true,
			// show: false,
			frame: false,
		});
		if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
			SettingWindow.loadURL(process.env['ELECTRON_RENDERER_URL']+'/Settings')
		} else {
			SettingWindow.loadFile(path.join(__dirname, '../renderer/setting.html'))
			// !index.html也一样的…………开发环视用不了loadFile…………
		}
		SettingWindow.once("ready-to-show", () => {
			SettingWindow?.show();
		});
	})
}