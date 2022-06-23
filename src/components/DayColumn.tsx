import { nanoid } from 'nanoid';
import { PointerEvent, useEffect, useRef, useState } from 'react';
import { COLUMN_HEIGHT, GRID_LINE_HEIGHTS } from '../lib/constants';
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
	onDrag: (e: PointerEvent<HTMLDivElement>, timeslot: ITimeslot) => void;
	onResizeTop: (e: PointerEvent<HTMLDivElement>, timeslot: ITimeslot) => void;
	onResizeBottom: (
		e: PointerEvent<HTMLDivElement>,
		timeslot: ITimeslot
	) => void;
	// containerRef: React.RefObject<HTMLDivElement>;
}

export default function DayColumn({
	weekday,
	onDrag,
	onResizeTop,
	onResizeBottom,
}: IProps) {
	const [timeslots, setTimeslots] = useState<ITimeslot[]>([]);

	const columnRef = useRef<HTMLDivElement>(null);

	function handleColumnClick(e: any) {
		// console.log(e);
		const timeClicked = yPosToTime(
			e.detail.yPos || e.clientY,
			COLUMN_HEIGHT,
			getElementRect(columnRef).top + 4
			// getElementRect(columnRef).top
		);

		// console.log({ timeClicked });

		const hitSomething = timeslots.find(
			slot => timeClicked >= slot.start && timeClicked <= slot.end
		);

		if (hitSomething) {
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
		// setTimeslots(newTimeslots);

		handleTimeslotsMerge(newTimeSlot, newTimeslots, setTimeslots);
	}

	const handleSlotsChange = (e: any) => {
		const { yPos, yMovement, timeslot: slot, columnHeight } = e.detail;
		const { id, start, end } = slot;

		const { height } = document
			.querySelector(`#${id}`)
			?.getBoundingClientRect()!;

		const timeClicked = yPosToTime(
			e.detail.yPos,
			getElementRect(columnRef).height,
			getElementRect(columnRef).top
		);

		const bottom = yPosToTime(
			e.detail.yPos - height,
			getElementRect(columnRef).height,
			getElementRect(columnRef).top
		);

		const newSlot: ITimeslot = {
			id,
			start: timeClicked,
			end: bottom,
		};

		setTimeslots(ts => [...ts.filter(s => s.id !== newSlot.id), newSlot]);
	};

	useEffect(() => {
		window.addEventListener(
			`timeslotDragged:${weekday}`,
			handleSlotsChange
		);

		return () => {
			window.removeEventListener(
				`timeslotDragged:${weekday}`,
				handleSlotsChange
			);
		};
	}, []);

	useEffect(() => console.log(timeslots), [timeslots]);

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
						key={nanoid()}
						style={{
							top: timeToYPos(H, COLUMN_HEIGHT),
						}}
					/>
				))}

				{timeslots.map(slot => (
					<TimeSlot
						key={slot.id}
						timeslot={slot}
						onDrag={onDrag}
						onResizeTop={onResizeTop}
						onResizeBottom={onResizeBottom}
					/>
				))}
			</div>
		</div>
	);
}
