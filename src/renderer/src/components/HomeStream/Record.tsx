import { CheckCircleOutline, CheckCircleRounded } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import { useState, useEffect } from "react"

type RecordData = {
	displaySize: number,
	setDisplaySize: React.Dispatch<React.SetStateAction<number>>,
	handleDetailWinOpen: (e: HTMLImageElement, detailWinOpen: boolean) => void,
	RecordData: {
		name: string,
		checked: boolean
	}
}
// ！规范！不然不能直接({data:string})！
// function recordChild(data: RecordData) {
// 	return (
// 	)
// }

export default function Record({ displaySize, setDisplaySize, handleDetailWinOpen, RecordData }: RecordData) {
	const [curDir, setCurDir] = useState('');
	const [checked, setChecked] = useState(RecordData.checked);
	// @ts-ignore
	// @ts-ignore
	useEffect(() => { window.store.get("curDir").then(res => setCurDir(res)) }, [])

	return (
		<>
			<div className={`${displaySize === 0 ? "w-[150px] h-[112.5px]" : displaySize === 1 ? "w-[250px] h-[187.5px]" : "w-[400px] h-[300px]"} overflow-hidden relative transition-all duration-300 rounded-2xl shadow-lg hover:scale-110 hover:z-10 ring-2 ring-gray-500`}>
				{/* // !开始是直接用displaySize判断的但显然错了所以这里改后的逻辑也不是很直接 */}
				{/* //! 这里用min-h会导致放大后图片变形………………算了看不全就点开详细页吧………… */}
				{curDir === '' || RecordData.name === '' ? <p className="w-full text-center text-2xl"><br />数据不能为空！</p> :
					<>
						<img src={`file:\\\\${curDir}\\${RecordData.name}`} alt="" className="w-full h-full object-cover" onClick={(e) => handleDetailWinOpen(e.target as HTMLImageElement, true)} />
						{/* // !关闭WebSecurity依然报错Refused to load the image 'xxx' because it violates the following Content Security Policy directive: "img-src 'self' data:". */}
						{/* // !去index.html注释掉那段meta的就可以了 */}
						<Checkbox checked={checked} onChange={e => { setChecked(e.target.checked); setDisplaySize((displaySize + 1) % 3) }} icon={<CheckCircleOutline />} checkedIcon={<CheckCircleRounded />} sx={{ bottom: '5px', right: '5px', position: 'absolute' }} />
					</>
				}
			</div>
		</>
		// !尝试使用CSS实现，应该不可行，position在fixed和absolute之间切换必然导致位置瞬移…………
		// !考虑用js新建一个src吧…………
		// <>
		// 	{/* //!啊啊啊啊啊？？？原来最终是差了一个<>吗？？？不加这个下面这个三目表达式一直报错………… */}
		// 	<div className={`${displaySize === 0 ? "w-[150px] h-[112.5px]" : displaySize === 1 ? "w-[250px] h-[187.5px]" : "w-[400px] min-h-[200px]"} overflow-hidden rounded-2xl relative transition-all duration-300 shadow-lg ${detailWinOpen ? '' : 'hover:scale-110 hover:z-10'} bg-gradient-to-tr from-red-400 to-blue-500 `}>
		// 		{/* //!这里的hover:scale如果不在打开窗口时出去会出现悬浮上去图片就抽搐的bug */}
		// 		{/* // !开始是直接用displaySize判断的但显然错了所以这里改后的逻辑也不是很直接 */}
		// 		{/* {detailWinOpen ? <div className={`w-full h-[calc(100%-32px)] fixed z-10 top-8 left-0 bg-gray-900 opacity-10 backdrop-blur-2xl ${!detailWinOpen && 'hidden'}`}></div> : null} */}

		// 		{curDir === '' || RecordData.name === '' ? <p className="w-full text-center text-2xl"><br />数据不能为空！</p> :
		// 			<div className={`w-full transition-all duration-300 ${detailWinOpen ? 'h-[calc(100%-32px)] left-0 top-8 fixed p-10 z-20' : 'h-full'}`} >
		// 				<img src={`file:\\\\${curDir}\\${RecordData.name}`} alt={RecordData.name} className={`w-full h-full object-cover rounded-2xl `} onClick={() => setDetailWinOpen(!detailWinOpen)} />
		// 				{/* // !关闭WebSecurity依然报错Refused to load the image 'xxx' because it violates the following Content Security Policy directive: "img-src 'self' data:". */}
		// 				{/* // !去index.html注释掉那段meta的就可以了 */}
		// 				<Checkbox checked={checked} onChange={e => { setChecked(e.target.checked); setDisplaySize((displaySize + 1) % 3) }} icon={<CheckCircleOutline />} checkedIcon={<CheckCircleRounded />} sx={{ bottom: '5px', right: '5px', position: 'absolute' }} />
		// 			</div>
		// 		}

		// 	</div>
		// </>
	)
}

