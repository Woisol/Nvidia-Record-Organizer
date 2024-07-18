import React, { useState } from "react";
import Record from "./Record"
import { Checkbox, FormControlLabel } from "@mui/material";
type recordData = {
	index: number,
	curDir: string,
	displaySize: number,
	handleDetailWinOpen: (e: HTMLImageElement, detailWinOpen: boolean) => void,
	recordData: {
		dateTitle: string,
		recordData: Array<{ name: string, checked: boolean }>
	},
	handleCleckBoxChecked: (name: string, checked: boolean) => void
	// !来自eslint的规范
}
export default function RecordsGroup({ index, curDir, displaySize, handleDetailWinOpen, recordData, handleCleckBoxChecked }: recordData) {
	// !额艹这个key是读不到的…………
	const [indeterminate, setIndeterminate] = useState(false)
	const [groupAllChecked, setGroupAllChecked] = useState(false)
	var thisRecordGroup = document.getElementById(`records-group-${index}`) as HTMLDivElement;
	function checkGroupAllChecked() {
		// for (let i = /0; i < thisRecordGroup?.children.length; i++) {
		var isAllChecked = true, isIndeterminate = false;
		if (!thisRecordGroup) thisRecordGroup = document.getElementById(`records-group-${index}`) as HTMLDivElement;
		// !这里在刷新时有概率会访问undefind
		for (const child of thisRecordGroup.children) {
			const checkbox = (child.children[2].children[0].children[0] as HTMLInputElement)
			if (checkbox.checked === true) {
				// if (!indeterminate)
				// setGroupAllChecked(true)
				isIndeterminate = true;
				console.log('group checkbox shell be indeterminate')
				// setGroupAllChecked(true);
			}
			else isAllChecked = false;
			if (isAllChecked && child === thisRecordGroup.lastElementChild) {
				isIndeterminate = false;
			}
		}
		// console.log('isIndeterminate:', isIndeterminate, 'isAllChecked:', isAllChecked)
		setGroupAllChecked(isAllChecked);
		setIndeterminate(isIndeterminate);
		// !md终于实现了…………注意MUI的这个indeterminate为真的时候需要check也为真才会显示…………
	}
	return (
		<>
			<div className="w-full h-fit mb-3 px-4 py-2 rounded-2xl bg-gray-100">
				<div className="w-1/3 border-b-2 border-gray-300 mb-2 flex">
					<FormControlLabel
						label={recordData.dateTitle}
						control={
							<Checkbox checked={groupAllChecked} indeterminate={indeterminate} onChange={e => {
								setGroupAllChecked(e.target.checked);
								// console.log(thisRecordGroup);
								if (!thisRecordGroup) thisRecordGroup = document.getElementById(`records-group-${index}`) as HTMLDivElement;
								for (let i = 0; i < thisRecordGroup.children.length; i++) {
									// for (const child of thisRecordGroup.children){
									const checkbox = (thisRecordGroup.children[i].children[2].children[0].children[0] as HTMLInputElement)
									if (checkbox.checked !== e.target.checked)
										setTimeout(() => {
											// !由于使用MUI而被迫绕路呜……必须要使用click()函数不然没有任何效果
											checkbox.click()
										}, i * 50)
								}
							}} size="small" />
						} />
					{/* <p className="pt-2">{recordData.dateTitle}</p> */}
				</div>
				<div id={`records-group-${index}`} className={`w-fit relative flex flex-wrap ${displaySize === 2 ? 'gap-4' : 'gap-3'}`}>
					{recordData.recordData.map((item, index) => (
						<Record key={index} index={index} curDir={curDir} displaySize={displaySize} handleDetailWinOpen={handleDetailWinOpen} checkGroupAllChecked={checkGroupAllChecked} RecordData={item} handleCleckBoxChecked={handleCleckBoxChecked} />
					))}
				</div>
			</div>
		</>

	)
}