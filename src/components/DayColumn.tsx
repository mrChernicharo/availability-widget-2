import { nanoid } from 'nanoid';
import { PointerEvent, useEffect, useRef, useState } from 'react';
import { GRID_LINE_HEIGHTS } from '../lib/constants';
import {
	getCSSVariable,
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
	availableHeight,
	onDrag,
	onResizeTop,
	onResizeBottom,
}: IProps) {
	const [timeslots, setTimeslots] = useState<ITimeslot[]>([]);

	const columnRef = useRef<HTMLDivElement>(null);

	function handleColumnClick(e: any) {
		console.log(e);
		const timeClicked = yPosToTime(
			e.detail.yPos || e.clientY,
			availableHeight,
			getElementRect(columnRef).top + 4
			// getElementRect(columnRef).top
		);

		console.log({ timeClicked });

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

		handleTimeslotsMerge(newTimeSlot, newTimeslots, setTimeslots);
	}

	const handleSlotsChange =
		// useCallback(
		(e: any) => {
			// why availableHeight == 0 here?
			// can't I closure it up?

			const { yPos, yMovement, timeslot, columnHeight } = e.detail;
			const { id, start, end } = timeslot;

			const { top, height } = getElementRect(columnRef)!;

			const pointerTime = yPosToTime(
				yPos,
				columnHeight,
				// height,
				columnHeight - parseInt(getCSSVariable('--heading-height'))
				// top
			);

			const newSlot: ITimeslot = {
				id,
				start: pointerTime - 30,
				end: pointerTime + 30,
			};

			console.log(e, id, newSlot.id, timeslots);

			handleColumnClick(e);
		};
	// ,
	// [timeslots]
	// )

	useEffect(() => {
		console.log({ availableHeight });
	}, [availableHeight]);

	useEffect(() => {
		console.log(window);

		window.addEventListener(
			`timeslotDragged:${weekday}`,
			handleSlotsChange
		);

		console.log(weekday, timeslots);

		return () => {
			window.removeEventListener(
				`timeslotDragged:${weekday}`,
				handleSlotsChange
			);
		};
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
						key={nanoid()}
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
						onDrag={onDrag}
						onResizeTop={onResizeTop}
						onResizeBottom={onResizeBottom}
					/>
				))}
			</div>
		</div>
	);
}
