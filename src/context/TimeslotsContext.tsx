// import { createContext, ReactNode, useContext, useState } from 'react';
// import { ITimeslot } from '../lib/types';

// export interface ITimeslotContext {
// 	weekday: string;
// 	timeslots: ITimeslot[];
// 	updateTimeslots: (timeslot: ITimeslot) => void;
// }

// export interface ITimeslotContextProvider {
// 	weekday: string;
// 	children: ReactNode;
// }

// const TimeslotsContext = createContext<ITimeslotContext>({
// 	weekday: '',
// 	timeslots: [],
// 	updateTimeslots: () => {},
// });

// export const TimeslotsContextProvider = ({
// 	children,
// 	weekday,
// }: ITimeslotContextProvider) => {
// 	const [timeslots, setTimeslots] = useState<ITimeslot[]>([]);

// 	function updateTimeslots(timeslot: ITimeslot) {
// 		console.log('updateTimeslots', timeslot);

// 		setTimeslots(ts => [...ts, timeslot]);
// 	}

// 	const context: ITimeslotContext = {
// 		weekday,
// 		timeslots,
// 		updateTimeslots,
// 	};

// 	return (
// 		<TimeslotsContext.Provider value={context}>
// 			{children}
// 		</TimeslotsContext.Provider>
// 	);
// };

// export const useTimeslotsContext = () => useContext(TimeslotsContext);
