// !图片性能优化相关:https://segmentfault.com/a/1190000043479272
import { CheckCircleOutline, CheckCircleRounded } from "@mui/icons-material";
import { Checkbox, FormControlLabel, Grow, Tooltip } from "@mui/material";
import { thumbnailDir } from "../Home";

type RecordData = {
	index: number,
	curDir: string,
	displaySize: number,
	handleDetailWinOpen: (e: HTMLImageElement, detailWinOpen: boolean) => void,
	RecordData: {
		name: string,
		checked: boolean
	},
	handleCleckBoxChecked: (name: string, checked: boolean) => void,
	thumbnailDir: string
}
// const thumbnailDir: string = path.join(app.getPath('temp'), 'NvidiaRecordOrganizer');
export default function Record({ index, curDir, displaySize, handleDetailWinOpen, RecordData, handleCleckBoxChecked, thumbnailDir }: RecordData) {
	// const [checked, setChecked] = useState(RecordData.checked);
	// !艹必须要用state…………不然React不会刷新的…………

	return (
		<>
			<div className={`${displaySize === 0 ? "w-[150px] h-[112.5px]" : displaySize === 1 ? "w-[250px] h-[187.5px]" : "w-[400px] h-[300px]"} overflow-hidden relative ${RecordData.checked ? `${displaySize === 0 ? 'scale-110' : 'scale-105'} border-red-500` : 'border-gray-500'} rounded-2xl border-4 shadow-lg transition-all duration-300 ${displaySize === 0 ? 'hover:scale-110' : 'hover:scale-105'} hover:z-10 `} onContextMenu={() => {
				window.electron.ipcRenderer.send('contextmenu-record', { name: RecordData.name });
				// !不需要传递x,y，electron自己弹出的时候就默认是跟随鼠标了的
			}}>
				{curDir === '' || RecordData.name === '' ? <p className="w-full text-center text-2xl"><br />数据不能为空！</p> :
					<Tooltip title={RecordData.name} arrow TransitionComponent={Grow} TransitionProps={{ timeout: 300 }} enterDelay={1000} classes={{ tooltip: "whitespace-nowrap" }}>
						{/* //!噢噢！MUI的类名应该这样加！！！ */}
						{/* <></> */}
						{/* //!虽然报错了但是加了<></>反而无法正常显示Tooltip */}
						<img src={`file:\\\\${thumbnailDir}\\${RecordData.name.replace(".png", "_thumbnail.jpg")}`} alt={RecordData.name} className="w-full h-full object-cover" onClick={(e) => handleDetailWinOpen(e.target as HTMLImageElement, true)} />
						{/* //!加了file:\\\\也无法解决刷新后无缩略图的问题 */}
						{/* <Tooltip> */}
						<div className={`w-full absolute text-white  pointer-events-none text-center ${displaySize === 0 ? 'h-5 ext-sm -bottom-1' : 'h-7 text-lg -bottom-2'}`} style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
							{/* //!因为pointer-event-none而无法使用tooltip…… */}
							<div className="w-full h-full absolute bg-gradient-to-t from-gray-700 to-gray-300 opacity-30"></div>
							<>
								{RecordData.name.match(/(?<=Screenshot )\d{4}.\d{2}.\d{2} - \d{2}.\d{2}.\d{2}(?=.\d{2}.png)/)}
							</>
						</div>
						{/* </Tooltip> */}
						<FormControlLabel
							label={`label${index}`}
							control={
								<Checkbox checked={RecordData.checked} onChange={e => {
									// setChecked(e.target.checked);
									handleCleckBoxChecked(RecordData.name, e.target.checked);
									// checkGroupAllChecked();
									window.electron.ipcRenderer.send('request-update-renaming-record', { name: RecordData.name, checked: e.target.checked });
								}} icon={<CheckCircleOutline />} checkedIcon={<CheckCircleRounded />} sx={{ bottom: '5px', right: '5px', position: 'absolute', boxShadow: '0px 0px 20px rgba(0,0,0,0.5)' }} />
							} />
					</Tooltip>
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

