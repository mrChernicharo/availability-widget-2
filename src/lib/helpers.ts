export function getHoursFromTime(time: number) {
	return Math.floor(time / 60);
}

export function getMinutesFromTime(time: number) {
	return Math.floor(time % 60);
}

export function formatTimeUnit(time: number) {
	return time >= 10 ? `${time}` : `0${time}`;
}

export function getFormatedTime(time: number) {
	const [h, m] = [getHoursFromTime(time), getMinutesFromTime(time)];

	return `${formatTimeUnit(h)}:${formatTimeUnit(m)}`;
}

// *************************************************** //

export function timeToYPos(startTime: number, columnHeight: number) {
	const pxPerMinute = columnHeight / 1440;
	const yPos = startTime * pxPerMinute;

	return yPos;
}

export function yPosToTime(
	yPos: number,
	columnHeight: number,
	columnTop: number
) {
	const columnYClick = yPos - columnTop;
	const ClickVerticalPercentage = (columnYClick / columnHeight) * 100;
	const timeClicked = (ClickVerticalPercentage * 1440) / 100;
	return Math.abs(Math.round(timeClicked));
}

// *************************************************  //

export function getElementRect(ref: React.RefObject<HTMLDivElement>) {
	return ref.current?.getBoundingClientRect()!;
}

export function setCSSVariable(key: string, val: string) {
	document.documentElement.style.setProperty(key, val);
}
