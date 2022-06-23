import { debounce } from 'lodash';
import { PointerEvent, useEffect, useRef, useState } from 'react';
import { COLUMN_HEIGHT, GRID_LINE_HEIGHTS } from '../lib/constants';
import {
	getElementRect,
	handleTimeslotsMerge,
	idMaker,
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

		const newTimeSlot = {
			id: idMaker(),
			start: slotStart,
			end: slotEnd,
		} as ITimeslot;

		const newTimeslots = [...timeslots, newTimeSlot];

		handleTimeslotsMerge(newTimeSlot, newTimeslots, setTimeslots);
	}

	const handleSlotsChange = (e: any) => {
		const { timeslot: slot, yPos } = e.detail;
		const { id } = slot;

		const { height } = document
			.querySelector(`#${id}`)
			?.getBoundingClientRect()!;

		if (!height) return;

		let newStart = yPosToTime(
			yPos - height,
			getElementRect(columnRef).height,
			getElementRect(columnRef).top
		);

		let newEnd = yPosToTime(
			yPos,
			getElementRect(columnRef).height,
			getElementRect(columnRef).top
		);

		if (newStart < 0) return;
		if (newStart > 1440 - height) return;
		if (newEnd < height) return;
		if (newEnd > 1440) return;

		const newSlot: ITimeslot = {
			id,
			start: newStart,
			end: newEnd,
		};

		setTimeslots(ts => {
			const newSlots = [...ts.filter(s => s.id !== newSlot.id), newSlot];

			const slotsUpdated = new CustomEvent(`timeslotsMerge::${weekday}`, {
				detail: { newSlots, newSlot },
			});
			window.dispatchEvent(slotsUpdated);

			return newSlots;
		});
	};

	function handleSlotsMerge(e: any) {
		const { newSlots, newSlot } = e.detail;

		handleTimeslotsMerge(newSlot, newSlots, setTimeslots);
	}

	useEffect(() => {
		window.addEventListener(
			`timeslotDragged:${weekday}`,
			handleSlotsChange
		);

		window.addEventListener(
			`timeslotsMerge::${weekday}`,
			debounce(handleSlotsMerge, 200)
		);

		return () => {
			window.removeEventListener(
				`timeslotDragged:${weekday}`,
				handleSlotsChange
			);

			window.removeEventListener(
				`timeslotsMerge::${weekday}`,
				handleSlotsMerge
			);
		};
	}, []);

	useEffect(() => {
		console.log(timeslots);
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
						key={idMaker()}
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
