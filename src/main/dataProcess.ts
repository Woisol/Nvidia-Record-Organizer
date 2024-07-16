import { app, dialog } from 'electron'
import path from 'path'
import { mainWindow } from '.'
import ElectronStore from 'electron-store'

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
	autoRefresh: number,
	renameScheme: string
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
var curDir: string,displaySize: number,maxGroupGapSeconds: number, maxGroupCount: number,autoSort: boolean,autoRefresh: number,renameScheme:string = "";

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
		const displaySize = store.get('renameScheme');
		// !艹被坑惨了………………不能只是!！要用===undefined！
		if (displaySize === undefined) {
			const defaultSetting:setting = {
				curDir:path.join(app.getPath('videos'),"Yuan Shen 原神"),
				displaySize: 1,
				maxGroupGapSeconds: 30,
				maxGroupCount: 10,
				autoSort: true,
				autoRefresh: 5,
				renameScheme:"{Game} {Date} {yyyy}-{MM}-{dd} {HH}:{mm}:{ss} {Message} ({index})"
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
	// @ts-ignore
	renameScheme = store.get('renameScheme');
	const initSetting :setting = {
		curDir:curDir,
		displaySize: displaySize,
		maxGroupGapSeconds: maxGroupCount,
		maxGroupCount: maxGroupCount,
		autoSort: autoSort,
		autoRefresh: autoRefresh,
		renameScheme:renameScheme
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
		autoRefresh: autoRefresh,
		renameScheme:renameScheme
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
function resolveTimeFromFileName(file: string):[hour:number, min:number, sec:number] {
	const hourRegex = /(?<=Screenshot \d{4}.\d{2}.\d{2} - )\d{2}(?=.\d{2}.\d{2}.\d{2}.png)/;
	const minRegex = /(?<=Screenshot \d{4}.\d{2}.\d{2} - \d{2}.)\d{2}(?=.\d{2}.\d{2}.png)/;
	const secondRegex = /(?<=Screenshot \d{4}.\d{2}.\d{2} - \d{2}.\d{2}.)\d{2}(?=.\d{2}.png)/;
	return [Number(file.match(hourRegex)?.[0]),Number(file.match(minRegex)?.[0]),Number(file.match(secondRegex)?.[0])]
}

const gameNameRegex = /^.*(?= Screenshot)/;
var game: string | undefined, testFileName: string;
export function searchRecordData(): recordData | null  {
	const fs = require('fs');
	const res = fs.readdirSync(curDir)
	res.sort();
	const recordRegex = /^.* Screenshot \d{4}.\d{2}.\d{2} - \d{2}.\d{2}.\d{2}.\d{2}.png$/;
	// const dayRegex = /(?<=Screenshot \d{4}.\d{2}.)\d{2}(?= - \d{2}.\d{2}.\d{2}.\d{2}.png)/;
	const files = res.filter((file, index) => file.endsWith('.png') && (!autoSort || recordRegex.test(file)));

	if (files.length === 0) {
		console.error("当前目录下没有找到回放文件");
		return [];
	}
	// const gameName = gameNameRegex.exec(files[0])?.[1];
	game = files[0].match(gameNameRegex)?.[0];
	testFileName = files[0];
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
	// lastHour = Number(files[0].match(hourRegex)?.[0]);
	// lastMin = Number(files[0].match(minRegex)?.[0]);
	// lastSecond = Number(files[0].match(secondRegex)?.[0]);
	[lastHour, lastMin, lastSecond] = resolveTimeFromFileName(files[0]);
	var lastTimeSeconds = lastHour * 3600 + lastMin * 60 + lastSecond;

	var curHour = 0, curMin = 0, curSecond = 0;
	// var foremostTimeSeconds:number = lastTimeSeconds;
	var recordData: recordData=[], fileIndex:number = 1, fileGroup: string[] = [files[0]];
	const maxMemberNum = 25;
	// !艹遇到性能问题了哈哈从一开始的100降到50到现在20动画才不会掉帧…………
	// !不对…………20也掉…………关键在于内存（）
	if (maxGroupGapSeconds == 0) {
		for (; fileIndex < files.length && fileIndex < maxMemberNum; fileIndex++) {
			fileGroup.push(files[fileIndex]);
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
			// curHour = Number(files[fileIndex].match(hourRegex)?.[0]);
			// curMin = Number(files[fileIndex].match(minRegex)?.[0]);
			// curSecond = Number(files[fileIndex].match(secondRegex)?.[0]);
			[curHour, curMin, curSecond] = resolveTimeFromFileName(files[fileIndex]);
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
//**----------------------------Rename Process-----------------------------------------------------
type renameInfo = {
	selectNum: number,
	maxGapSeconds: number,
	renameScheme: string,
	game: string,
	message: string,
	instance:string
}
function resolveDateFromFileName(file: string): [date: string, year: string, month: string, day: string] {
	const yearRegex = /(?<=Screenshot )\d{4}(?=.\d{2}.\d{2} - \d{2}.\d{2}.\d{2}.\d{2}.png)/;
	const monthRegex = /(?<=Screenshot \d{4}.)\d{2}(?=.\d{2} - \d{2}.\d{2}.\d{2}.\d{2}.png)/;
	const dayRegex = /(?<=Screenshot \d{4}.\d{2}.)\d{2}(?= - \d{2}.\d{2}.\d{2}.\d{2}.png)/;

	const year = file.match(yearRegex)?.[0];
	const month = file.match(monthRegex)?.[0];
	const day = file.match(dayRegex)?.[0];
	if(!year ||!month || !day)return ["", "", "", ""]
	const date = year + "." + month + "." + day;
	return [date, year, month, day];
}

function getMaxGapSeconds():number {
	var maxGapSeconds = 0;
	var lastHour = 0, lastMin = 0, lastSecond = 0;
	// lastDay = Number(files[0].match(dayRegex)?.[0]);
	// lastHour = Number(files[0].match(hourRegex)?.[0]);
	// lastMin = Number(files[0].match(minRegex)?.[0]);
	// lastSecond = Number(files[0].match(secondRegex)?.[0]);
	[lastHour, lastMin, lastSecond] = resolveTimeFromFileName(renamingRecord.length > 0 ? renamingRecord[0] : testFileName);
	// !？？？这里为什么会传入undefind的？？咳咳艹哈哈哈哈忘记重新编译了你…………
	var lastTimeSeconds = lastHour * 3600 + lastMin * 60 + lastSecond;

	var curHour = 0, curMin = 0, curSecond = 0;
	// var foremostTimeSeconds:number = lastTimeSeconds;
	// !艹遇到性能问题了哈哈从一开始的100降到50到现在20动画才不会掉帧…………
	// !不对…………20也掉…………关键在于内存（）
	for (const file of renamingRecord) {
		[curHour, curMin, curSecond] = resolveTimeFromFileName(file);
		var curTimeSeconds = curHour * 3600 + curMin * 60 + curSecond;
		if (curHour - lastHour === -23) lastTimeSeconds -= 86400;
		maxGapSeconds = Math.max(maxGapSeconds, Math.abs(curTimeSeconds - lastTimeSeconds));

		lastTimeSeconds = curTimeSeconds;
	}
	return maxGapSeconds;
}

// ~~似乎用不了…………用不了就算…………
// !虽然ts报错但是是可以用的！
// @ts-ignore
String.prototype.replaceVariable = function (variable: string, value: string) {
	const regex = new RegExp(`\{${variable}\}`,'gi');
	// const res = this.replace(regex, value);
	// console.log(res);
	return this.replace(regex, value);
}
function getRenamed(originName:string,renameScheme: string,game: string, message: string,index:number) {
	var date:string, year:string,month:string,day:string, hour: number, min: number, sec: number;
	[date, year, month, day] = resolveDateFromFileName(originName);
	[hour, min, sec] = resolveTimeFromFileName(originName);
	// !from FT:
	// !算了这个语法看不懂先不用先自己实现一个……
	// function replaceVariable( params: { [key: string]: string }) {
	// 	return renameScheme.replace(/{(\w+)}/gi, (match, key) => params[key] || match);
	// }
	// @ts-ignore
	var renamed = renameScheme.replaceVariable("date", date).replaceVariable("yyyy", year).replaceVariable("MM", month).replaceVariable("dd", day)
	.replaceVariable("HH", hour).replaceVariable("mm", min).replaceVariable("ss", sec).replaceVariable("game", game).replaceVariable("message", message).replaceVariable("index", index.toString());
	// function replaceVariables(variable: string[], value: string[]) {
	// 	for(let i = 0; i < variable.length; i++) {
	// 		console.log(renameScheme.replace(`/{${variable[i]}}/gi`, value[i]))
	// 		renameScheme = renameScheme.replace(`/{${variable[i]}}/gi`, value[i]);
	// 	}
	// 	return renameScheme
	// }
	// const res = replaceVariable({  ["date"] : date, ["yyyy"] : year, ["MM"] : month, ["dd"] : day, ["HH"] : hour.toString().padStart(2, "0"), ["mm"] : min.toString().padStart(2, "0"), ["ss"] : sec.toString().padStart(2, "0"), ["game"] : game as string, ["message"] : message , ["index"] : index.toString() });
	// !注意js里面String是值传递…………
	// return replaceVariables(["date", "yyyy", "MM", "dd", "HH", "mm", "ss", "game", "message", "index"], [date, year, month, day, hour.toString().padStart(2, "0"), min.toString().padStart(2, "0"), sec.toString().padStart(2, "0"), game as string, message, index.toString()]);
	return renamed;
}
export function getRenameInfo() {
	const renameInfo: renameInfo = {
		selectNum: renamingRecord.length,
		maxGapSeconds: getMaxGapSeconds(),
		renameScheme: renameScheme,
		game: (game as string),
		message:"",
		instance:getRenamed((renamingRecord.length > 0 ? renamingRecord[0] : testFileName), renameScheme, game as string, "",1)
	}
	return renameInfo;
}
export function updateRenamePreview(rScheme:string, game:string, message:string) {
	if (rScheme !== renameScheme) {
		// @ts-ignore
		store.set("renameScheme", rScheme);
		renameScheme = rScheme;
	}
	return getRenamed((renamingRecord.length > 0 ? renamingRecord[0] : testFileName), rScheme,game, message,1);
}

export function renameMainProcess(renameScheme: string, game: string, message: string) {
	// return new Promise<void>((resolve, reject) => {

	// })
}