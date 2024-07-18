import { app, dialog } from 'electron'
import path from 'path'
import { mainWindow } from '.'
import ElectronStore from 'electron-store'
import * as fs from 'fs';
import * as fsextra from 'fs-extra';
import { exec } from 'child_process';
import { NewReleases } from '@mui/icons-material';
// const fs= require('fs');
// !艹注意要导入时@types/node才能有补全…………而且要用import

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
export var curDir:string
var displaySize: number,maxGroupGapSeconds: number, maxGroupCount: number,autoSort: boolean,autoRefresh: number,renameScheme:string = "";

var renamingRecord: string[] = [];

function updateCurDir(newDir: string) {
	curDir = newDir;
	// @ts-ignore
	store.set('curDir', curDir);
	mainWindow.webContents.send('update-cur-dir', curDir);
	mainWindow.webContents.send('update-record-data', searchRecordData());
}
export function updateDisplaySize(size: number):number {
	displaySize = size;
	// @ts-ignore
	store.set('displaySize', displaySize);
	return displaySize;
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
	clearSelection();
	updateCurDir(res[0]);
	// @ts-ignore
	return store.get('curDir');
}

//**----------------------------Record Data-----------------------------------------------------
function resolveTimeFromFileName(file: string):[hour:number, min:number, sec:number] {
	const hourRegex = /(?<=Screenshot \d{4}.\d{2}.\d{2} - )\d{2}(?=.\d{2}.\d{2}.\d{2}.png)/;
	const minRegex = /(?<=Screenshot \d{4}.\d{2}.\d{2} - \d{2}.)\d{2}(?=.\d{2}.\d{2}.png)/;
	const secondRegex = /(?<=Screenshot \d{4}.\d{2}.\d{2} - \d{2}.\d{2}.)\d{2}(?=.\d{2}.png)/;
	// console.log(Number(file.match(hourRegex)?.[0]))
	// console.log(Number(file.match(minRegex)?.[0]))
	// console.log(Number(file.match(secondRegex)?.[0]))
	return [Number(file.match(hourRegex)?.[0]),Number(file.match(minRegex)?.[0]),Number(file.match(secondRegex)?.[0])]
}

const gameNameRegex = /^.*(?= Screenshot)/;
var game: string | undefined, testFileName: string;
export function searchRecordData(): recordData  {
	if (!fs.existsSync(curDir)) {
		console.error(`former store directory ${curDir} was deleted or failed to get $curDir`);
		// !注意加这个不然bug…………
		// !额加了似乎也无法加载…………不能是null…………
		return [];
	}
	const res = fs.readdirSync(curDir)
	res.sort();
	const recordRegex = /^.* Screenshot \d{4}.\d{2}.\d{2} - \d{2}.\d{2}.\d{2}.\d{2}.png$/;
	// const dayRegex = /(?<=Screenshot \d{4}.\d{2}.)\d{2}(?= - \d{2}.\d{2}.\d{2}.\d{2}.png)/;
	const files = res.filter((file, index) =>  (!autoSort || recordRegex.test(file)));//file.endsWith('.png') &&

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
	var newRenamingRecord: string[] = [];
	if (maxGroupGapSeconds == 0) {
		for (; fileIndex < files.length && fileIndex < maxMemberNum; fileIndex++) {
			fileGroup.push(files[fileIndex]);
		}
		recordData.push({
			dateTitle: "From " + formatDateTitle(fileGroup[0], lastHour,lastMin) + " [undivided]",
			recordData: fileGroup.map(file => {
				if (renamingRecord.includes(file)) {
					newRenamingRecord.push(file);
					return ({ name: file, checked: true })
				}
				else
					return ({ name: file, checked: false })
			})
		})
		// if (newRenamingRecord !== renamingRecord) {
			// !永远返回true，比较的只是数组对象的引用
		if(newRenamingRecord.length !== renamingRecord.length){
			console.log("Some records was select but now not exist any more!");
			renamingRecord = newRenamingRecord;
		}
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
					recordData: fileGroup.map(file => {
						if (renamingRecord.includes(file)) {
							newRenamingRecord.push(file);
							return ({ name: file, checked: true })
						}
						else
							return ({ name: file, checked: false })
					})
				})
				if(newRenamingRecord.length !== renamingRecord.length){
				console.log("Some records was select but now not exist any more!");
				renamingRecord = newRenamingRecord;
				}
				fileGroup = [files[fileIndex]];
			}
			lastTimeSeconds = curTimeSeconds;
			lastHour = curHour;
			lastMin = curMin;
		}
	}
	// console.log(recordData);
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
export function clearSelection() {
	renamingRecord = [];
	mainWindow.webContents.send('clear-selection');
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
	const regex = new RegExp(`\{${variable}\}`,'g');
	// !艹…………………………不能忽略大小写不然{MM}和{mm}就混淆啦！！！
	// const res = this.replace(regex, value);
	// console.log(res);
	return this.replace(regex, value);
}
function getRenamed(originName:string,renameScheme: string,game: string, message: string,indexIfRepeat:number) {
	var date:string, year:string,month:string,day:string, hour: number, min: number, sec: number;
	[date, year, month, day] = resolveDateFromFileName(originName);
	[hour, min, sec] = resolveTimeFromFileName(originName);
	// !from FT:
	// !算了这个语法看不懂先不用先自己实现一个……
	// function replaceVariable( params: { [key: string]: string }) {
	// 	return renameScheme.replace(/{(\w+)}/gi, (match, key) => params[key] || match);
	// !喔喔，FT：(match, key) => params[key] || match)箭头函数，指如果match中的字符串符合就hrig params[key]，不然就保留原来的match……
	// !还是有点难理解这种语法…………好好消化一下
	// }
	// @ts-ignor
	var renamed:string = renameScheme.replaceVariable("date", date).replaceVariable("yyyy", year).replaceVariable("MM", month).replaceVariable("dd", day)
	.replaceVariable("HH", hour.toString().padStart(2,"0")).replaceVariable("mm", min.toString().padStart(2,"0")).replaceVariable("ss", sec.toString().padStart(2,"0")).replaceVariable("game", game).replaceVariable("message", message);
	if (indexIfRepeat > 0) {
		// @ts-ignore
		var renamed:string = renamed.replaceVariable("indexIfRepeat", indexIfRepeat.toString())
	}
	else {
		renamed = renamed.replace(/ (?=[([{<,.（【{《，。@#$%&*]*\{indexIfRepeat\})/g, '');
		const regex = new RegExp(`\{indexIfRepeat\}`, 'g');
		var renamed:string = renamed.replaceAll(regex, "");
	}
	renamed += path.extname(originName);
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
		instance:getRenamed((renamingRecord.length > 0 ? renamingRecord[0] : testFileName), renameScheme, game as string, "",0)
	}
	return renameInfo;
}
export function updateRenamePreview(rScheme:string, game:string, message:string) {
	if (rScheme !== renameScheme) {
		// @ts-ignore
		store.set("renameScheme", rScheme);
		renameScheme = rScheme;
	}
	return getRenamed((renamingRecord.length > 0 ? renamingRecord[0] : testFileName), rScheme,game, message,0);
}

export function renameMainProcess(renameScheme: string, game: string, message: string) {
	return new Promise<void>((resolve, reject) => {
		if (renamingRecord.length === 0) {
			reject("已经进行过一次改名操作了！");
			return;
			// !注意依然需要return！
		}
		renamingRecord.sort();
		var indexIfRepeat = 0;
		for (const fileName of renamingRecord) {
			const oldPath = path.join(curDir,fileName);
			// const oldPath = path.resolve(`${curDir}\\\\${fileName}`);
			// const oldPath = `${curDir}\\${fileName}`;
			// !搞错…………resolve似乎不行咳咳resolve也不是用来规范的…………也是可以用来解析.和..，但是也可以转相对路径为绝对路径……，normalize是解析.和..用的…………
			if (fs.existsSync(oldPath)) {
				var newPath = `${curDir}\\${getRenamed(fileName, renameScheme, game, message, indexIfRepeat)}`;
				// !艹这个逻辑巨难艹
				if (fs.existsSync(newPath)) {
					// !这里new就是old（）
					if (indexIfRepeat === 0)
					fs.rename(newPath,`${curDir}\\${getRenamed(fileName, renameScheme, game, message, ++indexIfRepeat)}`,(err) => {
						if (err) { console.error('err in rename main process:', err); dialog.showErrorBox(`重命名失败${err.message}`, '可能是ts代码无法解决的系统问题，该问题在开发过程中稳定出现导致开发者头秃了一天。没有好的方法解决，请过了充足的一段时间以后再重试，或者更换其它更加成熟的软件。'); return; }
						mainWindow.webContents.send('update-record-data', searchRecordData());
						renamingRecord = [];
						resolve();
					})
					newPath = `${curDir}\\${getRenamed(fileName, renameScheme, game, message, ++indexIfRepeat)}`;
				}
				else {
					indexIfRepeat = 0;
					newPath = `${curDir}\\${getRenamed(fileName, renameScheme, game, message, indexIfRepeat)}`;
				}
				// console.log("oldPath:", oldPath);
				// const newPath = path.join(curDir,getRenamed(fileName, renameScheme, game, message, renamingRecord.indexOf(fileName) + 1)).replaceAll('\\', '/');
				// fs.readFileSync(oldPath);
				// fs.writeFileSync('D:/Code/FrontEnd/Mixed Projects/Nvidia Record Organizer/TestFile/test.txt', 'abc');
				fs.rename(oldPath, newPath, (err) => {
					if (err) { console.error('err in rename main process:', err); dialog.showErrorBox(`重命名失败${err.message}`, '可能是ts代码无法解决的系统问题，该问题在开发过程中稳定出现导致开发者头秃了一天。没有好的方法解决，请过了充足的一段时间以后再重试，或者更换其它更加成熟的软件。'); return; }
					mainWindow.webContents.send('update-record-data', searchRecordData());
					renamingRecord = [];
					resolve();
				})
				// fs.rename(oldPath, "./Minecraft Screenshot  NaN::NaN  (1).txt", (err) => { console.error('err in rename main process:',err); })
				// !排除变量传参的问题
				// fs.rename('D:\\Code\\FrontEnd\\Mixed Projects\\Nvidia Record Organizer\\TestFile\\Minecraft Screenshot 2024.07.15 - 22.08.55.03.png', 'D:\\Code\\FrontEnd\\Mixed Projects\\Nvidia Record Organizer\\TestFile\\Minecraft Screenshot 2024.07.15 22:07:55 10班联机 (9).png', (err) => { console.error('err in rename main process:',err); })
				// fs.rename('D:\\Minecraft Screenshot 2024.07.15 - 21.13.33.60.png', 'D:\\Minecraft Screenshot 2024.07.15 Test.png', (err) => { console.error('err in rename main process:',err); })
				// fs.rename("D:/Code/FrontEnd/Mixed Projects/Nvidia Record Organizer/TestFile/Minecraft Screenshot 2024.07.15 - 21.13.33.60.png", "D:/Code/FrontEnd/Mixed Projects/Nvidia Record Organizer/TestFile/Test.png", (err) => { console.error('err in rename main process:',err); })
				// fs.renameSync('D:\\Code\\FrontEnd\\Mixed Projects\\Nvidia Record Organizer\\TestFile\\test.txt','D:\\Code\\FrontEnd\\Mixed Projects\\Nvidia Record Organizer\\TestFile\\test1.txt')
				// fs.renameSync("D:\\Videos\\Test\\test.txt", "D:\\Videos\\Test\\test1.txt");
				// !经实测\\和/都是可以的！
				// fs.renameSync(fileName,getRenamed(fileName, renameScheme, game, message, renamingRecord.indexOf(fileName) + 1));
				// !…………加了个file:\/\/就变成D:\Code\FrontEnd\Mixed Projects\Nvidia Record Organizer\file:\D:\...了…………
				// !改了一堆路径格式都无效…………用了\,\\,\\\\,/但是其实最后报错输出的格式都是\，估计并不是path格式的问题

				// fsextra.move(oldPath, newPath, { overwrite: true }, (err) => {
				// 	if (err) {
				// 		console.error('err in rename main process:', err);
				// 		reject(err);
				// 	}
				// })

				// exec(`move "${oldPath}" "${newPath}"`, (err, stdout, stderr) => {
				// 	console.log(`move "${oldPath}" "${newPath}"`);
				// 	if (err) {
				// 		console.error('err in rename main process:', err);
				// 		reject(err);
				// 	}
				// });

				// fs.copyFile(oldPath, newPath, (err) => {
				// 	if (err) {
				// 		console.error('err in rename main process:', err);
				// 		reject(err);
				// 	}
				// 	else
				// 		fs.unlink(oldPath, (err) => {
				// 			if (err) {
				// 				console.error('err in rename main process:', err);
				// 				reject(err);
				// 			}
				// 		});
				// })
				// ~~基本定位问题…………命名不能太长…………一长就废……

				/**
				 * 鬼知道这个fs.rename搞了多久？？所以现在是为什么又可以跑起来了也搞不清楚啊啊啊啊啊啊
				 * 开始的时候fs.rename一直报错找不到路径，期间换了\\, \\\\, /都是找不到路径
				 * 后来发现不论上面三者哪个，报错的输出都是\\，因此基本排除是这个的问题
				 * 后来因为尝试把oldPath和newPath换成常量目录发现得了，以为是不能用变量，但是尝试直接把二者的运行时值放进去也不行……
				 * 考虑使用fsextra的move也不行
				 * 再后来因为考虑到fs大概也是使用windows的cmd，所以尝试exec('move ...')依然不可行
				 * 尝试在cmd环境下发现也不行
				 * 此时才发现只有在所改的名字较短时才能修改成功
				 * 于是尝试改名方案只剩下游戏，改名成功……此时是第一次成功改名
				 * 同时似乎是在此前后发现gerRenamed的返回值没有拓展名，于是在函数体内加上
				 * 然后惊讶地发现这个困扰了2天的问题居然解决了？？？？？？？？？
				 * 最气人的是现在使用vsc的历史记录恢复了做完24点的文件，然后发现又能命名了？？？
				 */
			}
			else {
				console.error('attempt to rename non-existent file');
			}
		}
	})
}