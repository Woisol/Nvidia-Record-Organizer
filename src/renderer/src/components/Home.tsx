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
const data: data = [
	{
		dateTitle: "2024.07.11 13:04",
		recordData: [
			{ name: "Yuan Shen 原神 23.06.19 - 08.03生日礼物.png", checked: false },
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
export default function Home() {
	const [displaySize, setDisplaySize] = useState(1)
	// @ts-ignore
	useEffect(() => { window.store.get("displaySize").then(res => setDisplaySize(res)) }, [])
	return (
		<div className="w-full h-[calc(100vh-32px)] px-5 py-4 relative overflow-y-scroll select-none flex flex-col">
			{/* //!这里加一个overflow-y-scroll就可以防止滚动条覆盖标题栏了哈哈（本质就是body不需要滚动） */}
			{/* //！FT：使填充剩余空间的方法
			// ! flex-1
			// ! display:table + display-row + height:32px & 100%
			// ! calc(100vh-32px)（现用）*/}
			{data.map((recordData, index) => <RecordsGroup displaySize={displaySize} setDisplaySize={setDisplaySize} recordData={recordData} />)}
			{/* <IconButton className='w-14 h-14' sx={{ position: 'fixed', top: '40px', right: '40px' }}>
				<Check />
			</IconButton> */}
			<Button size='medium' variant='contained' style={{ width: '300px', marginLeft: 'auto', marginRight: 'auto' }} >加载更多</Button>
			<button className='w-14 h-14 fixed top-14 right-10 rounded-full bg-blue-400 transition-all shadow-2xl hover:scale-110 active:bg-blue-500 active:scale-90 ring-0' title='Confirm'><Check style={{ width: '30px', height: '30px' }} /></button>
			{/* //!这个Check的Icon属性的width和height虽然有但是无效还得用style*/}
			{/* //!absolute top-10 right-10 这些无法在class内定义*/}
		</div >
	)
}

