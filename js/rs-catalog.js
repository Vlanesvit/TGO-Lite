/* ====================================
Открыть/закрыть доп.меню (в моб.версии)
==================================== */
function openFilter() {
	const dropdownBtns = document.querySelectorAll("[data-drop-filter]");
	const dropdownItems = document.querySelectorAll("[data-drop-menu]");

	dropdownBtns.forEach(dropdownBtn => {
		dropdownBtn.addEventListener("click", (e) => {
			e.preventDefault();

			const menuValue = dropdownBtn.getAttribute("data-drop-filter");

			// Скрываем все выпадающие меню
			dropdownItems.forEach(item => item.classList.remove('filter-item-open'));

			// Ищем нужное меню и показываем
			const targetDropdown = document.querySelector(`[data-drop-menu="${menuValue}"]`);
			if (targetDropdown) {
				targetDropdown.classList.add('filter-item-open');
			}
		});
	});

	dropdownItems.forEach(dropdownItem => {
		const dropdownClose = dropdownItem.querySelector(".rs-catalog__sidebar_close");

		dropdownClose.addEventListener("click", () => {
			dropdownItem.classList.remove('filter-item-open');
		});
	});
}
openFilter();

function rangeInit() {
	const sliders = document.querySelectorAll('.range__slider');

	sliders.forEach(slider => {
		const min = parseInt(slider.dataset.min) || 1;
		const max = parseInt(slider.dataset.max) || 100;
		const startMin = parseInt(slider.dataset.startMin) || min;
		const startMax = parseInt(slider.dataset.startMax) || max;
		const step = parseInt(slider.dataset.step) || 10;

		noUiSlider.create(slider, {
			start: [startMin, startMax],
			step: step,
			behaviour: 'drag-tap',
			connect: [false, true, false],
			range: {
				'min': min,
				'max': max
			}
		});

		const container = slider.closest('.range__filter');
		const inputMin = container.querySelector('.range__input-min');
		const inputMax = container.querySelector('.range__input-max');
		const inputs = [inputMin, inputMax];

		slider.noUiSlider.on('update', function (values, handle) {
			inputs[handle].value = Math.round(values[handle]);
		});

		inputs.forEach((input, index) => {
			input.addEventListener('change', function () {
				let values = [inputMin.value, inputMax.value];
				slider.noUiSlider.set(values);
			});
		});
	});
}
document.addEventListener("DOMContentLoaded", rangeInit);
