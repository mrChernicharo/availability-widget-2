import { useId, useRef, useState } from 'react';
import { ITimeslot } from '../lib/types';
import TimeSlot from './TimeSlot';

interface IProps {
	weekday: string;
	availableHeight: number;
	// containerRef: React.RefObject<HTMLDivElement>;
}

export default function DayColumn({ weekday, availableHeight }: IProps) {
	const ID = useId();
	const [timeslots, setTimeslots] = useState<ITimeslot[]>([
		{ id: ID, start: 1000, end: 1440 },
	]);

	const columnRef = useRef<HTMLDivElement>(null);

	console.log(availableHeight);

	return (
		<div ref={columnRef} className="day-column">
			<div className="column-header">
				<h3>{weekday}</h3>
			</div>

			<div className="column-content">
				{timeslots.map(slot => (
					<TimeSlot
						key={slot.id}
						timeslot={slot}
						availableHeight={availableHeight}
					/>
					// <TimeSlot timeslot={slot} height={} top={} />
				))}
			</div>
		</div>
	);
}
