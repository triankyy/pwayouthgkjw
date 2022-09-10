import { useEffect, useState } from 'react';

function getWindowDimensions(): WindowDimensions {
	const { innerWidth: width, innerHeight: height } = window;
	return { width, height };
}

export default function useWindowDimensions(): WindowDimensions {
	const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowDimensions;
}

export interface WindowDimensions {
      width: number
      height: number
}