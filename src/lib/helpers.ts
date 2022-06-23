import { ITimeslot } from './types';

export function pxToTime(yVariation: number, columnHeight: number) {
	const minutePerPx = 1440 / columnHeight;

	// console.log({ columnHeight, minutePerPx, yVariation });
}

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
	return Math.round(timeClicked);
	// return Math.abs(Math.round(timeClicked));
}

// *************************************************  //

export function getElementRect(ref: React.RefObject<HTMLDivElement>) {
	return ref.current?.getBoundingClientRect()!;
}

export function setCSSVariable(key: string, val: string) {
	document.documentElement.style.setProperty(key, val);
}

export function getCSSVariable(key: string) {
	return getComputedStyle(document.documentElement)
		.getPropertyValue(key)
		.trim();
}

// ************************************************** //

export function mergeTimeslots(
	timeSlots: ITimeslot[],
	overlappingIds: string[]
) {
	const overlapping = timeSlots.filter(item =>
		overlappingIds.includes(item.id)
	);

	const mergedSlot = overlapping.reduce(
		(acc, next) => {
			acc = {
				id: idMaker(),
				start: Math.min(acc.start, next.start),
				end: Math.max(acc.end, next.end),
			};
			return acc;
		},
		{
			id: '',
			start: overlapping[0].start,
			end: overlapping[0].end,
		}
	);

	// console.log('mergedSlot', mergedSlot);

	return mergedSlot;
}

export function findOverlappingSlots(
	timeSlot: ITimeslot,
	timeSlots: ITimeslot[]
) {
	if (!timeSlot.start || !timeSlot.end) return;

	const { start, end } = timeSlot;

	// prettier-ignore
	const overlappingItems = timeSlots.filter(
		(s, i) =>
			(start < s.start && start < s.end && end > s.start && end < s.end) || // top overlap
			(start > s.start && start < s.end && end > s.start && end < s.end) || // fit inside
			(start > s.start && start < s.end && end > s.start && end > s.end) || // bottom overlap
			(start < s.start && start < s.end && end > s.start && end > s.end) // encompass
	);
	return overlappingItems;
}

export function handleTimeslotsMerge(
	newTimeSlot: ITimeslot,
	newTimeslots: ITimeslot[],
	callback: any
) {
	const overlappingItems = findOverlappingSlots(newTimeSlot, newTimeslots);

	if (overlappingItems && overlappingItems.length) {
		const overlappingIds = overlappingItems
			.map(item => item.id)
			.concat(newTimeSlot.id);

		const mergedSlot = mergeTimeslots(newTimeslots, overlappingIds);

		const filteredSlots = newTimeslots.filter(
			item => !overlappingIds.includes(item.id)
		);

		const mergedSlots = [...filteredSlots, mergedSlot];

		callback(mergedSlots);
	} else {
		callback(newTimeslots);
	}
}

// ************************************************  //

export const createTimeslotDraggedEvent = (
	yPos: number,
	timeslot: ITimeslot,
	weekday: string
) => {
	return new CustomEvent(`timeslotDragged:${weekday}`, {
		detail: { yPos, timeslot },
	});
};

// *************************************************** //

export function getHoursFromTime(time: number) {
	let res = Math.floor(time / 60);
	if (res === 24) res = 0; // we don't want 24:00
	return Number.isNaN(res) ? 0 : res;
}

export function getMinutesFromTime(time: number) {
	const res = Math.floor(time % 60);
	return Number.isNaN(res) ? 0 : res;
}

export function formatTimeUnit(time: number) {
	return time >= 10 ? `${time}` : `0${time}`;
}

export function getFormatedTime(time: number) {
	const [h, m] = [getHoursFromTime(time), getMinutesFromTime(time)];

	return `${formatTimeUnit(h)}:${formatTimeUnit(m)}`;
}

export function getFormatedTimeFromSlot(slot: ITimeslot) {
	const { start, end } = slot;

	return `${getFormatedTime(start)} - ${getFormatedTime(end)}`;
}

//

const idChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
export const idMaker = () =>
	Array(12)
		.fill(0)
		.map(
			item =>
				idChars.split('')[Math.round(Math.random() * idChars.length)]
		)
		.join('');
