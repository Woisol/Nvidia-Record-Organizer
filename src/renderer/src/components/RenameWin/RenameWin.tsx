import { Check, HelpOutline, Refresh } from "@mui/icons-material"
import rightArrow from '../../../../../resources/right-arrow.png'
import { useState } from "react"
import { Tooltip, Zoom } from "@mui/material"

type props = {
	renamineWinOpen: boolean
	setRenamineWinOpen: (isOpen: boolean) => void,
	firstFileName: string,
}
type renameInfo = {
	selectNum: number,
	maxGapSeconds: number,
	renameScheme: string,
	game: string,
	message: string,
	instance: string
}


var originGameName;
export default function RenameWin({ renamineWinOpen, setRenamineWinOpen, firstFileName }: props) {
	const [selectNum, setSelectNum] = useState(0);
	const [maxGapSeconds, setMaxGapSeconds] = useState(0);
	const [renameScheme, setRenameScheme] = useState('');
	const [game, setGame] = useState('');
	const [message, setMessage] = useState('');
	const [instance, setInstance] = useState('');
	var [isRenameProcess, setIsRenameProcess] = useState(false);

	function updateRenamePreview(renameScheme: string, game: string, message: string) {
		window.electron.ipcRenderer.invoke("request-update-rename-preview", { renameScheme: renameScheme, game: game, message: message }).then((result: string) => { setInstance(result) })
	}
	window.electron.ipcRenderer.on('finish-rename-process', (_e, arg) => {
		if (arg === 1) {
			setIsRenameProcess(false);
			setRenamineWinOpen(false);
		}
	})

	document.addEventListener('keyup', (event) => { if (event.key === 'Escape') { setRenamineWinOpen(false) } })

	return (
		<>
			<div className={`w-full h-[calc(100vh-32px)] fixed left-0 top-8 z-20 transition-all duration-500 ${!renamineWinOpen && 'opacity-0 pointer-events-none'}`} style={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
			<div className={`${renamineWinOpen ? 'w-[400px] h-[600px] right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 ' : 'w-14 h-14 right-10 top-14 bg-white hover:scale-110 active:scale-90 '} fixed z-30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 `}>
				<div className={`${renamineWinOpen ? 'w-[400px]' : 'w-14'} h-14 absolute right-0 flex`}>
					<button className={`w-[200px] h-14 rounded-l-2xl bg-gray-300 ${renamineWinOpen && !isRenameProcess ? '' : 'hidden'}`} onClick={() => { setRenamineWinOpen(false) }}>取消</button>
					<button className={`${renamineWinOpen ? `${isRenameProcess ? 'w-[400px] rounded-2xl' : 'w-[200px] rounded-r-2xl'} absolute right-0 duration-100 ` : 'w-14 duration-500 rounded-2xl'} disabled:text-gray-400 disabled:bg-gray-300 disabled:active:bg-gray-300 h-14 bg-blue-400 active:bg-blue-500 ring-0 transition-all `} title='Confirm' disabled={renamineWinOpen && (selectNum === 0 || renameScheme === '')} onClick={() => {
						if (isRenameProcess) { console.error('double requet to rename process'); return; }
						if (renamineWinOpen) {
							setIsRenameProcess(true);

							window.electron.ipcRenderer.send('request-rename-process', { renameScheme: renameScheme, game: game, message: message })
						}
						else {
							setRenamineWinOpen(!renamineWinOpen)
							window.electron.ipcRenderer.invoke("request-init-rename-info").then((renameInfo: renameInfo) => {
								setSelectNum(renameInfo.selectNum)
								setMaxGapSeconds(renameInfo.maxGapSeconds)
								setRenameScheme(renameInfo.renameScheme)
								setGame(renameInfo.game)
								originGameName = renameInfo.game;
								setMessage(renameInfo.message)
								setInstance(renameInfo.instance)
							})
							setTimeout(() => {
								window.electron.ipcRenderer.invoke("request-init-rename-info").then((renameInfo: renameInfo) => {
									setSelectNum(renameInfo.selectNum)
									setMaxGapSeconds(renameInfo.maxGapSeconds)
									setRenameScheme(renameInfo.renameScheme)
									setGame(renameInfo.game)
									originGameName = renameInfo.game;
									setMessage(renameInfo.message)
									setInstance(renameInfo.instance)
								})
							}, 1000)
						}
						// td其实考虑应该间隔自动刷新才比较合理……万一组长的离谱就又不准了
					}}>
						{renamineWinOpen ? (isRenameProcess ? <Refresh className="rotate" style={{ width: '40px', height: '40px' }} /> : '确认') : <Check style={{ width: '30px', height: '30px' }} />}
					</button>
				</div>
				<div className="w-screen h-[544px] p-6 absolute -z-10 bg-blue-400"></div>
				{renamineWinOpen &&
					<>
						<div className="w-full h-14 bg-white"></div>
						<div className="w-full h-[544px] p-8 bg-white text-xl">
							<p className='w-full relative my-2 mt-3'><b>选中数量：</b><span className="absolute right-0">{selectNum}个</span></p>
							<p className='w-full relative mt-2'><b>最长间隔时间：</b>
								<Tooltip title='超过一天时该记录并不准确' placement='bottom-end' TransitionComponent={Zoom} TransitionProps={{ timeout: 200 }} enterDelay={500} leaveDelay={100} arrow>
									<HelpOutline />
								</Tooltip>
								<span className="absolute right-0">{`${Math.floor(maxGapSeconds % 86400 / 3600) === 0 ? '' : `${(maxGapSeconds % 86400 / 3600).toFixed(1)}h `}${Math.floor(maxGapSeconds % 3600 / 60) === 0 ? '' : `${(maxGapSeconds % 3600 / 60).toFixed(0)}min `}${maxGapSeconds % 60}s`}</span>
							</p>
							<p className='my-2'>
								<b>改名方案：</b>
								<Tooltip title='支持变量{game},{date},{yyyy},{MM},{dd},{HH},{mm},{ss},{message},{indexIfRepeat}，区分大小写，其中{indexIfRepeat}如果不重复时会自动删去前面空格' placement='bottom' TransitionComponent={Zoom} TransitionProps={{ timeout: 200 }} enterDelay={500} leaveDelay={100} arrow>
									<HelpOutline />
								</Tooltip>
							</p>
							<textarea className='w-full mb-4 border-b-2 border-gray-500 text-sm hide-scrollbar' title='renaming scheme' value={renameScheme} onChange={(e) => { const value = e.target.value; setRenameScheme(value); updateRenamePreview(value, game, message); }} />
							<b>游戏名称{'{game}'}：</b>
							<input className='w-full mb-4 border-b-2 border-gray-500 text-center' title='game name' type="text" placeholder={game} onChange={(e) => { var value = e.target.value; if (value === '' && originGameName) value = originGameName; setGame(value); updateRenamePreview(renameScheme, value, message); }} />
							<b>自定义信息{'{message}'}</b>
							<textarea className='w-full mb-4 border-b-2 border-gray-500 text-sm hide-scrollbar' title='massage' value={message} onChange={(e) => { const value: string = e.target.value; if (value.endsWith('\n')) return; setMessage(value); updateRenamePreview(renameScheme, game, value); }} />
							<div className="w-[336px] absolute bottom-10 text-center">
								<b>效果预览</b><div className="text-xs text-gray-400">（以第一个文件为例）：</div>
								<div className="w-full h-14 px-2 bg-gray-200 rounded-2xl flex justify-center items-center">
									<span className='w-40 text-xs text-left select-text'>{firstFileName}</span>
									<div className='flex flex-col mr-4'>
										<span className='text-sm'>改名为</span>
										<img src={rightArrow} alt="---->" />
									</div>
									<span className='w-40 text-xs text-left select-text'>{instance}</span>
								</div>
							</div>
						</div>
					</>}

			</div>

		</>
	)
}