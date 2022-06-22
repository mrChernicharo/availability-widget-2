import { PointerEvent, useEffect, useState } from 'react';
import { timeToYPos } from '../lib/helpers';
import { ITimeslot } from '../lib/types';

interface ITimeSlotProps {
	timeslot: ITimeslot;
	availableHeight: number;
	onDrag: (e: PointerEvent<HTMLDivElement>, timeslot: ITimeslot) => void;
	onResizeTop: (e: PointerEvent<HTMLDivElement>, timeslot: ITimeslot) => void;
	onResizeBottom: (
		e: PointerEvent<HTMLDivElement>,
		timeslot: ITimeslot
	) => void;
}

export default function TimeSlot({
	timeslot,
	availableHeight,
	onDrag,
	onResizeTop,
	onResizeBottom,
}: ITimeSlotProps) {
	const [top, setTop] = useState('-1000px');
	const [height, setHeight] = useState('0px');
	const { start, end } = timeslot;

	useEffect(() => {
		setTop(timeToYPos(start, availableHeight) + 'px');
		setHeight(
			timeToYPos(end, availableHeight) -
				timeToYPos(start, availableHeight) +
				'px'
		);
	}, [availableHeight]);

	return (
		<div className="time-slot" style={{ top, height }}>
			<div
				className="top-drag-area"
				onPointerDown={(e: PointerEvent<HTMLDivElement>) =>
					onResizeTop(e, timeslot)
				}
			></div>
			<div
				className="central-area"
				onPointerDown={(e: PointerEvent<HTMLDivElement>) =>
					onDrag(e, timeslot)
				}
			></div>
			<div
				className="bottom-drag-area"
				onPointerDown={(e: PointerEvent<HTMLDivElement>) =>
					onResizeBottom(e, timeslot)
				}
			></div>
		</div>
	);
}
