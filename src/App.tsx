import AvailabilityWidget from './components/AvailabilityWidget';
import './index.scss';
import { COLUMN_HEIGHT } from './lib/constants';
import { setCSSVariable } from './lib/helpers';

function App() {
	setCSSVariable('--column-height', COLUMN_HEIGHT + 'px');
	return (
		<div className="app">
			<AvailabilityWidget />
		</div>
	);
}

export default App;
