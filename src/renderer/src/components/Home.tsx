import { useEffect, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { Check } from '@mui/icons-material';
import RecordsGroup from './HomeStream/RecordsGroup';
type recordGroupData =
	{
		dateTitle: string,
		recordData: Array<{ name: string, checked: boolean }>
		// recordData: [{name:string, checked:boolean}]
		// !不能这样…………不然只允许一个元素……
	}
type data = Array<recordGroupData>
const emptySrc = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const data: data = [
	{
		dateTitle: "2024.07.11 13:04",
		recordData: [
			{ name: "Yuan Shen 原神 23.06.19 - 08.03生日礼物.png", checked: false },
			{ name: "Yuan Shen 原神  2023.07.05 ？？？卡出了奇怪的界面.png", checked: false },
			{ name: '', checked: false }, { name: '', checked: false }, { name: '', checked: false }, { name: '', checked: false },

		]
	},
	{
		dateTitle: "2024.07.12 22:00",
		recordData: [
			{ name: "Yuan Shen 原神 23.06.19 - 08.03生日礼物.png", checked: false },
			{ name: '', checked: false }, { name: '', checked: false },

		]
	},
	{
		dateTitle: "2024.07.13 00:00",
		recordData: [
			{ name: "Yuan Shen 原神 23.06.19 - 08.03生日礼物.png", checked: false },
			{ name: '', checked: false }, { name: '', checked: false }, { name: '', checked: false },

		]
	},
]
var originTarget: HTMLImageElement, originImgClientRects: ClientRect, detailImgPosition: { left: string, top: string, width: string, height: string };
export default function Home() {
	const [displaySize, setDisplaySize] = useState(1)
	const [detailWinOpen, setDetailWinOpen] = useState(false);
	const [detailImgSrc, setDetailImgSrc] = useState("")
	// @ts-ignore
	useEffect(() => { window.store.get("displaySize").then(res => setDisplaySize(res)) }, [])
	function handleDetailWinOpen(target: HTMLImageElement, detailWinOpen: boolean) {
		const detailImg = document.getElementById("detailImg") as HTMLImageElement;
		if (detailWinOpen) {
			setDetailWinOpen(detailWinOpen);
			// originTarget = e.target as HTMLDivElement;
			originTarget = target;
			originTarget.classList.remove('hover:scale-110')
			originImgClientRects = originTarget.getClientRects()[0];
			detailImgPosition = {
				// !这样读取的并不是实时位置…………事实上这四个属性（这里只保留了width）甚至是""…………
				// left: originTarget.style.width,

				left: originImgClientRects.left + "px",
				top: originImgClientRects.top + "px",
				width: originImgClientRects.width + "px",
				height: originImgClientRects.height + "px"

				// left: originTarget.offsetLeft + "px",
				// !这个是相对包含快的位置


			}
			// !断言！
			// const target: HTMLElement = e.target;
			// !报错有292项不存在哈哈

			detailImg.style.cssText = `left:${detailImgPosition.left};top:${detailImgPosition.top};width:${detailImgPosition.width};height:${detailImgPosition.height};`;
			// !很新的设置style的方式！
			// detailImg.src = originTarget.src;
			setDetailImgSrc(originTarget.src);
			// originTarget.classList.add('hidden');
			// !艹不能hidden不然getclientrects就get不到了…………
			// (originTarget as HTMLImageElement).src = emptySrc;
			setTimeout(() => {
				if (!detailWinOpen) return;
				detailImg.classList.add("w-[800px]", "left-1/2", "top-1/2", "-translate-x-1/2", "-translate-y-1/2");
				detailImg.style.cssText = "height:100%";
				// !似乎不能直接"xx xx xx "……必须用string[]的形式
			}, 50)
			setTimeout(() => {
				if (!detailWinOpen) return;
				detailImg.style.cssText = '';
			}, 150)
			setTimeout(() => {
				if (!detailWinOpen) return;
				const finalHeight = detailImg.clientHeight + "px";
				detailImg.style.cssText = `height:${finalHeight};`
			}, 500)
		}
		else {
			// !注意此时点击的target不是原图了
			originImgClientRects = originTarget.getClientRects()[0];
			detailImgPosition = {
				left: originImgClientRects.left + "px",
				top: originImgClientRects.top + "px",
				width: originImgClientRects.width + "px",
				height: originImgClientRects.height + "px"
			}
			// !艹哈哈哈哈哈再读取一次不就解决了吗哈哈哈哈哈哈哈
			detailImg.classList.remove("w-[800px]", "left-1/2", "top-1/2", "-translate-x-1/2", "-translate-y-1/2");
			detailImg.style.cssText = `left:${detailImgPosition.left};top:${detailImgPosition.top};width:${detailImgPosition.width};height:${detailImgPosition.height};`;
			setTimeout(() => {
				if (detailWinOpen) return;
				(originTarget as HTMLImageElement).src = detailImgSrc;
				// !是React的原因吗这里如果还原src会导致丢失…………
				// detailImg.src = emptySrc;
				setDetailImgSrc(emptySrc);
				// originTarget.classList.remove('hidden');
				setDetailWinOpen(detailWinOpen);
			}, 500)
		}
	}

	return (
		<div className="w-full h-[calc(100vh-32px)] px-5 py-4 relative overflow-y-scroll select-none flex flex-col">
			{/* //!这里加一个overflow-y-scroll就可以防止滚动条覆盖标题栏了哈哈（本质就是body不需要滚动） */}
			{/* //！FT：使填充剩余空间的方法
			// ! flex-1
			// ! display:table + display-row + height:32px & 100%
			// ! calc(100vh-32px)（现用）*/}
			{data.map((recordData, index) => <RecordsGroup displaySize={displaySize} setDisplaySize={setDisplaySize} detailImgSrc={detailImgSrc} handleDetailWinOpen={handleDetailWinOpen} recordData={recordData} />)}
			{/* <IconButton className='w-14 h-14' sx={{ position: 'fixed', top: '40px', right: '40px' }}>
				<Check />
			</IconButton> */}
			<Button size='medium' variant='contained' style={{ width: '300px', marginLeft: 'auto', marginRight: 'auto' }} >加载更多</Button>
			<button className='w-14 h-14 fixed top-14 right-10 rounded-full bg-blue-400 transition-all shadow-2xl hover:scale-110 active:bg-blue-500 active:scale-90 ring-0' title='Confirm'><Check style={{ width: '30px', height: '30px' }} /></button>
			{/* //!这个Check的Icon属性的width和height虽然有但是无效还得用style*/}
			{/* //!absolute top-10 right-10 这些无法在class内定义*/}
			<div className={`w-screen  h-[calc(100vh-32px)] fixed z-10 top-8 left-0 ${!detailWinOpen && 'pointer-events-none'}`} onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleDetailWinOpen(e.target.children[1] as HTMLImageElement, false)} >
				{/* //!解决下面背景阴影没有动画的问题！就是这个hidden！改成poiter-events-none解决！ */}
				<div className={`w-full h-full backdrop-blur-2xl transition-all duration-500 ${detailWinOpen ? 'opacity-50' : 'opacity-0'}`} style={{ backgroundColor: 'rgb(0,0,0)' }}></div>
				{/* // !注意这种遮罩的不能包含下面的元素不然opacity一起影响了 */}
				<img id="detailImg" src={detailImgSrc} alt="" className="rounded-2xl fixed object-cover transition-all duration-500" onClick={(e) => handleDetailWinOpen(e.target as HTMLImageElement, false)} />
				{/* //~~似乎这种居中方式当窗口大小变化时会反应迟钝…………额flex也一样的算了 */}
				{/* <div className="bg-gray-900 w-[800px] h-[600px] rounded-2xl object-cover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div> */}
			</div>

		</div >
	)
}

