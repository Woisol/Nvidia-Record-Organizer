export default function clearSlection() {
	let curRecordGroup: HTMLDivElement | null;
	for (let i = 0; ; i++) {
    curRecordGroup = document.getElementById(`records-group-${i}`) as HTMLDivElement;
    if (!curRecordGroup) break;
    for (const child of curRecordGroup.children) {
		const checkbox = (child.children[2]?.children[0].children[0] as HTMLInputElement)
		if (checkbox && checkbox.checked === true) {
			checkbox.click();
		}
    }
	}
}
