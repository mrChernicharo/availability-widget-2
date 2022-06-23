import { nanoid } from 'nanoid';
import { PointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import { COLUMN_HEIGHT, WEEKDAYS } from '../lib/constants';
import { createTimeslotDraggedEvent, setCSSVariable } from '../lib/helpers';
import { ITimeslot } from '../lib/types';
import DayColumn from './DayColumn';

export default function AvailabilityWidget() {
	const { windowHeight } = useWindowSize();
	const containerRef = useRef<HTMLDivElement>(null);
	const [columnHeight, setColumnHeight] = useState(0);
	const isResizingTop = useRef(false);
	const isResizingBottom = useRef(false);
	const isDragging = useRef(false);
	const selectedDay = useRef('');
	const selectedTimeslot = useRef<null | ITimeslot>(null);
	const [cursor, setCursor] = useState('default');

	// GOTTA REFAC THIS HEIGHT/HEIGHT RESIZE LOGIC !!!
	// GOTTA REFAC THIS HEIGHT/HEIGHT RESIZE LOGIC !!!
	// GOTTA REFAC THIS HEIGHT/HEIGHT RESIZE LOGIC !!!

	const getAvailableHeight = useMemo(
		() => Math.min(COLUMN_HEIGHT, windowHeight - 200),
		[windowHeight]
	);

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
			// console.log(
			// 	e.clientY,
			// 	selectedDay.current,
			// 	'dragging',
			// 	selectedTimeslot.current
			// );
			const timeslotDragEvent = createTimeslotDraggedEvent(
				e.clientY,
				e.movementY,
				containerRef.current?.getBoundingClientRect().height!,
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
		// setCursor('default');
	}

	function handleDrag(
		e: PointerEvent<HTMLDivElement>,
		timeslot: ITimeslot,
		weekday: string
	) {
		console.log('resizable:pointerdown', e, { timeslot, weekday });
		selectedDay.current = weekday;
		isDragging.current = true;
		selectedTimeslot.current = timeslot;
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
		setColumnHeight(getAvailableHeight);

		console.log(columnHeight);
	}, [windowHeight]);

	useEffect(() => {
		const heightStr = getAvailableHeight + 'px';
		setCSSVariable('--column-height', heightStr);
	}, [columnHeight]);

	useEffect(() => {
		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerUp);

		return () => {
			window.removeEventListener(`pointermove`, () => {});
			window.removeEventListener(`pointerup`, () => {});
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
						key={nanoid()}
						weekday={day}
						availableHeight={columnHeight}
						onDrag={(e, timeslot) => handleDrag(e, timeslot, day)}
						onResizeTop={handleResizeTop}
						onResizeBottom={handleResizeBottom}
					/>
				))}

				{/* <DayColumn weekday="wednesday" availableHeight={columnHeight} /> */}
				{/* <DayColumn weekday="thursday" availableHeight={columnHeight} /> */}
				{/* <DayColumn weekday="friday" availableHeight={columnHeight} /> */}
				{/* <DayColumn weekday="saturday" availableHeight={columnHeight} /> */}
				{/* <DayColumn weekday="sunday" availableHeight={columnHeight} /> */}
				{/* <DayColumn weekday="tuesday" containerRef={containerRef} /> */}
			</div>
		</div>
	);
}
