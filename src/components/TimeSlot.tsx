import { useEffect, useState } from 'react';
import { timeToYPos } from '../lib/helpers';
import { ITimeslot } from '../lib/types';

interface ITimeSlotProps {
	timeslot: ITimeslot;
	availableHeight: number;
}

export default function TimeSlot({
	timeslot,
	availableHeight,
}: ITimeSlotProps) {
	const [top, setTop] = useState('0px');
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
			<div className="top-drag-area"></div>
			<div className="central-area"></div>
			<div className="bottom-drag-area"></div>
		</div>
	);
}
