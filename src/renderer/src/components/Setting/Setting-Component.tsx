import { Slider, Switch, TextField } from "@mui/material"
import { useState } from "react"

type SettingProps = {
	type: 'switch' | 'number' | 'slider',
	value: any,
	setValue: (value: any) => void,
	// error?: boolean,
	title: string,
	subTitle: string,
}
const marks = [
	{
		value: 0,
		label: '偏小',

	},
	{
		value: 1,
		label: '中等',
	},
	{
		value: 2,
		label: '偏大',
	}
]
export default function SettingComponent({ type, value, setValue, title, subTitle }: SettingProps) {
	var settingView
	switch (type) {
		case 'switch':
			settingView = <div className="w-10 absolute right-2">
				{/* //!艹哈哈哈遇事不决，div解决哈哈哈 */}
				{/* style={{ width: '40px', position: "absolute", right: '-10px' }}  */}
				<Switch checked={value} onChange={(e) => setValue(e.target.checked)} />
			</div>
			break;
		case 'number':
			const [innerValue, setInnerValue] = useState(value)
			if (value != 0 && value !== innerValue) setInnerValue(value)
			const [error, setError] = useState(false)
			const [errMsg, setErrMsg] = useState('')
			settingView = <div className="w-10 h-8 absolute right-2">
				<TextField sx={{ width: '80px', position: "absolute", right: '0px', textAlign: 'center' }} type="number" variant="outlined" size="small" value={value} error={error} helperText={error ? errMsg : ''}
					onChange={(e) => {
						// setInnerValue(e.target.value)
						// if (e.target.value === '') {
						// 	setError(true)
						// 	setErrMsg('不能为空！')
						// 	// this.setAttribute('aria-invalid', 'true')
						// 	return
						// }
						// else if (title === '最大回放组加载数') {
						// 	const num = parseInt(e.target.value)
						// 	if (num < 1) {
						// 		setError(true)
						// 		setErrMsg('最小值为1！')
						// 	}
						// 	else if (num > 20) {
						// 		setError(true)
						// 		setErrMsg('加载太多组可能会导致卡顿')
						// 	}
						// }
						// // !这…………就但凡有判断都要卡顿吗…………那只能在里面搞state了？
						// setError(false)
						setValue(e.target.value)
					}} aria-label={title} />
			</div>
			// settingView = <input className="w-10 h-5 text-center absolute right-0 active:ring-0" type="number" value={value} onChange={(e) => setValue(e.target.value)} aria-label={title} />
			break;
		case 'slider':
			settingView = <Slider style={{ width: '150px', position: "absolute", right: '0px' }} value={value} onChange={(e, v) => setValue(v)} aria-label={title}
				min={0} max={2} step={1} marks={marks} ></Slider>
			break;
	}
	return (
		<div className="w-full flex relative ">
			<div className="w-fit flex flex-col">
				<p className="h-5 text-2xl">{title}</p>
				<p className="text-sm text-gray-400">{subTitle}</p>
			</div>
			{/*//!并不能直接在return内部使用…… { switch (type) {}} */}
			{/* <button>1</button> */}
			{settingView}
		</div>
	)

}