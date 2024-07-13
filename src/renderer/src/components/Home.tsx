import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Check } from '@mui/icons-material';
import RecordsGroup from './HomeStream/RecordsGroup';
const emptySrc = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
var originTarget: HTMLImageElement, originImgClientRects: ClientRect, isReachCenter: boolean = false;
type Props = {
	curDir: string,
}
export default function Home({ curDir }: Props) {
	const [displaySize, setDisplaySize] = useState(1)
	const [detailWinOpen, setDetailWinOpen] = useState(false);
	const [recordData, setRecordData] = useState([])
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
		<div className="w-full h-[calc(100vh-32px)] px-5 py-4 relative overflow-y-scroll select-none flex flex-col">
			{recordData.length === 0 ?
				<div className="w-fit h-24 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">已经全部整理完啦❤️！</div>
				// !woc！！！这！自己补全出来了tailwindcss的动画哈哈哈
				:
				<>
					{recordData.map((recordData, index) => <RecordsGroup key={index} curDir={curDir} displaySize={displaySize} setDisplaySize={setDisplaySize} handleDetailWinOpen={handleDetailWinOpen} recordData={recordData} />)}
					<Button size='medium' variant='contained' style={{ width: '300px', marginLeft: 'auto', marginRight: 'auto' }} >加载更多</Button>
					<button className='w-14 h-14 fixed top-14 right-10 z-30 rounded-full bg-blue-400 transition-all shadow-2xl hover:scale-110 active:bg-blue-500 active:scale-90 ring-0' title='Confirm'><Check style={{ width: '30px', height: '30px' }} /></button>
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
	)
}

