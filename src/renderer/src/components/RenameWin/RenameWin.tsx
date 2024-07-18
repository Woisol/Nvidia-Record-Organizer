import { Check, Refresh } from "@mui/icons-material"
import rightArrow from '../../../../../resources/right-arrow.png'
import { useState } from "react"

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
// !明确思路！用React state的目的是重新渲染！但是这里只是为了留存数据所以不需要再搞state！
// !可能是很经典的应用场景！记得！
// ~~不行…………如果在修改了game之后修改其它选项这里又要更新了………………………………
// !咳咳！！！！！可行的！！！其实你dataProcess.ts里面确实没有修改game的代码…………本质其实是在选中零个时ts里面错误引用了renamingRecord[0]导致没有更新！
export default function RenameWin({ renamineWinOpen, setRenamineWinOpen, firstFileName }: props) {
	const [selectNum, setSelectNum] = useState(0);
	const [maxGapSeconds, setMaxGapSeconds] = useState(0);
	const [renameScheme, setRenameScheme] = useState('');
	const [game, setGame] = useState('');
	const [message, setMessage] = useState('');
	const [instance, setInstance] = useState('');
	var [isRenameProcess, setIsRenameProcess] = useState(false);
	// var isRenameProcess = false;
	// ~~一样的！不涉及到渲染咳咳涉及到的……

	function updateRenamePreview(renameScheme: string, game: string, message: string) {
		window.electron.ipcRenderer.invoke("request-update-rename-preview", { renameScheme: renameScheme, game: game, message: message }).then((result: string) => { setInstance(result) })
	}
	window.electron.ipcRenderer.on('finish-rename-process', (e, arg) => {
		if (arg === 1) {
			setIsRenameProcess(false);
			setRenamineWinOpen(false);
		}
	})
	return (
		<>
			<div className={`w-full h-[calc(100vh-32px)] fixed left-0 top-8 z-30 backdrop-blur-2xl transition-all duration-500 ${renamineWinOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`} style={{ backgroundColor: 'rgb(0,0,0)' }}></div>
			{/* //!pointer-events-none的究极大补丁哈哈哈哈 */}
			<div className={`${renamineWinOpen ? 'w-[400px] h-[600px] right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 ' : 'w-14 h-14 right-10 top-14 bg-white hover:scale-110 active:scale-90 '} fixed z-30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 `}>
				<div className={`${renamineWinOpen ? 'w-[400px]' : 'w-14'} h-14 absolute right-0 flex`}>
					<button className={`w-[200px] h-14 rounded-l-2xl bg-gray-300 ${renamineWinOpen && !isRenameProcess ? '' : 'hidden'}`} onClick={() => { setRenamineWinOpen(false) }}>取消</button>
					<button className={`${renamineWinOpen ? `${isRenameProcess ? 'w-[400px] rounded-2xl' : 'w-[200px] rounded-r-2xl'} absolute right-0 duration-100 ` : 'w-14 duration-500 rounded-2xl'} disabled:text-gray-400 disabled:bg-gray-300 disabled:active:bg-gray-300 h-14 bg-blue-400 active:bg-blue-500 ring-0 transition-all `} title='Confirm' disabled={renamineWinOpen && (selectNum === 0 || renameScheme === '')} onClick={() => {
						if (isRenameProcess) { console.error('double requet to rename process'); return; }
						if (renamineWinOpen) {
							setIsRenameProcess(true);

							window.electron.ipcRenderer.send('request-rename-process', { renameScheme: renameScheme, game: game, message: message })
							// 	.then(() => {
							// 	setIsRenameProcess(false)
							// 	// !!!艹注意invoke是阻塞的…………所以这里无法实现所谓加载重新渲染！
							// })
						}
						else {
							setRenamineWinOpen(!renamineWinOpen)
							window.electron.ipcRenderer.invoke("request-init-rename-info").then((renameInfo: renameInfo) => {
								// !艹本来想偷懒复用的哈哈………………………………但是自然就又输入不了了…………
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
									// !艹本来想偷懒复用的哈哈………………………………但是自然就又输入不了了…………
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
						// !防止在组全选的过程中数据变化…………
					}}>
						{renamineWinOpen ? (isRenameProcess ? <Refresh className="rotate" style={{ width: '40px', height: '40px' }} /> : '确认') : <Check style={{ width: '30px', height: '30px' }} />}
						{/* //!服了是你自己逻辑错误怪人家React没有正确刷新isRenameProcess…………虽然console.log确实也错了但是实际运行时没问题的 */}
					</button>
				</div>
				<div className="w-screen h-[544px] p-6 absolute -z-10 bg-blue-400"></div>
				{/* //!哈哈哈加了这个返回效果就好看多了哈哈哈 */}
				{renamineWinOpen &&
					<>
						<div className="w-full h-14 bg-white"></div>
						<div className="w-full h-[544px] p-10 bg-white text-xl">
							<p className='w-full relative my-2 mt-3'><b>选中数量：</b><span className="absolute right-0">{selectNum}个</span></p>
							<p className='w-full relative mt-2'><b>最长间隔时间：</b><span className="absolute right-0">
								{`${Math.floor(maxGapSeconds % 86400 / 3600) === 0 ? '' : `${(maxGapSeconds % 86400 / 3600).toFixed(1)}h `}${Math.floor(maxGapSeconds % 3600 / 60) === 0 ? '' : `${(maxGapSeconds % 3600 / 60).toFixed(0)}min `}${maxGapSeconds % 60}s`}</span>
							</p>
							<div className="text-xs text-gray-400">超过一天时该记录并不准确</div>
							<p className='my-2'></p>
							<b>改名方案：</b><div className="text-xs text-gray-400">{'(支持{game},{date},{yyyy},{MM},{dd},{HH},{mm},{ss},{message},{indexIfRepeat}等变量，区分大小写，其中{indexIfRepeat}如果不重复时会自动删去前面空格)'}</div>
							<textarea className='w-full mb-4 border-b-2 border-gray-500 text-sm hide-scrollbar' title='renaming scheme' value={renameScheme} onChange={(e) => { const value = e.target.value; setRenameScheme(value); updateRenamePreview(value, game, message); }} />
							<b>游戏名称{'{Game}'}：</b>
							{/* // !呼FT乱来，这样就可以显示{ }了 */}
							<input className='w-full mb-4 border-b-2 border-gray-500 text-center' title='game name' type="text" placeholder={game} onChange={(e) => { var value = e.target.value; if (value === '' && originGameName) value = originGameName; setGame(value); updateRenamePreview(renameScheme, value, message); }} />
							<b>自定义信息{'{Message}'}</b>
							<textarea className='w-full mb-4 border-b-2 border-gray-500 text-sm hide-scrollbar' title='massage' value={message} onChange={(e) => { const value: string = e.target.value; if (value.endsWith('\n')) return; setMessage(value); updateRenamePreview(renameScheme, game, value); }} />
							{/* //!无法使用whitespace禁止换行………… */}
							<div className="w-[320px] absolute bottom-10 text-center">
								<b>效果预览</b><div className="text-xs text-gray-400">（以第一个文件为例）：</div>
								<div className="w-full h-14 px-2 bg-gray-200 rounded-2xl flex justify-center items-center">
									<span className='w-40 text-xs text-left select-text'>{firstFileName}</span>
									<div className='flex flex-col mr-2'>
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