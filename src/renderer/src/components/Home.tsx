import { useEffect, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { Check, EmojiPeopleOutlined } from '@mui/icons-material';
import RecordsGroup from './HomeStream/RecordsGroup';
// import { ipcRenderer } from 'electron';
const emptySrc = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
var originTarget: HTMLImageElement, originImgClientRects: ClientRect, isReachCenter: boolean = false;
export default function Home() {
	const [displaySize, setDisplaySize] = useState(1)
	const [detailWinOpen, setDetailWinOpen] = useState(false);
	const [recordData, setRecordData] = useState([])
	// const [detailImgSrc, setDetailImgSrc] = useState("")
	// const [detailImgStyle, setDetailImgStyle] = useState({ left: '0px', top: '0px', width: '0px', height: '0px' } as React.CSSProperties)
	// !用hook也没用，而且由于hook的延后行动画也坏了
	// @ts-ignore
	useEffect(() => { window.store.get("displaySize").then(res => setDisplaySize(res)) }, [])
	console.log("Record Display in Size ", displaySize);
	// var animationTimer: Array<NodeJS.Timeout> = []
	function handleDetailWinOpen(target: HTMLImageElement, detailWinOpen: boolean) {
		const detailImg = document.getElementById("detailImg") as HTMLImageElement;
		// animationTimer.forEach(timer => clearTimeout(timer))
		// !不加这个了加这个会有小概率丢失图片
		// animationTimer = [];
		if (detailWinOpen) {
			// closeAnimationTimer.forEach(timer => clearTimeout(timer))
			// closeAnimationTimer = [];

			// originTarget = originImgClientRects = null;

			isReachCenter = false;
			setDetailWinOpen(detailWinOpen);
			// originTarget = e.target as HTMLDivElement;
			originTarget = target;
			originImgClientRects = originTarget.getClientRects()[0];
			// console.log("originTarget", originTarget);
			// console.log("correct\tLeft", originImgClientRects.left, " | Top:", originImgClientRects.top);
			// !数据是没问题的
			if (!originImgClientRects) console.error("originImgClientRects is null");
			// detailImgPosition = {
			// 	// !这样读取的并不是实时位置…………事实上这四个属性（这里只保留了width）甚至是""…………
			// 	// left: originTarget.style.width,

			// 	left: originImgClientRects.left + "px",
			// 	top: originImgClientRects.top + "px",
			// 	width: originImgClientRects.width + "px",
			// 	height: originImgClientRects.height + "px"

			// 	// left: originTarget.offsetLeft + "px",
			// 	// !这个是相对包含快的位置
			// }
			// !断言！
			// const target: HTMLElement = e.target;
			// !报错有292项不存在哈哈

			// detailImg.style.left = originImgClientRects.left + "px";
			// detailImg.style.top = originImgClientRects.top + "px";
			// detailImg.style.width = originImgClientRects.width + "px";
			// detailImg.style.height = originImgClientRects.height + "px";

			// setTimeout(() => { detailImg.style.cssText = `left:${originImgClientRects.left}px;top:${originImgClientRects.top}px;width:${originImgClientRects.width}px;height:${originImgClientRects.height}px;`; console.log('set\tleft', detailImg.style.left, ' | top', detailImg.style.top); console.log("origin class", detailImg.classList) }, 10)
			detailImg.style.cssText = `left:${originImgClientRects.left}px;top:${originImgClientRects.top}px;width:${originImgClientRects.width}px;height:${originImgClientRects.height}px;`;
			// !设置两次都无法解决初始位置和上一个相同的问题…………
			// !很新的设置style的方式！
			// setDetailImgStyle({ left: originImgClientRects.left + "px", top: originImgClientRects.top + "px", width: originImgClientRects.width + "px", height: originImgClientRects.height + "px" });
			if (originTarget.src !== emptySrc)
				detailImg.src = originTarget.src;
			// setDetailImgSrc(originTarget.src);
			// originTarget.classList.add('hidden');
			// !艹不能hidden不然getclientrects就get不到了…………
			originTarget.src = emptySrc;
			setTimeout(() => {
				if (!detailWinOpen) return;
				detailImg.classList.add("w-[800px]", "left-1/2", "top-1/2", "-translate-x-1/2", "-translate-y-1/2");
				detailImg.style.cssText = "height:100%";
				// setDetailImgStyle({ height: '100%' })
				// !似乎不能直接"xx xx xx "……必须用string[]的形式
				// console.log("50ms\tLeft", detailImg.clientLeft, " | Top", detailImg.clientTop)
				// console.log("50ms\t", detailImg.classList);
			}, 50)
			setTimeout(() => {
				if (!detailWinOpen) return;
				detailImg.style.cssText = '';
				// setDetailImgStyle({})
				// console.log("150ms\tLeft", detailImg.clientLeft, " | Top", detailImg.clientTop)
			}, 150)
			setTimeout(() => {
				if (!detailWinOpen) return;
				const finalHeight = detailImg.clientHeight + "px";
				detailImg.style.cssText = `height:${finalHeight};`
				isReachCenter = true;
				// console.log("500ms\tLeft", detailImg.clientLeft, " | Top", detailImg.clientTop)
				// console.log("500ms\t", detailImg.classList);
				// setDetailImgStyle({ height: finalHeight })
			}, 500)
		}
		else {
			// animationTimer.forEach(timer => clearTimeout(timer))
			// animationTimer = [];

			// !注意此时点击的target不是原图了
			originImgClientRects = originTarget.getClientRects()[0];
			// !艹哈哈哈哈哈再读取一次不就解决了吗哈哈哈哈哈哈哈
			detailImg.classList.remove("w-[800px]", "left-1/2", "top-1/2", "-translate-x-1/2", "-translate-y-1/2");
			detailImg.style.cssText = `left:${originImgClientRects.left}px;top:${originImgClientRects.top}px;width:${originImgClientRects.width}px;height:${originImgClientRects.height}px;`;
			// setDetailImgStyle({ left: originImgClientRects.left + "px", top: originImgClientRects.top + "px", width: originImgClientRects.width + "px", height: originImgClientRects.height + "px" });
			setDetailWinOpen(detailWinOpen);
			// const timer = setInterval(() => {
			// !不搞什么打断动画了…………用这个检测极大概率导致打断时丢失src………………
			// setTimeout(() => {
			// 	originImgClientRects = originTarget.getClientRects()[0];
			// 	detailImg.style.cssText = `left:${originImgClientRects.left}px;top:${originImgClientRects.top}px;width:${originImgClientRects.width}px;height:${originImgClientRects.height}px;`;
			// }, 400)
			// !想修复黑屏过渡后恢复位置由于原位置scale而没有准确恢复到原位的问题但是这样会导致卡顿……算了…………
			if (!isReachCenter && detailImg.src !== emptySrc) {
				originTarget.src = detailImg.src;
			}
			setTimeout(() => {
				// originImgClientRects = originTarget.getClientRects()[0];
				// if (originTarget.clientLeft === originImgClientRects.left && originTarget.clientTop === originImgClientRects.top) {
				if (detailImg.src !== emptySrc)
					originTarget.src = detailImg.src;
				// !是React的原因吗这里如果还原src会导致丢失…………
				detailImg.src = emptySrc;
				// setDetailImgSrc(emptySrc);
				detailImg.style.cssText = '';
				// clearInterval(timer);
				// ！！！！！！！！！！！！终于定位问题！！！！！！
				// !这个bug极其怪异，每次点击一定是从上一个图片的地方出发！稳定触发！
				// !一直以为是没有成功设置style，试了各种方法，用了style.left, cssText, hook.都不行
				// !而且调试的时候更加奇怪只要一步步调试就没问题，但是一跳过就废
				// !所以其实问题就是在于style变太快了而上次的结束位置没有清空！！！！！！！！！！！
				// originTarget.classList.remove('hidden');
			}, 500)
		}
	}
	window.electron.ipcRenderer.on('update-record-data', (events, arg) => { setRecordData(arg); console.log("render update-record-data ", arg) });
	return (
		<div className="w-full h-[calc(100vh-32px)] px-5 py-4 relative overflow-y-scroll select-none flex flex-col">
			{/* //!这里加一个overflow-y-scroll就可以防止滚动条覆盖标题栏了哈哈（本质就是body不需要滚动） */}
			{/* //！FT：使填充剩余空间的方法
			// ! flex-1
			// ! display:table + display-row + height:32px & 100%
			// ! calc(100vh-32px)（现用）*/}
			{recordData.map((recordData, index) => <RecordsGroup displaySize={displaySize} setDisplaySize={setDisplaySize} handleDetailWinOpen={handleDetailWinOpen} recordData={recordData} />)}
			{/* <IconButton className='w-14 h-14' sx={{ position: 'fixed', top: '40px', right: '40px' }}>
				<Check />
			</IconButton> */}
			<Button size='medium' variant='contained' style={{ width: '300px', marginLeft: 'auto', marginRight: 'auto' }} >加载更多</Button>
			<button className='w-14 h-14 fixed top-14 right-10 rounded-full bg-blue-400 transition-all shadow-2xl hover:scale-110 active:bg-blue-500 active:scale-90 ring-0' title='Confirm'><Check style={{ width: '30px', height: '30px' }} /></button>
			{/* //!这个Check的Icon属性的width和height虽然有但是无效还得用style*/}
			{/* //!absolute top-10 right-10 这些无法在class内定义*/}
			<div className={`w-screen  h-[calc(100vh-32px)] fixed z-10 top-8 left-0 ${!detailWinOpen && 'pointer-events-none'}`} onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
				// @ts-ignore
				handleDetailWinOpen(e.target.children[1] as HTMLImageElement, false)
			}} >
				{/* //!解决下面背景阴影没有动画的问题！就是这个hidden！改成poiter-events-none解决！ */}
				<div className={`w-full h-full backdrop-blur-2xl transition-all duration-500 ${detailWinOpen ? 'opacity-50' : 'opacity-0'}`} style={{ backgroundColor: 'rgb(0,0,0)' }}></div>
				{/* // !注意这种遮罩的不能包含下面的元素不然opacity一起影响了 */}
				<img id="detailImg" src={emptySrc} alt="" className="rounded-2xl fixed object-cover transition-all duration-500" onClick={(e) => handleDetailWinOpen(e.target as HTMLImageElement, false)} />
				{/* //~~似乎这种居中方式当窗口大小变化时会反应迟钝…………额flex也一样的算了 */}
				{/* <div className="bg-gray-900 w-[800px] h-[600px] rounded-2xl object-cover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div> */}
			</div>

		</div >
	)
}

