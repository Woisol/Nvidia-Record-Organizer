import { CheckCircleOutline, CheckCircleRounded } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import { useState, useEffect } from "react"

type RecordData = {
	curDir: string,
	displaySize: number,
	handleDetailWinOpen: (e: HTMLImageElement, detailWinOpen: boolean) => void,
	RecordData: {
		name: string,
		checked: boolean
	}
}

export default function Record({ curDir, displaySize, handleDetailWinOpen, RecordData }: RecordData) {
	const [checked, setChecked] = useState(RecordData.checked);

	return (
		<>
			<div className={`${displaySize === 0 ? "w-[150px] h-[112.5px]" : displaySize === 1 ? "w-[250px] h-[187.5px]" : "w-[400px] h-[300px]"} overflow-hidden relative transition-all duration-300 rounded-2xl shadow-lg hover:scale-110 hover:z-10 ring-2 ring-gray-500`}>
				{curDir === '' || RecordData.name === '' ? <p className="w-full text-center text-2xl"><br />数据不能为空！</p> :
					<>
						<img src={`file:\\\\${curDir}\\${RecordData.name}`} alt={RecordData.name} className="w-full h-full object-cover" onClick={(e) => handleDetailWinOpen(e.target as HTMLImageElement, true)} />
						<div className={`w-full absolute text-white  pointer-events-none text-center ${displaySize === 0 ? 'h-5 ext-sm -bottom-1' : 'h-7 text-lg -bottom-2'}`} style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
							<div className="w-full h-full absolute bg-gradient-to-t from-gray-700 to-gray-300 opacity-30"></div>
							{RecordData.name.match(/(?<=Screenshot )\d{4}.\d{2}.\d{2} - \d{2}.\d{2}.\d{2}(?=.\d{2}.png)/)}
						</div>
						<Checkbox checked={checked} onChange={e => { setChecked(e.target.checked); }} icon={<CheckCircleOutline />} checkedIcon={<CheckCircleRounded />} sx={{ bottom: '5px', right: '5px', position: 'absolute', boxShadow: '0px 0px 20px rgba(0,0,0,0.5)' }} />
					</>
				}
			</div>
		</>
		// **CSS方案
		// <>
		// 	<div className={`${displaySize === 0 ? "w-[150px] h-[112.5px]" : displaySize === 1 ? "w-[250px] h-[187.5px]" : "w-[400px] min-h-[200px]"} overflow-hidden rounded-2xl relative transition-all duration-300 shadow-lg ${detailWinOpen ? '' : 'hover:scale-110 hover:z-10'} bg-gradient-to-tr from-red-400 to-blue-500 `}>
		// 		{/* {detailWinOpen ? <div className={`w-full h-[calc(100%-32px)] fixed z-10 top-8 left-0 bg-gray-900 opacity-10 backdrop-blur-2xl ${!detailWinOpen && 'hidden'}`}></div> : null} */}
		// 		{curDir === '' || RecordData.name === '' ? <p className="w-full text-center text-2xl"><br />数据不能为空！</p> :
		// 			<div className={`w-full transition-all duration-300 ${detailWinOpen ? 'h-[calc(100%-32px)] left-0 top-8 fixed p-10 z-20' : 'h-full'}`} >
		// 				<img src={`file:\\\\${curDir}\\${RecordData.name}`} alt={RecordData.name} className={`w-full h-full object-cover rounded-2xl `} onClick={() => setDetailWinOpen(!detailWinOpen)} />
		// 				<Checkbox checked={checked} onChange={e => { setChecked(e.target.checked); setDisplaySize((displaySize + 1) % 3) }} icon={<CheckCircleOutline />} checkedIcon={<CheckCircleRounded />} sx={{ bottom: '5px', right: '5px', position: 'absolute' }} />
		// 			</div>
		// 		}
		// 	</div>
		// </>
	)
}

