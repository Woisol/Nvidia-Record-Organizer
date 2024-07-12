import { CheckBox, CheckBoxOutlineBlank, CheckBoxOutlined, CheckBoxRounded, CheckBoxSharp, CheckBoxTwoTone, CheckCircle, CheckCircleOutline, CheckCircleOutlineOutlined, CheckCircleRounded, FactCheck } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import { useState, useEffect } from "react"

type RecordData = {
	RecordData: {
		name: string,
		checked: boolean
	}
}
// ！规范！不然不能直接({data:string})！
export default function Record({ RecordData }: RecordData) {
	const [displaySize, setDisplaySize] = useState(1);
	const [curDir, setCurDir] = useState('');
	const [checked, setChecked] = useState(RecordData.checked);
	// @ts-ignore
	useEffect(() => { window.store.get("displaySize").then(res => setDisplaySize(res)) }, [])
	// @ts-ignore
	useEffect(() => { window.store.get("curDir").then(res => setCurDir(res)) }, [])
	console.log("Record Display in Size ", displaySize);
	return (
		<div className={`${displaySize === 0 ? "w-36 h-28" : displaySize === 1 ? "w-52 h-36" : "w-72 h-56"} relative bg-gradient-to-tr from-red-400 to-blue-500 rounded-2xl shadow-lg`} >
			{curDir === '' || RecordData.name === '' ? <p className="w-full text-center text-2xl"><br />数据不能为空！</p> :
				<>
					<img src={`file:\\\\${curDir}\\${RecordData.name}`} alt="" className="" />
					<Checkbox checked={checked} onChange={e => { setChecked(e.target.checked); }} icon={<CheckCircleOutline />} checkedIcon={<CheckCircleRounded />} sx={{ bottom: '5px', right: '5px', position: 'absolute' }} />
				</>
			}
		</div>
	)
}

