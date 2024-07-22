import { useState } from "react";
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
	handleCleckBoxChecked: (name: string, checked: boolean) => void,
	thumbnailDir: string
}
export default function RecordsGroup({ index, curDir, displaySize, handleDetailWinOpen, recordData, handleCleckBoxChecked, thumbnailDir }: recordData) {
	const [indeterminate, setIndeterminate] = useState(false)
	const [groupAllChecked, setGroupAllChecked] = useState(false)
	var isAllChecked = true, isIndeterminate = false;
	recordData.recordData.forEach((data, index) => {
		if (data.checked === true) {
			isIndeterminate = true;
			console.log('group checkbox shell be indeterminate')
		}
		else isAllChecked = false;
		if (isAllChecked && index === recordData.recordData.length - 1) {
			isIndeterminate = false;
		}
	})

	if (groupAllChecked !== isAllChecked || indeterminate !== isIndeterminate) {
		setGroupAllChecked(isAllChecked);
		setIndeterminate(isIndeterminate);
		return;
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
								const thisRecordGroup = document.getElementById(`records-group-${index}`) as HTMLDivElement;
								for (let i = 0; i < thisRecordGroup.children.length; i++) {
									// for (const child of thisRecordGroup.children){
									const checkbox = (thisRecordGroup.children[i].children[0].children[2].children[0].children[0] as HTMLInputElement)
									if (checkbox.checked !== e.target.checked)
										setTimeout(() => {
											checkbox.click()
										}, i * 10)
								}
								// td考虑优化逻辑，使用修改state的方式来实现
							}} size="small" />
						} />
				</div>
				<div id={`records-group-${index}`} className={`w-fit relative flex flex-wrap ${displaySize === 2 ? 'gap-4' : 'gap-3'}`}>
					{recordData.recordData.map((item, index) => (
						<Record key={index} index={index} curDir={curDir} displaySize={displaySize} handleDetailWinOpen={handleDetailWinOpen} RecordData={item} handleCleckBoxChecked={handleCleckBoxChecked} thumbnailDir={thumbnailDir} />
					))}
				</div>
			</div>
		</>
	)
}