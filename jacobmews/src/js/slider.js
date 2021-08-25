const sliderLogic = (() => {
	import('https://cdn.jsdelivr.net/npm/glider-js@1/glider.min.js').then(() => {
		const checkIfMobileDevice = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)
		const slider = {
			mainElement: document.querySelector('#js-slider'),
			dots: document.querySelector('#js-slider-dots'),
			buttonPrev: document.querySelector('#js-slider-prev'),
			buttonNext: document.querySelector('#js-slider-next'),
		}
		new Glider(slider.mainElement, {
			slidesToShow: 1,
			dots: slider.dots,
			draggable: (checkIfMobileDevice === true) ? true : false,
			arrows: {
				prev: slider.buttonPrev,
				next: slider.buttonNext,
			}
		});
	});
})

export default sliderLogic;
