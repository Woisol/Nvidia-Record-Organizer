import { ArrowBack, Construction } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { ChangeEvent, useState } from "react";
import SettingComponent from "./Setting-Component";

type setting = {
	curDir: string,
	displaySize: number,
	maxGroupGapSeconds: number,
	maxGroupCount: number,
	autoSort: boolean,
	autoRefresh: number
}

export default function Setting() {
	const [displaySize, setDisplaySize] = useState<number>(0);
	const [maxGroupGapSeconds, setMaxGroupGapSeconds] = useState<number | string>(0);
	const [maxGroupCount, setMaxGroupCount] = useState<number | string>(0);
	const [autoSort, setAutoSort] = useState<boolean>(false);
	const [autoRefresh, setAutoRefresh] = useState<number | string>(0);

	var settingDataGroup = {
		displaySize: displaySize,
		maxGroupGapSeconds: maxGroupGapSeconds,
		maxGroupCount: maxGroupCount,
		autoSort: autoSort,
		autoRefresh: autoRefresh,
	}
	type setting = {
		curDir: string,
		displaySize: number,
		maxGroupGapSeconds: number,
		maxGroupCount: number,
		autoSort: boolean,
		autoRefresh: number
	}

	window.electron.ipcRenderer.send("request-init-setting");
	window.electron.ipcRenderer.on("init-setting", (event, data: setting) => {
		setDisplaySize(data.displaySize);
		setMaxGroupGapSeconds(data.maxGroupGapSeconds);
		setMaxGroupCount(data.maxGroupCount);
		setAutoSort(data.autoSort);
		setAutoRefresh(data.autoRefresh);

		// handleDisplaySizeChange(data.displaySize);
		// !md调用这个直接交错循环………………vsc都卡死了哈哈关不掉…………
		// handleMaxGroupGapSecondsChange(data.maxGroupGapSeconds);
		// handleMaxGroupCountChange(data.maxGroupCount);
		// handleAutoSortChange(data.autoSort);
		// handleAutoRefreshChange(data.autoRefresh);
	})

	function handleDisplaySizeChange(size: number) {
		setDisplaySize(size);
		window.electron.ipcRenderer.send("request-change-display-size", size);
	}
	function handleMaxGroupGapSecondsChange(sec: string) {
		// ~~md别管我就是能实现…………
		// !如果还要加一个parseInt会导致输入卡顿
		// @ts-ignore
		// const sec = (target).value as number;
		setMaxGroupGapSeconds(sec);
		// if (!valid) return;
		// if (sec < 0) {
		// target.value = "0";
		// setMaxGroupGapSeconds(0);
		// return;
		// }
		// if (sec === "") {
		// 	// setErr(true);
		// 	setMaxGroupGapSecondsErr(true);
		// 	// !不知为何在外面设置就会导致奇怪的无法输入的问题…………即便确实已经先set了…………
		// 	// target.setAttribute("error", true)
		// 	// !这个也无法设置…………
		// 	return
		// }
		// // setErr(false);
		// setMaxGroupGapSecondsErr(false);
		window.electron.ipcRenderer.send("request-change-max-group-gap-seconds", sec);
	}
	function handleMaxGroupCountChange(count: string) {
		// const count = parseInt((target).value);
		// @ts-ignore
		setMaxGroupCount(count as number);
		// if (count === "") {
		// 	// (target).value = "1";
		// 	setMaxGroupCountErr(true);
		// 	return;
		// }
		window.electron.ipcRenderer.send("request-change-max-group-count", count);
	}
	function handleAutoSortChange(autoSort: boolean) {
		setAutoSort(autoSort);
		window.electron.ipcRenderer.send("request-change-auto-sort", autoSort);
	}
	function handleAutoRefreshChange(autoRefresh: string) {
		// const autoRefresh = parseInt((target).value);
		// @ts-ignore
		setAutoRefresh(autoRefresh);
		// if (autoRefresh === "") {
		// 	// (target).value = "0";
		// 	setAutoRefreshErr(true);
		// 	return;
		// }
		// setAutoRefreshErr(false);
		window.electron.ipcRenderer.send("request-change-auto-refresh", autoRefresh);
	}

	return (
		<div className="w-screen h-screen flex flex-col overflow-hidden">
			<div className="w-full h-14 rounded-b-2xl flex items-center bg-gray-300">
				<IconButton onClick={() => window.close()} size="large">
					<ArrowBack />
				</IconButton>
				<div className="dragZone w-full h-fit text-2xl">
					设置
				</div>
			</div>
			<div className="w-full h-full mt-2 p-4 flex flex-col gap-6">
				<SettingComponent type="slider" value={displaySize} setValue={handleDisplaySizeChange}
					title="展示图片/视频大小" subTitle="主页中图片/视频的展示大小" />
				<SettingComponent type="number" value={maxGroupGapSeconds} setValue={handleMaxGroupGapSecondsChange}
					title="组内最大间隔时间(s)" subTitle='规定在间隔多少秒以内视为一组，0为不分组' />
				<SettingComponent type="number" value={maxGroupCount} setValue={handleMaxGroupCountChange}
					title="最大回放组加载数" subTitle='加载过多回放组可能导致页面卡顿' />
				<SettingComponent type="switch" value={autoSort} setValue={handleAutoSortChange}
					title="自动排除已命名文件" subTitle='自动排除名称非标准Nvidia回放命名方式的文件' />
				<SettingComponent type="number" value={autoRefresh} setValue={handleAutoRefreshChange}
					title="自动刷新间隔(s)" subTitle='在主页自动刷新的时间间隔，设置为0取消' />
			</div>
		</div>
	)
}