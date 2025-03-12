/* ====================================
Открыть/закрыть доп.меню (в моб.версии)
==================================== */
function openFilter() {
	const filterShow = document.getElementById('filter-show');
	const filterClose = document.getElementById('filter-close');

	if (filterShow) {
		// Открываем меню
		filterShow.addEventListener("click", function (e) {
			e.preventDefault();
			// bodyLock();
			document.documentElement.classList.add('filter-open');
		});
	}

	if (filterClose) {
		// Открываем меню
		filterClose.addEventListener("click", function (e) {
			e.preventDefault();
			// bodyUnlock();
			document.documentElement.classList.remove('filter-open');
		});
	}
}
openFilter();
