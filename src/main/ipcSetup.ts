import { app, dialog, ipcMain } from "electron";
import { changeCurDir, store, testData } from "./dataProcess";
import { mainWindow } from ".";
export function ipcSetup() {
	mainWindow.webContents.send('update-record-data', testData);
	ipcMain.on('request-update-record-data', () => {
    // ~~似乎同名还是会导致多次交错发送的问题…………现在发送两次才合理
	// !啊为什么现在还是爆…………
    mainWindow.webContents.send('update-record-data', testData);
	mainWindow.reload();
    console.log('index update-record-data', testData)
	})

	ipcMain.on('request-change-cur-dir', (event, arg) => {
		changeCurDir();
	})
		ipcMain.handle("electron-store-get", async(event, key) => {
		// ~~event.sender.send("electron-store-get-reply", store.get(key));
		// ~~event.reply
		// !虽然on的event.sender也可以返回但是渲染进程不会等待！
		// @ts-ignore
		return store.get(key);
	})
	ipcMain.on("electron-store-set", (event, key, value) => {
		// @ts-ignore
		store.set(key, value);
	})


}