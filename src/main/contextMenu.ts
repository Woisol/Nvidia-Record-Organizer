import { clipboard, ipcMain, Menu, MenuItem, shell } from "electron";
import { curDir } from "./dataProcess";
import { mainWindow } from ".";

export default function contextMenuSetup() {
	const curDirContextMenu = new Menu(),recordContextMenu = new Menu();
	var contextMenuTargetRecordName: string = "";
	ipcMain.on('contextmenu-cur-dir', () => {
		curDirContextMenu.popup({ window: mainWindow })
	})
	curDirContextMenu.append(new MenuItem(
		{
			label: "复制",
			click: () => {
				clipboard.writeText(curDir)
				mainWindow.webContents.send('contextmenu-cur-dir-copy-success')
			}
		}
	))
	curDirContextMenu.append(new MenuItem(
		{
			label: "在文件资源管理器中显示",
			click: () => {
				shell.openPath(curDir)
			}
		}
	))

	ipcMain.on('contextmenu-record', (_e, a) => {
		contextMenuTargetRecordName = a.name;
		recordContextMenu.popup({ window: mainWindow })
	})
	recordContextMenu.append(new MenuItem(
		{
			label: "复制回放路径",
			click: () => {
				clipboard.writeText(`${curDir}\\${contextMenuTargetRecordName}`)
			}
		}
	))
	recordContextMenu.append(new MenuItem(
		{
			label: "在文件资源管理器中显示",
			click: () => {
				shell.showItemInFolder(`${curDir}\\${contextMenuTargetRecordName}`)
			}
		}
	))
	recordContextMenu.append(new MenuItem(
		{
			label: "在系统图片查看器中显示",
			click: () => {
				shell.openPath(`${curDir}\\${contextMenuTargetRecordName}`)
			}
		}
	))
}