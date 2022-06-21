import { nanoid } from 'nanoid';
import { PointerEvent, useEffect, useRef, useState } from 'react';
import { GRID_LINE_HEIGHTS } from '../lib/constants';
import {
	getElementRect,
	handleTimeslotsMerge,
	timeToYPos,
	yPosToTime,
} from '../lib/helpers';
import { ITimeslot } from '../lib/types';
import TimeSlot from './TimeSlot';

interface IProps {
	weekday: string;
	availableHeight: number;
	// containerRef: React.RefObject<HTMLDivElement>;
}

export default function DayColumn({ weekday, availableHeight }: IProps) {
	const [timeslots, setTimeslots] = useState<ITimeslot[]>([]);

	const columnRef = useRef<HTMLDivElement>(null);

	function handleColumnClick(e: PointerEvent<HTMLDivElement>) {
		const timeClicked = yPosToTime(
			e.clientY,
			availableHeight,
			getElementRect(columnRef).top + 4
			// getElementRect(columnRef).top
		);

		console.log({ timeClicked });

		const hitSomething = timeslots.find(
			slot => timeClicked >= slot.start && timeClicked <= slot.end
		);

		if (hitSomething) {
			console.log(
				'HIT!!!',
				timeslots.find(
					slot => timeClicked >= slot.start && timeClicked <= slot.end
				)
			);
			return;
		}

		// are we close to the edges?
		let [slotStart, slotEnd] = [timeClicked - 30, timeClicked + 30];

		if (slotStart < 30) {
			[slotStart, slotEnd] = [0, 60];
		}
		if (slotEnd > 1440) {
			[slotStart, slotEnd] = [1380, 1440];
		}

		// newSlot will span for 1h. The click position will be in the exact middle of the timeSlot
		const newTimeSlot = {
			id: nanoid(),
			start: slotStart,
			end: slotEnd,
		};

		const newTimeslots = [...timeslots, newTimeSlot];

		handleTimeslotsMerge(newTimeSlot, newTimeslots, setTimeslots);
	}

	useEffect(() => {
		console.log(weekday, timeslots);
	}, [timeslots]);

	return (
		<div className="day-column">
			<div className="column-header">
				<h3>{weekday}</h3>
			</div>

			<div
				ref={columnRef}
				className="column-content"
				onPointerDown={handleColumnClick}
			>
				{GRID_LINE_HEIGHTS.map(H => (
					<hr
						style={{
							top: timeToYPos(H, availableHeight),
						}}
					/>
				))}

				{timeslots.map(slot => (
					<TimeSlot
						key={slot.id}
						timeslot={slot}
						availableHeight={availableHeight}
					/>
				))}
			</div>
		</div>
	);
}
