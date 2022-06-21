import { useEffect, useState } from 'react';

export const useWindowSize = () => {
	const [windowHeight, setWindowHeight] = useState(0);
	const [windowWidth, setWindowWidth] = useState(0);

	function handleResize() {
		setWindowHeight(window.innerHeight);
		setWindowWidth(window.innerWidth);
	}

	useEffect(() => {
		window.addEventListener('resize', handleResize);

		handleResize();

		return () => window.removeEventListener('resize', () => {});
	}, []);

	return {
		windowWidth,
		windowHeight,
	};
};
