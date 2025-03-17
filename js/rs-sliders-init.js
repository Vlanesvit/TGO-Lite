/*
Документация слайдера: https://swiperjs.com/
*/

// Инициализация слайдеров
function initSliders() {
	if (document.querySelector('.rs-product-block')) {
		// Инициализация слайдера
		const sliders = document.querySelectorAll('.rs-product-block');

		sliders.forEach(slider => {
			const sliderMain = slider.querySelector('.rs-product-block__main_slider');
			const sliderThumbs = slider.querySelector('.rs-product-block__thumbs_slider');
			const arrowPrev = slider.querySelector('.rs-product-block__thumbs_button-prev');
			const arrowNext = slider.querySelector('.rs-product-block__thumbs_button-next');

			// Перечень слайдеров
			const sliderThumbsSwiper = new Swiper(sliderThumbs, {
				// // Предзагрузка изоражений
				preloadImages: false,

				// // Ленивая загрузка
				lazy: true,

				// // Автопрокрутка
				// autoplay: {
				// 	// Пауза между прокруткой
				// 	delay: 5000,
				// 	// Закончить на последнем слайде
				// 	stopOnLastSlide: false,
				// 	// Отключить после ручного переключения
				// 	disableOnInteraction: false,
				// },

				// Обновить свайпер
				// при изменении элементов слайдера
				observer: true,
				// при изменении родительских элементов слайдера
				observeParents: true,
				// при изменении дочерних элементов слайдера
				observeSlideChildren: true,

				// Скорость смены слайдов
				speed: 800,

				// Включение/отключение
				// перетаскивание на ПК
				simulateTouch: true,
				allowTouchMove: true,
				// Чувствительность свайпа
				touchRadio: 1,
				// Угол срабатывания свайпа/перетаскивания
				touchAngle: 45,
				touchStartPreventDefault: false,

				// Навигация
				navigation: {
					prevEl: arrowPrev,
					nextEl: arrowNext,
				},

				// Брейкпоинты(адаптив)
				// Ширина экрана
				breakpoints: {
					320: {
						slidesPerView: 3,
						spaceBetween: 20,
					},
					540: {
						slidesPerView: 4,
						spaceBetween: 12,
					},
					991.98: {
						slidesPerView: 4,
						spaceBetween: 10,
					},
				},
			});

			const sliderMainSwiper = new Swiper(sliderMain, {
				// Слияние слайдеров
				thumbs: {
					swiper: sliderThumbsSwiper,
				},

				// Предзагрузка изоражений
				preloadImages: false,

				// Ленивая загрузка
				lazy: true,

				// Слежка за слайдером
				watchOverflow: true,

				// // Автопрокрутка
				// autoplay: {
				// 	// Пауза между прокруткой
				// 	delay: 5000,
				// 	// Закончить на последнем слайде
				// 	stopOnLastSlide: false,
				// 	// Отключить после ручного переключения
				// 	disableOnInteraction: false,
				// },

				// // Управлениt колесом мыши
				// mousewheel: {
				// 	// Чувствительность колеса мыши
				// 	sensitivity: 1,
				// },

				// Кол-во показываемых слайдов
				slidesPerView: 1,

				// Обновить свайпер
				// при изменении элементов слайдера
				observer: true,
				// при изменении родительских элементов слайдера
				observeParents: true,
				// при изменении дочерних элементов слайдера
				observeSlideChildren: true,

				// Скорость смены слайдов
				speed: 800,

				// Включение/отключение
				// перетаскивание на ПК
				simulateTouch: true,
				allowTouchMove: true,
				// Чувствительность свайпа
				touchRadio: 1,
				// Угол срабатывания свайпа/перетаскивания
				touchAngle: 45,
				touchStartPreventDefault: false,
			});
		});
	}

	// Перечень слайдеров
	if (document.querySelector('.rs-product-block__products')) {
		const sliderBlocks = document.querySelectorAll('.rs-product-block__products');

		sliderBlocks.forEach(sliderBlock => {
			const sliders = sliderBlock.querySelectorAll('.rs-product-block__products_slider');

			sliders.forEach(slider => {
				const swiperMain = new Swiper(slider, {
					// // Автопрокрутка
					// autoplay: {
					// 	// Пауза между прокруткой
					// 	delay: 10000,
					// 	// Закончить на последнем слайде
					// 	stopOnLastSlide: false,
					// 	// Отключить после ручного переключения
					// 	disableOnInteraction: false,
					// },

					// Обновить свайпер
					// при изменении элементов слайдера
					observer: true,
					// при изменении родительских элементов слайдера
					observeParents: true,
					// при изменении дочерних элементов слайдера
					observeSlideChildren: true,

					// Скорость смены слайдов
					speed: 800,

					// Включение/отключение
					// перетаскивание на ПК
					simulateTouch: true,
					allowTouchMove: true,
					// Чувствительность свайпа
					touchRadio: 1,
					// Угол срабатывания свайпа/перетаскивания
					touchAngle: 45,

					// Цикличность слайдера
					// loop: true,

					// Анимация переключения
					// effect: 'fade',

					// Курсор перетаскивания
					grabCursor: true,

					breakpoints: {
						320: {
							slidesPerView: 1,
							spaceBetween: 10,
						},
						767.98: {
							slidesPerView: 3,
							spaceBetween: 12,
						},
						991.98: {
							slidesPerView: 4,
							spaceBetween: 24,
						},
						1439.98: {
							slidesPerView: 5,
							spaceBetween: 60,
						}
					}
				});
			});

		});
	}
}

// Скролл на базе слайдера (по классу swiper_scroll для оболочки слайдера)
function initSlidersScroll() {
	let sliderScrollItems = document.querySelectorAll('.swiper_scroll');
	if (sliderScrollItems.length > 0) {
		for (let index = 0; index < sliderScrollItems.length; index++) {
			const sliderScrollItem = sliderScrollItems[index];
			const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
			const sliderScroll = new Swiper(sliderScrollItem, {
				observer: true,
				observeParents: true,
				direction: 'vertical',
				slidesPerView: 'auto',
				freeMode: {
					enabled: true,
				},
				scrollbar: {
					el: sliderScrollBar,
					draggable: true,
					snapOnRelease: false
				},
				mousewheel: {
					releaseOnEdges: true,
				},
			});
			sliderScroll.scrollbar.updateSize();
		}
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	if (document.querySelector('.swiper')) {
		initSliders();
	}
	// Запуск инициализации скролла на базе слайдера (по классу swiper_scroll)
	//initSlidersScroll();
});