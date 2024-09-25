window.addEventListener('DOMContentLoaded', () => {
	const setVw = () => {
		const vw = document.documentElement.clientWidth / 100;
		document.documentElement.style.setProperty("--vw", `${vw}px`);
	};

	setVw();
	window.addEventListener('resize', setVw);
});
