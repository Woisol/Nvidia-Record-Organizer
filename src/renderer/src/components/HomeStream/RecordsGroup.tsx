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
export default function RecordsGroup({ displaySize, setDisplaySize, recordData }: recordData) {
	return (
		<div className="w-full h-fit mb-3 px-4 py-2 rounded-2xl bg-gray-100">
			<p className="w-1/3 border-b-2 border-gray-300 mb-2">{recordData.dateTitle}</p>
			<div className="w-fit relative flex flex-wrap gap-3">
				{recordData.recordData.map((item, index) => (
					<Record displaySize={displaySize} setDisplaySize={setDisplaySize} RecordData={item} />
				))}
			</div>
		</div>
	)
}