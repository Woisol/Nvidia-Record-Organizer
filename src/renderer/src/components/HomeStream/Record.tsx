import { CheckCircleOutline, CheckCircleRounded } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import { useState, useEffect } from "react"

type RecordData = {
	displaySize: number,
	setDisplaySize: React.Dispatch<React.SetStateAction<number>>,
	RecordData: {
		name: string,
		checked: boolean
	}
}
// ！规范！不然不能直接({data:string})！
export default function Record({ displaySize, setDisplaySize, RecordData }: RecordData) {
	const [curDir, setCurDir] = useState('');
	const [checked, setChecked] = useState(RecordData.checked);
	const [detailWinOpen, setDetailWinOpen] = useState(false);
	// @ts-ignore
	// @ts-ignore
	useEffect(() => { window.store.get("curDir").then(res => setCurDir(res)) }, [])
	console.log("Record Display in Size ", displaySize);
	return (
		// "w-[600px] h-[452px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
		// {detailWinOpen ? <div className=""></div>:
		<div className={`${displaySize === 0 ? "w-[150px] h-[112.5px]" : displaySize === 1 ? "w-[250px] h-[187.5px]" : "w-[400px] min-h-[200px]"} overflow-hidden relative transition-all duration-300 rounded-2xl shadow-lg hover:scale-110 hover:z-10 bg-gradient-to-tr from-red-400 to-blue-500 `}>
			{/* // !开始是直接用displaySize判断的但显然错了所以这里改后的逻辑也不是很直接 */}
			{curDir === '' || RecordData.name === '' ? <p className="w-full text-center text-2xl"><br />数据不能为空！</p> :
				<>
					<img src={`file:\\\\${curDir}\\${RecordData.name}`} alt="" className="w-full h-full object-cover" />
					{/* // !关闭WebSecurity依然报错Refused to load the image 'xxx' because it violates the following Content Security Policy directive: "img-src 'self' data:". */}
					{/* // !去index.html注释掉那段meta的就可以了 */}
					<Checkbox checked={checked} onChange={e => { setChecked(e.target.checked); setDisplaySize((displaySize + 1) % 3) }} icon={<CheckCircleOutline />} checkedIcon={<CheckCircleRounded />} sx={{ bottom: '5px', right: '5px', position: 'absolute' }} />
				</>
			}
		</div>
		// }
	)
}

