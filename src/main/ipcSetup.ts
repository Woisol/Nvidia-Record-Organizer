import {  ipcMain } from "electron";
import { changeCurDir, initSetting, searchRecordData, store, testData } from "./dataProcess";
import { mainWindow } from ".";
import test from "node:test";
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
	ipcMain.on('request-update-record-data', () => {
    mainWindow.webContents.send('update-record-data', searchRecordData());
    // console.log('index update-record-data', testData)
	})

	ipcMain.on('request-change-cur-dir', (event, arg) => {
		const curDir = changeCurDir();
		if(curDir)
		mainWindow.webContents.send('update-cur-dir', curDir);
	})
		ipcMain.handle("electron-store-get", async(event, key) => {
		// @ts-ignore
		return store.get(key);
	})
	ipcMain.on("electron-store-set", (event, key, value) => {
		// @ts-ignore
		store.set(key, value);
	})


}