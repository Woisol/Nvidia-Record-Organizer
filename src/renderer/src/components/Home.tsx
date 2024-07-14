import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { ArrowForward, Check } from '@mui/icons-material';
import RecordsGroup from './HomeStream/RecordsGroup';
import TitleBar from './TitleBar';
import rightArrow from '../../../../resources/right-arrow.png'
const emptySrc = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
var originTarget: HTMLImageElement, originImgClientRects: ClientRect, isReachCenter: boolean = false;
type Props = {
	curDir: string,
}
export default function Home({ curDir }: Props) {
	const [displaySize, setDisplaySize] = useState(1)
	const [recordData, setRecordData] = useState([])
	const [detailWinOpen, setDetailWinOpen] = useState(false);
	const [renamineWinOpen, setRenamineWinOpen] = useState(false);
	// @ts-ignore
	useEffect(() => { window.store.get("displaySize").then(res => setDisplaySize(res)) }, [])

	window.electron.ipcRenderer.on('update-record-data', (events, arg) => { setRecordData(arg); console.log("render update-record-data ", arg) });
	window.electron.ipcRenderer.on('update-display-size', (events, arg) => { setDisplaySize(arg); console.log("Now Display in Size ", arg); })

	function handleDetailWinOpen(target: HTMLImageElement, detailWinOpen: boolean) {
		const detailImg = document.getElementById("detailImg") as HTMLImageElement;
		if (detailWinOpen && detailImg.src === emptySrc) {
			isReachCenter = false;
			setDetailWinOpen(detailWinOpen);

			originTarget = target;
			originImgClientRects = originTarget.getClientRects()[0];
			if (!originImgClientRects) console.error("originImgClientRects is null");
			detailImg.style.cssText = `left:${originImgClientRects.left}px;top:${originImgClientRects.top}px;width:${originImgClientRects.width}px;height:${originImgClientRects.height}px;`;
			detailImg.src = originTarget.src;
			originTarget.src = emptySrc;

			setTimeout(() => {
				if (!detailWinOpen) return;
				detailImg.classList.add("w-[800px]", "left-1/2", "top-1/2", "-translate-x-1/2", "-translate-y-1/2");
				detailImg.style.cssText = "height:100%";
				// detailImg.style.cssText = '';
			}, 50)

			setTimeout(() => {
				if (!detailWinOpen) return;
				detailImg.style.cssText = '';
			}, 150)

			setTimeout(() => {
				if (!detailWinOpen) return;
				const finalHeight = detailImg.clientHeight + "px";
				detailImg.style.cssText = `height:${finalHeight};`
				isReachCenter = true;
			}, 500)
		}
		else {
			originImgClientRects = originTarget.getClientRects()[0];
			detailImg.classList.remove("w-[800px]", "left-1/2", "top-1/2", "-translate-x-1/2", "-translate-y-1/2");
			detailImg.style.cssText = `left:${originImgClientRects.left}px;top:${originImgClientRects.top}px;width:${originImgClientRects.width}px;height:${originImgClientRects.height}px;`;
			setDetailWinOpen(detailWinOpen);
			if (!isReachCenter && detailImg.src !== emptySrc) {
				originTarget.src = detailImg.src;
			}

			setTimeout(() => {
				if (detailImg.src !== emptySrc)
					originTarget.src = detailImg.src;
				detailImg.src = emptySrc;
				detailImg.style.cssText = '';
			}, 500)
		}
	}
	return (
		<>
			<TitleBar curDir={curDir} />
			<div className="w-full h-[calc(100vh-32px)] px-5 py-4 relative overflow-y-scroll select-none flex flex-col">
				{recordData.length === 0 ?
					<div className="w-fit h-24 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">已经全部整理完啦❤️！</div>
					// !woc！！！这！自己补全出来了tailwindcss的动画哈哈哈
					:
					<>
						{recordData.map((recordData, index) => <RecordsGroup key={index} curDir={curDir} displaySize={displaySize} handleDetailWinOpen={handleDetailWinOpen} recordData={recordData} setRecordData={(value) => setRecordData(value)} />)}
						<Button size='medium' variant='contained' style={{ width: '300px', marginLeft: 'auto', marginRight: 'auto' }} >加载更多</Button>
						<div className={`${renamineWinOpen ? 'w-[400px] h-[600px] right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 ' : 'w-14 h-14 right-10 top-14 bg-white hover:scale-110 active:scale-90 '} fixed z-30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 `}>
							<div className={`${renamineWinOpen ? 'w-[400px]' : 'w-14'} h-14 absolute right-0 flex`}>
								<button className={`w-[200px] h-14 rounded-l-2xl bg-gray-300 ${renamineWinOpen ? '' : 'hidden'}`} onClick={() => { setRenamineWinOpen(false) }}>取消</button>
								<button className={`${renamineWinOpen ? 'w-[200px] duration-100 rounded-r-2xl ' : 'w-14 duration-500 rounded-2xl'} h-14 bg-blue-400 active:bg-blue-500 ring-0 transition-all `} title='Confirm' onClick={() => { setRenamineWinOpen(!renamineWinOpen) }}>
									{renamineWinOpen ? '确认' : <Check style={{ width: '30px', height: '30px' }} />}
								</button>
							</div>
							{renamineWinOpen &&
								<>
									<div className="w-full h-14"></div>
									<div className="w-full h-[544px] p-5 bg-white text-xl">
										<p className='my-2 mt-10'>选中数量：</p>
										<p className='my-2'>最长间隔时间：</p>
										{/* <div className='my-2'> */}
										改名方案：
										<input className='w-full mb-4 border-b-2 border-gray-500' title='renaming scheme' type="text" />
										{/* </div> */}
										{/* <div className='my-2'> */}
										游戏名称{'{Game}'}：
										{/* // !呼FT乱来，这样就可以显示{ }了 */}
										<input className='w-full mb-4 border-b-2 border-gray-500' title='game name' type="text" />
										{/* </div> */}
										{/* <div className='my-2'> */}
										自定义信息{'{Message}'}
										<input className='w-full mb-4 border-b-2 border-gray-500' title='：' type="text" />
										{/* </div> */}

										<div className="w-full absolute bottom-10 text-center">
											效果预览（以第一个文件为例）：
											<div className="w-[360px] h-14 px-2 bg-gray-200 rounded-2xl flex justify-center items-center">
												<span className='w-40 text-xs text-left'>{recordData[0].recordData[0].name}</span>
												<div className='flex flex-col'><span className='text-sm'>改名为</span><img src={rightArrow} alt="---->" /></div>
												<span className='w-40 text-xs text-left'></span>
											</div>
										</div>
									</div>
								</>}

						</div>
					</>
				}
				<div className={`w-screen  h-[calc(100vh-32px)] fixed z-10 top-8 left-0 ${!detailWinOpen && 'pointer-events-none'}`} onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
					// @ts-ignore
					handleDetailWinOpen(e.target.children[1] as HTMLImageElement, false)
				}} >
					<div className={`w-full h-full backdrop-blur-2xl transition-all duration-500 ${detailWinOpen ? 'opacity-50' : 'opacity-0'}`} style={{ backgroundColor: 'rgb(0,0,0)' }}></div>
					<img id="detailImg" src={emptySrc} alt="" className="rounded-2xl fixed object-cover transition-all duration-500" onClick={(e) => handleDetailWinOpen(e.target as HTMLImageElement, false)} />
				</div>
			</div >
		</>
	)
}

