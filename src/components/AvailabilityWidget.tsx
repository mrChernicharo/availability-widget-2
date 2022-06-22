import { PointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import { COLUMN_HEIGHT } from '../lib/constants';
import { setCSSVariable } from '../lib/helpers';
import { ITimeslot } from '../lib/types';
import DayColumn from './DayColumn';

export default function AvailabilityWidget() {
	const { windowHeight } = useWindowSize();
	const containerRef = useRef<HTMLDivElement>(null);
	const [columnHeight, setColumnHeight] = useState(0);
	const isResizingTop = useRef(false);
	const isResizingBottom = useRef(false);
	const isDragging = useRef(false);
	const [cursor, setCursor] = useState('default');

	function handlePointerMove(e: PointerEvent) {
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
			console.log(e.clientY, 'dragging');
		}
	}

	function handlePointerUp(e: PointerEvent) {
		console.log('document:handlePointerUp', e);
		isDragging.current = false;
		isResizingTop.current = false;
		isResizingBottom.current = false;
		// setCursor('default');
	}

	function handleDrag(e: PointerEvent<HTMLDivElement>, timeslot: ITimeslot) {
		console.log('resizable:pointerdown', e, { timeslot });

		isDragging.current = true;
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

	const getAvailableHeight = useMemo(
		() => Math.min(COLUMN_HEIGHT, windowHeight - 200),
		[windowHeight]
	);

	useEffect(() => {
		setColumnHeight(getAvailableHeight);
	}, [windowHeight]);

	useEffect(() => {
		const heightStr = getAvailableHeight + 'px';
		setCSSVariable('--column-height', heightStr);
	}, [columnHeight]);

	useEffect(() => {
		// @ts-ignore
		document.addEventListener('pointermove', handlePointerMove);
		// @ts-ignore
		document.addEventListener('pointerup', handlePointerUp);
	}, []);

	// useEffect(() => {
	// 	console.log({ isDragging, isResizingTop, isResizingBottom });
	// }, [isDragging, isResizingTop, isResizingBottom]);

	return (
		<div className="availability-widget">
			<h1>Availability Widget</h1>

			<div ref={containerRef} className="columns-container">
				<DayColumn
					weekday="monday"
					availableHeight={columnHeight}
					onDrag={handleDrag}
					onResizeTop={handleResizeTop}
					onResizeBottom={handleResizeBottom}
				/>
				{/* <DayColumn
					weekday="tuesday"
					availableHeight={columnHeight}
					onDrag={handleDrag}
					onResizeTop={handleResizeTop}
					onResizeBottom={handleResizeBottom}
				/> */}
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
