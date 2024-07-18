import { clipboard, ipcMain, Menu, MenuItem, shell } from "electron";
import { curDir } from "./dataProcess";
import { electron } from "process";
import { mainWindow } from ".";

export default function contextMenuSetup() {
	const curDirContextMenu = new Menu(),recordContextMenu = new Menu();
	var contextMenuTargetRecordName: string = "";
	ipcMain.on('contextmenu-cur-dir', (e, a) => {
		curDirContextMenu.popup({ window: mainWindow })
	})
	curDirContextMenu.append(new MenuItem(
		{
			label: "复制",
			click: () => {
				clipboard.writeText(curDir)
				// !似乎没有报错的callback
				mainWindow.webContents.send('contextmenu-cur-dir-copy-success')
			}
		}
	))
	curDirContextMenu.append(new MenuItem(
		{
			label: "在文件资源管理器中显示",
			click: () => {
				shell.openPath(curDir)
				// !注意这个shell是直接import而不是用window.electron.shell…………
			}
		}
	))

	ipcMain.on('contextmenu-record', (e, a) => {
		contextMenuTargetRecordName = a.name;
		recordContextMenu.popup({ window: mainWindow })
	})
	recordContextMenu.append(new MenuItem(
		{
			label: "复制回放路径",
			// toolTip: "复制回放路径到剪贴板",
			// !？？这个有什么用？
			click: (menuItem, browserWindow, e) => {
				clipboard.writeText(`${curDir}\\${contextMenuTargetRecordName}`)
			}
		}
	))
	recordContextMenu.append(new MenuItem(
		{
			label: "在文件资源管理器中显示",
			click: (menuItem, browserWindow, e) => {
				shell.showItemInFolder(`${curDir}\\${contextMenuTargetRecordName}`)
			}
		}
	))
	recordContextMenu.append(new MenuItem(
		{
			label: "在系统图片查看器中显示",
			click: (menuItem, browserWindow, e) => {
				shell.openPath(`${curDir}\\${contextMenuTargetRecordName}`)
			}
		}
	))
}