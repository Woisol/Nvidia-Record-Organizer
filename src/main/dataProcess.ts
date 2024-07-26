import { app, dialog } from 'electron'
import path from 'path'
import { mainWindow } from '.'
import ElectronStore from 'electron-store'
import * as fs from 'fs';
import sharp from 'sharp';
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

export var store: ElectronStore;
export var curDir: string, thumbnailDir: string =path.join( app.getPath('temp'), 'NvidiaRecordOrganizer');
if(!fs.existsSync(thumbnailDir))fs.mkdir(thumbnailDir,(err)=>{if(err)console.error("unabled to create ThumbnailDir!")});
var displaySize: number,maxGroupGapSeconds: number, maxGroupCount: number,autoSort: boolean,autoRefresh: number,renameScheme:string = "";
var renamingRecord: string[] = [];

function updateCurDir(newDir: string) {
	curDir = newDir;
	// @ts-ignore
	store.set('curDir', curDir);
	mainWindow.webContents.send('update-cur-dir', curDir);
	updateRecordData();
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
	autoRefreshSetup();
}

// **配置默认设置
export function initDefaultSetting() {
	import('electron-store').then(res => {
		// @ts-ignore
		store  = new res.default();
		// @ts-ignore
		const displaySize = store.get('displaySize');
		if (displaySize === undefined) {
			const defaultSetting:setting = {
				curDir:path.join(app.getPath('videos'),"Yuan Shen 原神"),
				displaySize: 1,
				maxGroupGapSeconds: 120,
				maxGroupCount: 30,
				autoSort: true,
				autoRefresh: 1,
				renameScheme:"{game} {date} {yyyy}-{MM}-{dd} {HH}.{mm}.{ss} {message} {indexIfRepeat}"
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
	// td似乎是无用send，整合掉……
	mainWindow.webContents.send('update-cur-dir', curDir);
	mainWindow.webContents.send('init-setting', initSetting);

	updateRecordData();
	autoRefreshSetup();
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

var autoRefreshInterval: NodeJS.Timeout | undefined;
function autoRefreshSetup() {
	if (autoRefreshInterval) {
		clearInterval(autoRefreshInterval);
		autoRefreshInterval = undefined
	}
	if (autoRefresh > 0) {
		autoRefreshInterval = setInterval(() => {
			updateRecordData();
		}, autoRefresh * 1000);
	}
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
export function updateRecordData() {
	searchRecordData().then(data => {mainWindow.webContents.send('update-record-data', data)})
	// td额其实完全可以直接和searchRecordData()合并…………
}
async function searchRecordData() :Promise<recordData> {
	if (!fs.existsSync(curDir)) {
		console.error(`former store directory ${curDir} was deleted or failed to get $curDir`);
		return Promise.resolve([]);
	}
	const res = fs.readdirSync(curDir)
	res.sort();
	const recordRegex = /^.* Screenshot \d{4}.\d{2}.\d{2} - \d{2}.\d{2}.\d{2}.\d{2,3}.png$/;
	// const dayRegex = /(?<=Screenshot \d{4}.\d{2}.)\d{2}(?= - \d{2}.\d{2}.\d{2}.\d{2}.png)/;
	const files = res.filter((file) =>  (!autoSort || recordRegex.test(file)));

	if (files.length === 0) {
		console.error("当前目录下没有找到回放文件");
		return Promise.resolve([]);
	}

	game = files[0].match(gameNameRegex)?.[0];
	// gameNameRegex.exec(files[0])?.[1];
	testFileName = files[0];
	if (!game) { console.error("无法获取游戏名称"); }

	function formatDateTitle(fileName: string, lastHour: number, lastMin: number) {
		// @ts-ignor
		const date = fileName.match(/(?<=Screenshot )\d{4}.\d{2}.\d{2} (?=- \d{2}.\d{2}.\d{2}.\d{2}.png)/)?.[0] as string;
			return date + lastHour.toString().padStart(2, "0") + ":" + lastMin.toString().padStart(2, "0");
	}

	var lastHour = 0, lastMin = 0, lastSecond = 0;
	[lastHour, lastMin, lastSecond] = resolveTimeFromFileName(files[0]);
	var lastTimeSeconds = lastHour * 3600 + lastMin * 60 + lastSecond;

	var curHour = 0, curMin = 0, curSecond = 0;
	var recordData: recordData=[], fileIndex:number = 1, fileGroup: string[] = [files[0]];
	const maxMemberNum = 25;
	var newRenamingRecord: string[] = [];
	var totalRecordNum = 1;
	if (maxGroupGapSeconds == 0) {
		for (; fileIndex < files.length && fileIndex < maxMemberNum; fileIndex++) {
			totalRecordNum++;
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
		if(newRenamingRecord.length !== renamingRecord.length){
			renamingRecord = newRenamingRecord;
		}
	}
	else {
		for (let i = 0; i < maxGroupCount && fileIndex < files.length;fileIndex++) {
			[curHour, curMin, curSecond] = resolveTimeFromFileName(files[fileIndex]);
			var curTimeSeconds = curHour * 3600 + curMin * 60 + curSecond;
			if(curHour - lastHour === -23) lastTimeSeconds -= 86400;

			if (Math.abs(curTimeSeconds - lastTimeSeconds) < maxGroupGapSeconds) {
				totalRecordNum++;
				fileGroup.push(files[fileIndex]);
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
				totalRecordNum++;
				fileGroup = [files[fileIndex]];
			}
			lastTimeSeconds = curTimeSeconds;
			lastHour = curHour;
			lastMin = curMin;
		}
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
	}
	//**----------------------------Thumbnail Generation-----------------------------------------------------
	let thumbnailHeight = 300,thumbnailWidth;
	var thumbnailGenTasks = files.slice(0, totalRecordNum).map((file) => {
		var thumbnailSharp: sharp.Sharp = sharp(path.join(curDir, file))
			thumbnailSharp.metadata().then((metadata) => {
			if (metadata.width === undefined || metadata.height === undefined) { console.error('sharp was unabled to get width or height of src file'); return; }
			thumbnailWidth = Math.floor(metadata.width / metadata.height * thumbnailHeight);
		})
		thumbnailSharp.resize(thumbnailWidth, thumbnailHeight);
		const newThumbnailDir = path.join(thumbnailDir, file.replace(".png", "_thumbnail.jpg"));
		if(!fs.existsSync(newThumbnailDir))
			return thumbnailSharp.toFile(newThumbnailDir);
		return ;
	})
	return Promise.all(thumbnailGenTasks).then(_res=> recordData)
}
export function updateRenamineRecord(name: string, add: boolean ){
	if (add) {
		if (!renamingRecord.includes(name)) {
			renamingRecord.push(name);
		}
		else {
			console.error("attempt to add existing record");
		}
	}
	else {
		if (renamingRecord.includes(name)) {
			renamingRecord.splice(renamingRecord.indexOf(name), 1);
		}
		else {
			console.error("attempt to remove non-existent record");
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
	[lastHour, lastMin, lastSecond] = resolveTimeFromFileName(renamingRecord.length > 0 ? renamingRecord[0] : testFileName);
	var lastTimeSeconds = lastHour * 3600 + lastMin * 60 + lastSecond;

	var curHour = 0, curMin = 0, curSecond = 0;
	for (const file of renamingRecord) {
		[curHour, curMin, curSecond] = resolveTimeFromFileName(file);
		var curTimeSeconds = curHour * 3600 + curMin * 60 + curSecond;
		if (curHour - lastHour === -23) lastTimeSeconds -= 86400;
		maxGapSeconds = Math.max(maxGapSeconds, Math.abs(curTimeSeconds - lastTimeSeconds));

		lastTimeSeconds = curTimeSeconds;
	}
	return maxGapSeconds;
}

// @ts-ignore
String.prototype.replaceVariable = function (variable: string, value: string) {
	const regex = new RegExp(`\{${variable}\}`,'g');
	return this.replace(regex, value);
}
function getRenamed(originName:string,renameScheme: string,game: string, message: string,indexIfRepeat:number) {
	var date:string, year:string,month:string,day:string, hour: number, min: number, sec: number;
	[date, year, month, day] = resolveDateFromFileName(originName);
	[hour, min, sec] = resolveTimeFromFileName(originName);
	// @ts-ignore
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
		}
		renamingRecord.sort();
		var indexIfRepeat = 0;
		for (const fileName of renamingRecord) {
			const oldPath = path.join(curDir,fileName);
			if (fs.existsSync(oldPath)) {
				var newPath = `${curDir}\\${getRenamed(fileName, renameScheme, game, message, indexIfRepeat)}`;
				if (fs.existsSync(newPath)) {
					if (indexIfRepeat === 0)
					fs.rename(newPath,`${curDir}\\${getRenamed(fileName, renameScheme, game, message, ++indexIfRepeat)}`,(err) => {
						if (err) { console.error('err in rename main process:', err); dialog.showErrorBox(`重命名失败${err.message}`, '可能是ts代码无法解决的系统问题，该问题在开发过程中稳定出现导致开发者头秃了一天。没有好的方法解决，请过了充足的一段时间以后再重试，或者更换其它更加成熟的软件。'); return; }
						updateRecordData();
						renamingRecord = [];
						resolve();
					})
					newPath = `${curDir}\\${getRenamed(fileName, renameScheme, game, message, ++indexIfRepeat)}`;
				}
				else {
					indexIfRepeat = 0;
					newPath = `${curDir}\\${getRenamed(fileName, renameScheme, game, message, indexIfRepeat)}`;
				}
				fs.rename(oldPath, newPath, (err) => {
					if (err) { console.error('err in rename main process:', err); dialog.showErrorBox(`重命名失败${err.message}`, '可能是ts代码无法解决的系统问题，该问题在开发过程中稳定出现导致开发者头秃了一天。没有好的方法解决，请过了充足的一段时间以后再重试，或者更换其它更加成熟的软件。'); return; }
					updateRecordData();
					renamingRecord = [];
					resolve();
				})
			}
			else {
				console.error('attempt to rename non-existent file');
			}
		}
	})
}