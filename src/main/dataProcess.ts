import { app, dialog } from 'electron'
import path from 'path'
import { mainWindow } from '.'
import ElectronStore from 'electron-store'
import { ConstructionTwoTone, ContactSupportOutlined, Flight, FormatOverline } from '@mui/icons-material'
import { i } from 'vite/dist/node/types.d-aGj9QkWt'

// !咳咳好像type不能export…………
type recordGroupData =
	{
		dateTitle: string,
		recordData: Array<{ name: string, checked: boolean }>
	}
type recordData = Array<recordGroupData>

type setting = {
	curDir: string,
	displaySize: number,
	maxGroupGapSeconds: number,
	maxGroupCount: number,
	autoSort: boolean,
	autoRefresh: number
}

// export const testData: recordData = [
// 	{
// 		dateTitle: "2024.07.11 13:04",
// 		recordData: [
// 			{ name: "Yuan Shen 原神 23.06.19 - 08.03生日礼物.png", checked: false },
// 			{ name: "Yuan Shen 原神  2023.07.05 ？？？卡出了奇怪的界面.png", checked: false },
// 			{ name: 'Yuan Shen 原神 23.06.19 - 13.27温迪传说.png', checked: false },
// 			{ name: 'Yuan Shen 原神 23.06.19 - 15.34公子传说.png', checked: false },
// 			{ name: 'Yuan Shen 原神 23.06.19 - 16.26公子传说.png', checked: false },
// 			{ name: 'Yuan Shen 原神 Screenshot 2023.07.06 花神诞祭 (61).png', checked: false },

// 		]
// 	},
// 	{
// 		dateTitle: "2024.07.12 22:00",
// 		recordData: [
// 			{ name: "Yuan Shen 原神 23.06.20 - 08.39七圣召唤.png", checked: false },
// 			{ name: 'Yuan Shen 原神 23.06.26 - 08.24钟离传说 (2).png', checked: false },
// 			{ name: 'Yuan Shen 原神 Screenshot 2023.07.05 须弥主线前段 (20).png', checked: false },

// 		]
// 	},
// 	{
// 		dateTitle: "2024.07.13 00:00",
// 		recordData: [
// 			{ name: "Yuan Shen 原神 Screenshot 2023.07.09 - 16.19.09.87.png", checked: false },
// 			{ name: 'Yuan Shen 原神 23.06.26 - 11.43钟离传说 (3).png', checked: false },
// 			{ name: 'Yuan Shen 原神 23.06.26 - 18.50甘雨传说.png', checked: false },
// 			{ name: 'Yuan Shen 原神 2023.07.05 1.jpg', checked: false },

// 		]
// 	},
// ]

export var store: ElectronStore;
// !虽然可以export但是export出来的并没有定义…………所以还是在里面搞吧
var curDir: string,displaySize: number,maxGroupGapSeconds: number, maxGroupCount: number,autoSort: boolean,autoRefresh: number;

var renamingRecord: string[] = [];

function updateCurDir(newDir: string) {
	curDir = newDir;
	// @ts-ignore
	store.set('curDir', curDir);
	mainWindow.webContents.send('update-cur-dir', curDir);
	mainWindow.webContents.send('update-record-data', searchRecordData());
}
export function updateDisplaySize(size: number) {
	displaySize = size;
	// @ts-ignore
	store.set('displaySize', displaySize);
	mainWindow.webContents.send('update-display-size', displaySize);
}
export function updateMaxGroupGapSeconds(sec: number) {
	maxGroupGapSeconds = sec;
	// @ts-ignore
	store.set('maxGroupGapSeconds', maxGroupGapSeconds);
}
export function updateMaxGoupCount(count: number) {
	maxGroupCount = count;
	// @ts-ignore
	store.set('maxGroupCount', maxGroupCount);
}
export function updateAutoSort(value: boolean) {
	autoSort = value;
	// @ts-ignore
	store.set('autoSort', autoSort);
}
export function updateAutoRefresh(value: number) {
	autoRefresh = value;
	// @ts-ignore
	store.set('autoRefresh', autoRefresh);
}

// **配置默认设置
export function initDefaultSetting() {
	import('electron-store').then(res => {
		// @ts-ignore
		store  = new res.default()// as ElectronStore<setting<string,any>> ;
		// @ts-ignore
		const displaySize = store.get('maxGroupGapSeconds');
		// !艹被坑惨了………………不能只是!！要用===undefined！
		if (displaySize === undefined) {
			const defaultSetting:setting = {
				curDir:path.join(app.getPath('videos'),"Yuan Shen 原神"),
				displaySize: 1,
				maxGroupGapSeconds: 30,
				maxGroupCount: 10,
				autoSort: true,
				autoRefresh: 5
			}
			// @ts-ignore
			store.set(defaultSetting);
		}
	})
}

export function initSetting() {
	// @ts-ignore
	curDir = store.get('curDir');
	// @ts-ignore
	displaySize = store.get('displaySize');
	// @ts-ignore
	maxGroupGapSeconds = store.get('maxGroupGapSeconds');
	// !哦哦哦哦！！是前面这个变量没有定义而不是读不出来…………该死的ts-ignore…………
	// @ts-ignore
	maxGroupCount = store.get('maxGroupCount');
	// @ts-ignore
	autoSort = store.get('autoSort');
	// @ts-ignore
	autoRefresh = store.get('autoRefresh');
	const initSetting :setting = {
		curDir:curDir,
		displaySize: displaySize,
		maxGroupGapSeconds: maxGroupCount,
		maxGroupCount: maxGroupCount,
		autoSort: autoSort,
		autoRefresh: autoRefresh
	}
	console.log("initSetting", initSetting)
	// td整合掉……
	mainWindow.webContents.send('update-cur-dir', curDir);
	mainWindow.webContents.send('init-setting', initSetting);

	const initData  = searchRecordData();
	mainWindow.webContents.send('update-record-data', initData);
}
export function getSetting() :setting{
	const curSetting: setting = {
		curDir: curDir,
		displaySize: displaySize,
		maxGroupGapSeconds: maxGroupGapSeconds,
		maxGroupCount: maxGroupCount,
		autoSort: autoSort,
		autoRefresh: autoRefresh
	}
	return curSetting;
}

export function changeCurDir():string | undefined {
	const res = dialog.showOpenDialogSync(mainWindow, { buttonLabel: '选择文件夹', properties: ["openDirectory"], defaultPath: app.getPath("videos"), message: "请选择需要整理回放的目录。" })
	if (!res) return;
	renamingRecord = [];
	updateCurDir(res[0]);
	// @ts-ignore
	return store.get('curDir');
}

//**----------------------------Record Data-----------------------------------------------------
export function searchRecordData(): recordData | null  {
	const fs = require('fs');
	const res = fs.readdirSync(curDir)
	res.sort();
	const recordRegex = /^.* Screenshot \d{4}.\d{2}.\d{2} - \d{2}.\d{2}.\d{2}.\d{2}.png$/;
	const gameNameRegex = /^.*(?= Screenshot)/;
	// const dayRegex = /(?<=Screenshot \d{4}.\d{2}.)\d{2}(?= - \d{2}.\d{2}.\d{2}.\d{2}.png)/;
	const hourRegex = /(?<=Screenshot \d{4}.\d{2}.\d{2} - )\d{2}(?=.\d{2}.\d{2}.\d{2}.png)/;
	const minRegex = /(?<=Screenshot \d{4}.\d{2}.\d{2} - \d{2}.)\d{2}(?=.\d{2}.\d{2}.png)/;
	const secondRegex = /(?<=Screenshot \d{4}.\d{2}.\d{2} - \d{2}.\d{2}.)\d{2}(?=.\d{2}.png)/;
	const files = res.filter((file, index) => file.endsWith('.png') && (!autoSort || recordRegex.test(file)));

	if (files.length === 0) {
		console.error("当前目录下没有找到回放文件");
		return [];
	}
	// const gameName = gameNameRegex.exec(files[0])?.[1];
	const game = files[0].match(gameNameRegex)?.[0];
	// !额区分………………exec返回匹配项以外的更多信息，而且用来调用的对象不同
	if (!game) { console.error("无法获取游戏名称"); }

	function formatDateTitle(fileName: string, lastHour: number, lastMin: number) {
		// @ts-ignor
		const date = fileName.match(/(?<=Screenshot )\d{4}.\d{2}.\d{2} (?=- \d{2}.\d{2}.\d{2}.\d{2}.png)/)?.[0] as string;
		// !这里消除报错怎么这么难…………
		// if(lastTime.getMinutes() === curTime.getMinutes())
			return date + lastHour.toString().padStart(2, "0") + ":" + lastMin.toString().padStart(2, "0");
		// else {
		// 	return date + lastTime.getHours() + ":" + lastTime.getMinutes() + " - " + curTime.getHours() + ":" + curTime.getMinutes();
		// }

	}

	var lastHour = 0, lastMin = 0, lastSecond = 0;
	// lastDay = Number(files[0].match(dayRegex)?.[0]);
	lastHour = Number(files[0].match(hourRegex)?.[0]);
	lastMin = Number(files[0].match(minRegex)?.[0]);
	lastSecond = Number(files[0].match(secondRegex)?.[0]);
	var lastTimeSeconds = lastHour * 3600 + lastMin * 60 + lastSecond;

	var curHour = 0, curMin = 0, curSecond = 0;
	// var foremostTimeSeconds:number = lastTimeSeconds;
	var recordData: recordData=[], fileIndex:number = 1, fileGroup: string[] = [files[0]];
	const maxMemberNum = 25;
	// !艹遇到性能问题了哈哈从一开始的100降到50到现在20动画才不会掉帧…………
	// !不对…………20也掉…………关键在于内存（）
	if (maxGroupGapSeconds == 0) {
		for (; fileIndex < files.length && fileIndex < maxMemberNum; fileIndex++) {
			fileGroup .push(files[fileIndex]);
		}
		recordData.push({
			dateTitle: "From " + formatDateTitle(fileGroup[0], lastHour,lastMin) + " [undivided]",
			recordData: fileGroup.map(file => ({ name: file, checked: false }))
		})
	}
	else {
		for (let i = 0; i < maxGroupCount && fileIndex < files.length;fileIndex++) {
			// !嗯这里不需要…………只要不太集中不会卡的……&& fileIndex < maxMemberNum * 2
			// curDay = Number(files[fileIndex].match(dayRegex)?.[0]);
			curHour = Number(files[fileIndex].match(hourRegex)?.[0]);
			curMin = Number(files[fileIndex].match(minRegex)?.[0]);
			curSecond = Number(files[fileIndex].match(secondRegex)?.[0]);
			var curTimeSeconds = curHour * 3600 + curMin * 60 + curSecond;
			if(curHour - lastHour === -23) lastTimeSeconds -= 86400;
			// !不想用Date了，绕路！……

			if (Math.abs(curTimeSeconds - lastTimeSeconds) < maxGroupGapSeconds) {
				fileGroup.push(files[fileIndex]);
				// foremostTimeSeconds = curTimeSeconds;
			}
			else {
				i++;
				recordData.push({
					dateTitle: formatDateTitle(fileGroup[0], lastHour,lastMin),
					recordData: fileGroup.map(file => ({ name: file, checked: false }))
				})
				fileGroup = [files[fileIndex]];
			}
			lastTimeSeconds = curTimeSeconds;
			lastHour = curHour;
			lastMin = curMin;
		}
	}
	console.log(recordData);
	return recordData;
	// })
}
export function updateRenamineRecord(name: string, add: boolean ){
	if (add) {
		if (!renamingRecord.includes(name)) {
			renamingRecord.push(name);
		}
		else {
			console.error("updateRenamineRecord(): attempt to add existing record");
		}
	}
	else {
		if (renamingRecord.includes(name)) {
			renamingRecord.splice(renamingRecord.indexOf(name), 1);
		}
		else {
			console.error("updateRenamineRecord(): attempt to remove non-existent record");
		}
	}
	console.log("renamingRecord:", renamingRecord);
}