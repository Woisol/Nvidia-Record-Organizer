import React, { useState } from "react";
import Record from "./Record"
type recordData = {
	displaySize: number,
	setDisplaySize: React.Dispatch<React.SetStateAction<number>>,
	// !woq自己补全出来的
	recordData: {
		dateTitle: string,
		recordData: Array<{ name: string, checked: boolean }>
	}
}
var originTarget: HTMLDivElement, detailImgClientRects: ClientRect, detailImgPosition: { left: string, top: string, width: string, height: string };
export default function RecordsGroup({ displaySize, setDisplaySize, recordData }: recordData) {
	const [detailWinOpen, setDetailWinOpen] = useState(false);
	function handleDetailWinOpen(e: React.MouseEvent<HTMLDivElement, MouseEvent>, detailWinOpen: boolean) {
		const detailImg = document.getElementById("detailImg") as HTMLImageElement;
		if (detailWinOpen) {
			setDetailWinOpen(detailWinOpen);
			originTarget = e.target as HTMLDivElement;
			originTarget.classList.remove('hover:scale-110')
			detailImgClientRects = originTarget.getClientRects()[0];
			detailImgPosition = {
				// !这样读取的并不是实时位置…………事实上这四个属性（这里只保留了width）甚至是""…………
				// left: originTarget.style.width,

				left: detailImgClientRects.left + "px",
				top: detailImgClientRects.top + "px",
				width: detailImgClientRects.width + "px",
				height: detailImgClientRects.height + "px"

				// left: originTarget.offsetLeft + "px",
				// !这个是相对包含快的位置


			}
			// !断言！
			// const target: HTMLElement = e.target;
			// !报错有292项不存在哈哈

			detailImg.style.cssText = `left:${detailImgPosition.left};top:${detailImgPosition.top};width:${detailImgPosition.width};height:${detailImgPosition.height};`;
			// !很新的设置style的方式！
			detailImg.src = (originTarget as HTMLImageElement).src;
			(originTarget as HTMLImageElement).src = "";
			setTimeout(() => {
				detailImg.classList.add("w-[800px]", "left-1/2", "top-1/2", "-translate-x-1/2", "-translate-y-1/2");
				// !似乎不能直接"xx xx xx "……必须用string[]的形式
				detailImg.style.cssText = "";
			}, 10)
		}
		else {
			// !注意此时点击的target不是原图了
			detailImgClientRects = originTarget.getClientRects()[0];
			detailImgPosition = {
				left: detailImgClientRects.left + "px",
				top: detailImgClientRects.top + "px",
				width: detailImgClientRects.width + "px",
				height: detailImgClientRects.height + "px"
			}
			// !艹哈哈哈哈哈再读取一次不就解决了吗哈哈哈哈哈哈哈
			detailImg.classList.remove("w-[800px]", "left-1/2", "top-1/2", "-translate-x-1/2", "-translate-y-1/2");
			detailImg.style.cssText = `left:${detailImgPosition.left};top:${detailImgPosition.top};width:${detailImgPosition.width};height:${detailImgPosition.height};`;
			setTimeout(() => {
				(originTarget as HTMLImageElement).src = detailImg.src;
				setDetailWinOpen(detailWinOpen);
			}, 300)
		}
	}
	console.log("DetailWindow is ", `${detailWinOpen ? 'Open' : 'Close'}`)
	return (
		<>
			<div className="w-full h-fit mb-3 px-4 py-2 rounded-2xl bg-gray-100">
				<p className="w-1/3 border-b-2 border-gray-300 mb-2">{recordData.dateTitle}</p>
				<div className="w-fit relative flex flex-wrap gap-3">
					{recordData.recordData.map((item, index) => (
						<Record displaySize={displaySize} setDisplaySize={setDisplaySize} handleDetailWinOpen={handleDetailWinOpen} RecordData={item} />
					))}
				</div>
			</div>
			<div className={`w-screen  h-[calc(100vh-32px)] fixed z-10 top-8 left-0 ${!detailWinOpen && 'hidden'}`} >
				<div className={`w-full h-full bg-gray-900 backdrop-blur-2xl transition-all duration-300 ${detailWinOpen ? 'opacity-0' : 'opacity-50'}`}></div>
				{/* // !注意这种遮罩的不能包含下面的元素不然opacity一起影响了 */}
				<img id="detailImg" src='' alt="" className="rounded-2xl fixed object-cover transition-all duration-300" onClick={(e) => handleDetailWinOpen(e, false)} />
				{/* //~~似乎这种居中方式当窗口大小变化时会反应迟钝…………额flex也一样的算了 */}
				{/* <div className="bg-gray-900 w-[800px] h-[600px] rounded-2xl object-cover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div> */}
			</div>
		</>

	)
}