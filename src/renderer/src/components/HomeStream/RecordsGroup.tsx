import React, { useState } from "react";
import Record from "./Record"
// !from FT，使用这个1*1透明gif来占位src就可以去除src为空时的标志了
type recordData = {
	displaySize: number,
	setDisplaySize: React.Dispatch<React.SetStateAction<number>>,
	// !woq自己补全出来的
	handleDetailWinOpen: (e: HTMLImageElement, detailWinOpen: boolean) => void,
	recordData: {
		dateTitle: string,
		recordData: Array<{ name: string, checked: boolean }>
	}
}
export default function RecordsGroup({ displaySize, setDisplaySize, handleDetailWinOpen, recordData }: recordData) {
	// const [originTarget, setOriginTarget] = useState<HTMLImageElement>();
	// !用hook就是莫名其妙更新不了…………不用了
	// console.log("DetailWindow is ", `${detailWinOpen ? 'Open' : 'Close'}`)
	return (
		<>
			<div className="w-full h-fit mb-3 px-4 py-2 rounded-2xl bg-gray-100">
				<p className="w-1/3 border-b-2 border-gray-300 mb-2">{recordData.dateTitle}</p>
				<div className="w-fit relative flex flex-wrap gap-3">
					{recordData.recordData.map((item, index) => (
						<Record displaySize={displaySize} setDisplaySize={setDisplaySize} handleDetailWinOpen={handleDetailWinOpen} RecordData={item} />
					))}
				</div>
			</div>
		</>

	)
}