import { useEffect, useMemo, useRef, useState } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import { COLUMN_HEIGHT } from '../lib/constants';
import { setCSSVariable } from '../lib/helpers';
import DayColumn from './DayColumn';

export default function AvailabilityWidget() {
	const { windowHeight } = useWindowSize();
	const containerRef = useRef<HTMLDivElement>(null);
	const [columnHeight, setColumnHeight] = useState(0);

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

	return (
		<div className="availability-widget">
			<h1>Availability Widget</h1>

			<div ref={containerRef} className="columns-container">
				<DayColumn weekday="monday" availableHeight={columnHeight} />
				<DayColumn weekday="tuesday" availableHeight={columnHeight} />
				<DayColumn weekday="wednesday" availableHeight={columnHeight} />
				{/* <DayColumn weekday="thursday" availableHeight={columnHeight} /> */}
				{/* <DayColumn weekday="friday" availableHeight={columnHeight} /> */}
				{/* <DayColumn weekday="saturday" availableHeight={columnHeight} /> */}
				{/* <DayColumn weekday="sunday" availableHeight={columnHeight} /> */}
				{/* <DayColumn weekday="tuesday" containerRef={containerRef} /> */}
			</div>
		</div>
	);
}
