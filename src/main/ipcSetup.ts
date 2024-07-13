import {  ipcMain } from "electron";
import { changeCurDir, store, testData } from "./dataProcess";
import { mainWindow } from ".";
export function ipcSetup() {
	mainWindow.webContents.send('update-record-data', testData);
	ipcMain.on('request-update-record-data', () => {
    mainWindow.webContents.send('update-record-data', testData);
    // console.log('index update-record-data', testData)
	})

	ipcMain.on('request-change-cur-dir', (event, arg) => {
		changeCurDir();
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