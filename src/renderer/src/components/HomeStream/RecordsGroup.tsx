import React from "react";
import Record from "./Record"
import { Checkbox } from "@mui/material";
type recordData = {
	key: number,
	curDir: string,
	displaySize: number,
	handleDetailWinOpen: (e: HTMLImageElement, detailWinOpen: boolean) => void,
	recordData: {
		dateTitle: string,
		recordData: Array<{ name: string, checked: boolean }>
	},
	setRecordData: (value: recordData["recordData"]) => void
	// !来自eslint的规范
}
export default function RecordsGroup({ key, curDir, displaySize, handleDetailWinOpen, recordData, setRecordData }: recordData) {
	return (
		<>
			<div className="w-full h-fit mb-3 px-4 py-2 rounded-2xl bg-gray-100">
				<div className="w-1/3 border-b-2 border-gray-300 mb-2 flex">
					<Checkbox size="small" />
					<p className="pt-2">{recordData.dateTitle}</p>
				</div>
				<div className="w-fit relative flex flex-wrap gap-3">
					{recordData.recordData.map((item, index) => (
						<Record key={index} curDir={curDir} displaySize={displaySize} handleDetailWinOpen={handleDetailWinOpen} RecordData={item} />
					))}
				</div>
			</div>
		</>

	)
}