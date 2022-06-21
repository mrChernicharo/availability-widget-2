import { useRef } from 'react';

interface IProps {
	weekday: string;
	availableHeight: number;
	// containerRef: React.RefObject<HTMLDivElement>;
}

export default function DayColumn({ weekday, availableHeight }: IProps) {
	const columnRef = useRef<HTMLDivElement>(null);

	console.log(availableHeight);

	return (
		<div ref={columnRef} className="day-column">
			<div className="column-header">
				<h3>{weekday}</h3>
			</div>

			<div className="column-content"></div>
		</div>
	);
}
