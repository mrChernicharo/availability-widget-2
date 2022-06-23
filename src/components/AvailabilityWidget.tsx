import { PointerEvent, useEffect, useRef } from 'react';
import { WEEKDAYS } from '../lib/constants';
import { createTimeslotDraggedEvent, idMaker } from '../lib/helpers';
import { ITimeslot } from '../lib/types';
import DayColumn from './DayColumn';

export default function AvailabilityWidget() {
	const containerRef = useRef<HTMLDivElement>(null);
	const isResizingTop = useRef(false);
	const isResizingBottom = useRef(false);
	const isDragging = useRef(false);
	const selectedDay = useRef('');
	const selectedTimeslot = useRef<null | ITimeslot>(null);

	// GOTTA REFAC THIS HEIGHT/HEIGHT RESIZE LOGIC !!!
	// GOTTA REFAC THIS HEIGHT/HEIGHT RESIZE LOGIC !!!
	// GOTTA REFAC THIS HEIGHT/HEIGHT RESIZE LOGIC !!!

	function handlePointerMove(e: any) {
		// resizing top
		if (isResizingTop.current) {
			console.log(e.clientY, 'resizing top');
		}

		// resizing bottom
		if (isResizingBottom.current) {
			console.log(e.clientY, 'resizing bottom');
		}

		// dragging
		if (isDragging.current) {
			const timeslotDragEvent = createTimeslotDraggedEvent(
				e.clientY,
				selectedTimeslot.current!,
				selectedDay.current!
			);

			window.dispatchEvent(timeslotDragEvent);
		}
	}

	function handlePointerUp(e: any) {
		console.log('document:handlePointerUp', e);

		isDragging.current = false;
		isResizingTop.current = false;
		isResizingBottom.current = false;
		selectedDay.current = '';
		selectedTimeslot.current = null;
	}

	function handleDrag(
		e: PointerEvent<HTMLDivElement>,
		timeslot: ITimeslot,
		weekday: string
	) {
		selectedDay.current = weekday;
		isDragging.current = true;
		selectedTimeslot.current = { ...timeslot };
		// setCursor('move');
	}

	function handleResizeTop(
		e: PointerEvent<HTMLDivElement>,
		timeslot: ITimeslot
	) {
		e.stopPropagation();

		console.log('topThumb:pointerdown', e, { timeslot });

		isResizingTop.current = true;
		// setCursor('row-resize');
	}

	function handleResizeBottom(
		e: PointerEvent<HTMLDivElement>,
		timeslot: ITimeslot
	) {
		e.stopPropagation();
		console.log('bottomThumb:pointerdown', e, { timeslot });

		isResizingBottom.current = true;
		// setCursor('row-resize');
	}

	useEffect(() => {
		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerUp);

		return () => {
			window.removeEventListener(`pointermove`, () => handlePointerMove);
			window.removeEventListener(`pointerup`, () => handlePointerUp);
		};
	}, []);

	// useEffect(() => {
	// 	console.log({ isDragging, isResizingTop, isResizingBottom });
	// }, [isDragging, isResizingTop, isResizingBottom]);

	return (
		<div className="availability-widget">
			<h1>Availability Widget</h1>

			<div ref={containerRef} className="columns-container">
				{WEEKDAYS.map(day => (
					<DayColumn
						key={idMaker()}
						weekday={day}
						onDrag={(e, timeslot) => handleDrag(e, timeslot, day)}
						onResizeTop={handleResizeTop}
						onResizeBottom={handleResizeBottom}
					/>
				))}
			</div>
		</div>
	);
}
