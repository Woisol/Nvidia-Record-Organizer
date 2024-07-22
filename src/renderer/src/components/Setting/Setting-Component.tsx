import { Slider, Switch, TextField } from "@mui/material"
import { useState } from "react"

type SettingProps = {
	type: 'switch' | 'number' | 'slider',
	value: any,
	setValue: (value: any) => void,
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
				<Switch checked={value} onChange={(e) => setValue(e.target.checked)} />
			</div>
			break;
		case 'number':
			const [innerValue, setInnerValue] = useState(value)
			if (value != 0 && value !== innerValue) setInnerValue(value)
			const [error, _setError] = useState(false)
			// td额这个好像没有用到……考虑优化掉吧
			const [errMsg, _setErrMsg] = useState('')
			settingView = <div className="w-10 h-8 absolute right-2">
				<TextField sx={{ width: '80px', position: "absolute", right: '0px', textAlign: 'center' }} type="number" variant="outlined" size="small" value={value} error={error} helperText={error ? errMsg : ''}
					onChange={(e) => {
						setValue(e.target.value)
					}} aria-label={title} />
			</div>
			break;
		case 'slider':
			settingView = <Slider style={{ width: '150px', position: "absolute", right: '0px' }} value={value} onChange={(_e, v) => setValue(v)} aria-label={title}
				min={0} max={2} step={1} marks={marks} ></Slider>
			break;
	}
	return (
		<div className="w-full flex relative ">
			<div className="w-fit flex flex-col">
				<p className="h-7 text-2xl">{title}</p>
				<p className="text-sm text-gray-400">{subTitle}</p>
			</div>
			{settingView}
		</div>
	)

}