/* ====================================
Проверка поддержки webp, добавление класса webp или no-webp для HTML
==================================== */
function isWebp() {
	// Проверка поддержки webp
	function testWebP(callback) {
		let webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}
	// Добавление класса _webp или _no-webp для HTML
	testWebP(function (support) {
		let className = support === true ? 'webp' : 'no-webp';
		document.documentElement.classList.add(className);
	});
}
isWebp()

/* ====================================
Проверка мобильного браузера
==================================== */
let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
/* Добавление класса touch для HTML если браузер мобильный */
function addTouchClass() {
	// Добавление класса _touch для HTML если браузер мобильный
	if (isMobile.any()) document.documentElement.classList.add('touch');
}
addTouchClass()

/* ====================================
Добавление loaded для HTML после полной загрузки страницы
==================================== */
function addLoadedClass() {
	window.addEventListener("load", function () {
		setTimeout(function () {
			document.documentElement.classList.add('loaded');
		}, 0);
	});
}
addLoadedClass()

/* ====================================
Инициализация галереи
==================================== */
Fancybox.bind("[data-fancybox]", {
	// Отключение возврата картинки к блоку
	hideClass: false, // Убирает стандартную анимацию
	dragToClose: false, // Отключает перетаскивание для закрытия

	Thumbs: {
		type: 'classic',
	},
});

/* ====================================
Табы
==================================== */
/*
Для родителя табов пишем атрибут data-tabs
Для родителя заголовков табов пишем атрибут data-tabs-titles
Для родителя блоков табов пишем атрибут data-tabs-body
Для родителя блоков табов можно указать data-tabs-hash, это втключит добавление хеша

Если нужно чтобы табы открывались с анимацией 
добавляем к data-tabs data-tabs-animate
По умолчанию, скорость анимации 500ms, 
указать свою скорость можно так: data-tabs-animate="1000"

Если нужно чтобы табы превращались в "спойлеры", на неком размере экранов, пишем параметры ширины.
Например: data-tabs="992" - табы будут превращаться в спойлеры на экранах меньше или равно 992px
*/
function tabs() {
	const tabs = document.querySelectorAll('[data-tabs]');
	let tabsActiveHash = [];

	// Получаем хэш из URL
	const hash = getHash();
	if (hash && hash.startsWith('tab-')) {
		tabsActiveHash = hash.replace('tab-', '').split('-');
	}

	if (tabs.length > 0) {
		resetTabs();
		handleHashChange();

		// Отслеживание изменения хэша
		window.addEventListener('hashchange', handleHashChange);

		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add('_tab-init');
			tabsBlock.setAttribute('data-tabs-index', index);
			tabsBlock.addEventListener("click", setTabsAction);
			initTabs(tabsBlock);
		});
	}

	// Инициализация медиа-запросов
	let mdQueriesArray = dataMediaQueries(tabs, "tabs");
	if (mdQueriesArray && mdQueriesArray.length) {
		mdQueriesArray.forEach(mdQueriesItem => {
			mdQueriesItem.matchMedia.addEventListener("change", () => {
				setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
			setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
		});
	}

	// Сброс вкладок
	function resetTabs() {
		document.querySelectorAll('._tab-active').forEach(el => el.classList.remove('_tab-active'));
	}

	// Функция обработки изменения хэша
	function handleHashChange() {
		const hash = getHash();
		if (hash && hash.startsWith('tab-')) {
			tabsActiveHash = hash.replace('tab-', '').split('-');
			const tabsBlockIndex = tabsActiveHash[0];
			const tabsTabIndex = tabsActiveHash[1];

			const tabsBlock = document.querySelector(`[data-tabs-index="${tabsBlockIndex}"]`);
			if (tabsBlock) {
				const tabTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
				const tabItems = tabsBlock.querySelectorAll('[data-tabs-item]');

				if (tabTitles[tabsTabIndex] && tabItems[tabsTabIndex]) {
					tabsBlock.querySelectorAll('._tab-active').forEach(el => el.classList.remove('_tab-active'));
					tabItems[tabsTabIndex].querySelectorAll('._tab-active').forEach(el => el.classList.remove('_tab-active'));
					tabTitles[tabsTabIndex].classList.add('_tab-active');
					tabItems[tabsTabIndex].classList.add('_tab-active');
					// Плавный скролл к верху блока табов
					tabsBlock.scrollIntoView({ behavior: "smooth", block: "start" });
				}
			}
		}
	}

	// Инициализация табов
	function initTabs(tabsBlock) {
		const tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles] button');
		const tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

		if (tabsTitles.length > 0 && tabsContent.length > 0) {
			tabsContent.forEach((content, index) => {
				if (tabsTitles[index]) {
					tabsTitles[index].setAttribute('data-tabs-title', '');
					content.setAttribute('data-tabs-item', '');

					// Если хэш блока не совпадает, добавляем активный класс
					if (!tabsActiveHashBlock && index === 0) {
						tabsTitles[index].classList.add('_tab-active');
						content.classList.add('_tab-active');
					}

					if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
						tabsTitles[index].classList.add('_tab-active');
						content.classList.add('_tab-active');
					}
				}
			});
		}
	}

	// Расстановка заголовков по медиа-запросам
	function setTitlePosition(tabsMediaArray, matchMedia) {
		tabsMediaArray.forEach(tabsMediaItem => {
			const tabsTitles = tabsMediaItem.item.querySelector('[data-tabs-titles]');
			const tabsContent = tabsMediaItem.item.querySelector('[data-tabs-body]');
			const tabTitles = Array.from(tabsMediaItem.item.querySelectorAll('[data-tabs-title]'));
			const tabItems = Array.from(tabsMediaItem.item.querySelectorAll('[data-tabs-item]'));

			if (matchMedia.matches) {
				tabItems.forEach((content, index) => {
					tabsContent.append(tabTitles[index]);
					tabsContent.append(content);
					tabsMediaItem.item.classList.add('_tab-spoller');
				});
			} else {
				tabTitles.forEach((title, index) => {
					tabsTitles.append(title);
					tabsMediaItem.item.classList.remove('_tab-spoller');
				});
			}
		});
	}

	// Обновление состояния табов
	function setTabsStatus(tabsBlock) {
		const tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
		const tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;

		tabsContent.forEach((content, index) => {
			if (tabsTitles[index].classList.contains('_tab-active')) {
				content.classList.add('_tab-active');
				setHash(`tab-${tabsBlockIndex}-${index}`);
			} else {
				tabsTitles[index].classList.remove('_tab-active')
				content.classList.remove('_tab-active');
			}
		});
	}

	// Обработка кликов по заголовкам табов
	function setTabsAction(e) {
		const tabTitle = e.target.closest('[data-tabs-title]');
		if (tabTitle) {
			const tabsBlock = tabTitle.closest('[data-tabs]');
			if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
				tabsBlock.querySelectorAll('[data-tabs-title]._tab-active').forEach(item => item.classList.remove('_tab-active'));
				tabTitle.classList.add('_tab-active');
				setTabsStatus(tabsBlock);
			}
			e.preventDefault();
			AOS.refresh()
		}
	}
}
if (document.querySelector('[data-tabs]')) {
	tabs()
}

/* ====================================
Спойлеры/аккордионы
==================================== */
/*
Для родителя слойлеров пишем атрибут data-spollers
Для заголовков слойлеров пишем атрибут data-spoller

Если нужно включать\выключать работу спойлеров на разных размерах экранов
пишем параметры ширины и типа брейкпоинта.
Например: 
data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px

Если нужно что бы в блоке открывался болько один слойлер добавляем атрибут data-one-spoller
*/
function spollers() {
	const spollersArray = document.querySelectorAll('[data-spollers]');

	function spollerClassInit() {
		spollersArray.forEach(spoller => {
			if (spoller) {
				const spollersItem = spoller.querySelectorAll('[class*="_item"]')

				spoller.classList.add('spollers')

				spollersItem.forEach(item => {
					if (item) {
						const spollerTitle = item.querySelector('[class*="_title"]')
						const spollerBody = item.querySelector('[class*="_body"]')

						item.classList.add('spollers__item')
						if (spollerTitle) {
							spollerTitle.classList.add('spollers__title')
						}
						if (spollerBody) {
							spollerBody.classList.add('spollers__body')
						}
					}
				});
			}
		});
	}
	spollerClassInit()

	if (spollersArray.length > 0) {
		// Получение обычных слойлеров
		const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
			return !item.dataset.spollers.split(",")[0];
		});
		// Инициализация обычных слойлеров
		if (spollersRegular.length) {
			initSpollers(spollersRegular);
		}
		// Получение слойлеров с медиа запросами
		let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				// Событие
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
		// Инициализация
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach(spollersBlock => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add('_spoller-init');
					initSpollerBody(spollersBlock);
					spollersBlock.addEventListener("click", setSpollerAction);
				} else {
					spollersBlock.classList.remove('_spoller-init');
					initSpollerBody(spollersBlock, false);
					spollersBlock.removeEventListener("click", setSpollerAction);
				}
			});
		}
		// Работа с контентом
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			let spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
			if (spollerTitles.length) {
				spollerTitles = Array.from(spollerTitles).filter(item => item.closest('[data-spollers]') === spollersBlock);
				spollerTitles.forEach(spollerTitle => {
					if (hideSpollerBody) {
						spollerTitle.removeAttribute('tabindex');
						if (!spollerTitle.classList.contains('_spoller-active')) {
							spollerTitle.closest('.spollers__item').querySelector('.spollers__body').hidden = true;
						}
					} else {
						spollerTitle.setAttribute('tabindex', '-1');
						spollerTitle.closest('.spollers__item').querySelector('.spollers__body').hidden = false;
					}
				});
			}
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.closest('[data-spoller]')) {
				const spollerTitle = el.closest('[data-spoller]');
				const spollersBlock = spollerTitle.closest('[data-spollers]');
				const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');
				const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
				if (!spollersBlock.querySelectorAll('._slide').length) {
					if (oneSpoller && !spollerTitle.classList.contains('_spoller-active')) {
						hideSpollersBody(spollersBlock);
					}
					spollerTitle.classList.toggle('_spoller-active');
					_slideToggle(spollerTitle.closest('.spollers__item').querySelector('.spollers__body'), spollerSpeed);
				}
				e.preventDefault();
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._spoller-active');
			const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
			if (spollerActiveTitle && !spollersBlock.querySelectorAll('._slide').length) {
				spollerActiveTitle.classList.remove('_spoller-active');
				_slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
			}
		}
		// Закрытие при клике вне спойлера
		const spollersClose = document.querySelectorAll('[data-spoller-close]');
		if (spollersClose.length) {
			document.addEventListener("click", function (e) {
				const el = e.target;
				if (!el.closest('[data-spollers]')) {
					spollersClose.forEach(spollerClose => {
						const spollersBlock = spollerClose.closest('[data-spollers]');
						if (spollersBlock.classList.contains('_spoller-init')) {
							const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
							spollerClose.classList.remove('_spoller-active');
							_slideUp(spollerClose.nextElementSibling, spollerSpeed);
						}
					});
				}
			});
		}
	}
}
if (document.querySelector('[data-spollers]')) {
	spollers()
}


/*
// Настройки
Для селекта (select):
class="имя класса" - модификатор к конкретному селекту
multiple - мультивыбор
data-class-modif= "имя модификатора"
data-tags - режим тегов, только для (только для multiple)
data-scroll - включит прокрутку для выпадающего списка, дополнительно можно подключить кастомный скролл simplebar в app.js. Указанное число для атрибута ограничит высоту
data-checkbox - стилизация элементов по checkbox (только для multiple)
data-show-selected - отключает скрытие выбранного элемента
data-search - позволяет искать по выпадающему списку
data-open - селект открыт сразу
data-submit - отправляет форму при изменении селекта
	
data-one-select - селекты внутри оболочки с атрибутом будут показываться только по одному
data-pseudo-label - добавляет псевдоэлемент к заголовку селекта с указанным текстом
	
Для плейсхолдера (Плейсхолдер - это option с value=""):
data-label для плейсхолдера, добавляет label к селекту
data-show для плейсхолдера, показывает его в списке (только для единичного выбора)
	
Для элемента (option):
data-class="имя класса" - добавляет класс
data-asset="путь к картинке или текст" - добавляет структуру 2х колонок и данными
data-href="адрес ссылки" - добавляет ссылку в элемент списка
data-href-blank - откроет ссылку в новом окне
*/

// Класс построения Select
(() => {
	"use strict";
	const modules = {};
	class SelectConstructor {
		constructor(props, data = null) {
			let defaultConfig = {
				init: true,
				logging: true
			};
			this.config = Object.assign(defaultConfig, props);
			this.selectClasses = {
				classSelect: "select",
				classSelectBody: "select__body",
				classSelectTitle: "select__title",
				classSelectValue: "select__value",
				classSelectLabel: "select__label",
				classSelectInput: "select__input",
				classSelectText: "select__text",
				classSelectLink: "select__link",
				classSelectOptions: "select__options",
				classSelectOptionsScroll: "select__scroll",
				classSelectOption: "select__option",
				classSelectContent: "select__content",
				classSelectRow: "select__row",
				classSelectData: "select__asset",
				classSelectDisabled: "_select-disabled",
				classSelectTag: "_select-tag",
				classSelectOpen: "_select-open",
				classSelectActive: "_select-active",
				classSelectFocus: "_select-focus",
				classSelectMultiple: "_select-multiple",
				classSelectCheckBox: "_select-checkbox",
				classSelectOptionSelected: "_select-selected",
				classSelectPseudoLabel: "_select-pseudo-label"
			};
			this._this = this;
			if (this.config.init) {
				const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll("select.select__emulator");
				if (selectItems.length) {
					this.selectsInit(selectItems);
				}
			}
		}
		getSelectClass(className) {
			return `.${className}`;
		}
		getSelectElement(selectItem, className) {
			return {
				originalSelect: selectItem.querySelector("select.select__emulator"),
				selectElement: selectItem.querySelector(this.getSelectClass(className))
			};
		}
		selectsInit(selectItems) {
			selectItems.forEach(((originalSelect, index) => {
				this.selectInit(originalSelect, index + 1);
			}));
			document.addEventListener("click", function (e) {
				this.selectsActions(e);
			}.bind(this));
			document.addEventListener("keydown", function (e) {
				this.selectsActions(e);
			}.bind(this));
			document.addEventListener("focusin", function (e) {
				this.selectsActions(e);
			}.bind(this));
			document.addEventListener("focusout", function (e) {
				this.selectsActions(e);
			}.bind(this));
		}
		selectInit(originalSelect, index) {
			const _this = this;
			let selectItem = document.createElement("div");
			selectItem.classList.add(this.selectClasses.classSelect);
			originalSelect.parentNode.insertBefore(selectItem, originalSelect);
			selectItem.appendChild(originalSelect);
			originalSelect.hidden = true;
			index ? originalSelect.dataset.id = index : null;
			if (this.getSelectPlaceholder(originalSelect)) {
				originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
				if (this.getSelectPlaceholder(originalSelect).label.show) {
					const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
					selectItemTitle.insertAdjacentHTML("afterbegin", `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
				}
			}
			selectItem.insertAdjacentHTML("beforeend", `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
			this.selectBuild(originalSelect);
			originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : "150";
			originalSelect.addEventListener("change", (function (e) {
				_this.selectChange(e);
			}));
		}
		selectBuild(originalSelect) {
			const selectItem = originalSelect.parentElement;
			selectItem.dataset.id = originalSelect.dataset.id;
			originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;
			originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
			originalSelect.hasAttribute("data-checkbox") && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
			this.setSelectTitleValue(selectItem, originalSelect);
			this.setOptions(selectItem, originalSelect);
			originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
			originalSelect.hasAttribute("data-open") ? this.selectAction(selectItem) : null;
			this.selectDisabled(selectItem, originalSelect);
		}
		selectsActions(e) {
			const targetElement = e.target;
			const targetType = e.type;
			if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
				const selectItem = targetElement.closest(".select") ? targetElement.closest(".select") : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
				const originalSelect = this.getSelectElement(selectItem).originalSelect;
				if ("click" === targetType) {
					if (!originalSelect.disabled) if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
						const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
						const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
						this.optionAction(selectItem, originalSelect, optionItem);
					} else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) this.selectAction(selectItem); else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
						const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
						this.optionAction(selectItem, originalSelect, optionItem);
					}
				} else if ("focusin" === targetType || "focusout" === targetType) {
					if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) "focusin" === targetType ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
				} else if ("keydown" === targetType && "Escape" === e.code) this.selectsСlose();
			} else this.selectsСlose();
		}
		selectsСlose(selectOneGroup) {
			const selectsGroup = selectOneGroup ? selectOneGroup : document;
			const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
			if (selectActiveItems.length) selectActiveItems.forEach((selectActiveItem => {
				this.selectСlose(selectActiveItem);
			}));
		}
		selectСlose(selectItem) {
			const originalSelect = this.getSelectElement(selectItem).originalSelect;
			const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
			if (!selectOptions.classList.contains("_slide")) {
				selectItem.classList.remove(this.selectClasses.classSelectOpen);
				_slideUp(selectOptions, originalSelect.dataset.speed);
			}
		}
		selectAction(selectItem) {
			const originalSelect = this.getSelectElement(selectItem).originalSelect;
			const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
			if (originalSelect.closest("[data-one-select]")) {
				const selectOneGroup = originalSelect.closest("[data-one-select]");
				this.selectsСlose(selectOneGroup);
			}
			if (!selectOptions.classList.contains("_slide")) {
				selectItem.classList.toggle(this.selectClasses.classSelectOpen);
				_slideToggle(selectOptions, originalSelect.dataset.speed);
			}
		}
		setSelectTitleValue(selectItem, originalSelect) {
			const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
			const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
			if (selectItemTitle) selectItemTitle.remove();
			selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
		}
		getSelectTitleValue(selectItem, originalSelect) {
			let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
			if (originalSelect.multiple && originalSelect.hasAttribute("data-tags")) {
				selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map((option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`)).join("");
				if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
					document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
					if (originalSelect.hasAttribute("data-search")) selectTitleValue = false;
				}
			}
			selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : "";
			let pseudoAttribute = "";
			let pseudoAttributeClass = "";
			if (originalSelect.hasAttribute("data-pseudo-label")) {
				pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заполните атрибут"`;
				pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
			}
			this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
			if (originalSelect.hasAttribute("data-search")) return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`; else {
				const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : "";
				return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
			}
		}
		getSelectElementContent(selectOption) {
			const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : "";
			const selectOptionDataHTML = selectOptionData.indexOf("img") >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
			let selectOptionContentHTML = ``;
			selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : "";
			selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : "";
			selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
			selectOptionContentHTML += selectOptionData ? `</span>` : "";
			selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : "";
			selectOptionContentHTML += selectOption.textContent;
			selectOptionContentHTML += selectOptionData ? `</span>` : "";
			selectOptionContentHTML += selectOptionData ? `</span>` : "";
			return selectOptionContentHTML;
		}
		getSelectPlaceholder(originalSelect) {
			const selectPlaceholder = Array.from(originalSelect.options).find((option => !option.value));
			if (selectPlaceholder) return {
				value: selectPlaceholder.textContent,
				show: selectPlaceholder.hasAttribute("data-show"),
				label: {
					show: selectPlaceholder.hasAttribute("data-label"),
					text: selectPlaceholder.dataset.label
				}
			};
		}
		getSelectedOptionsData(originalSelect, type) {
			let selectedOptions = [];
			if (originalSelect.multiple) selectedOptions = Array.from(originalSelect.options).filter((option => option.value)).filter((option => option.selected)); else selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
			return {
				elements: selectedOptions.map((option => option)),
				values: selectedOptions.filter((option => option.value)).map((option => option.value)),
				html: selectedOptions.map((option => this.getSelectElementContent(option)))
			};
		}
		getOptions(originalSelect) {
			let selectOptionsScroll = originalSelect.hasAttribute("data-scroll") ? `data-simplebar` : "";
			let selectOptionsScrollHeight = originalSelect.dataset.scroll ? `style="max-height:${originalSelect.dataset.scroll}px"` : "";
			let selectOptions = Array.from(originalSelect.options);
			if (selectOptions.length > 0) {
				let selectOptionsHTML = ``;
				if (this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show || originalSelect.multiple) selectOptions = selectOptions.filter((option => option.value));
				selectOptionsHTML += selectOptionsScroll ? `<div ${selectOptionsScroll} ${selectOptionsScrollHeight} class="${this.selectClasses.classSelectOptionsScroll}">` : "";
				selectOptions.forEach((selectOption => {
					selectOptionsHTML += this.getOption(selectOption, originalSelect);
				}));
				selectOptionsHTML += selectOptionsScroll ? `</div>` : "";
				return selectOptionsHTML;
			}
		}
		getOption(selectOption, originalSelect) {
			const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : "";
			const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute("data-show-selected") && !originalSelect.multiple ? `hidden` : ``;
			const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : "";
			const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
			const selectOptionLinkTarget = selectOption.hasAttribute("data-href-blank") ? `target="_blank"` : "";
			let selectOptionHTML = ``;
			selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
			selectOptionHTML += this.getSelectElementContent(selectOption);
			selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
			return selectOptionHTML;
		}
		setOptions(selectItem, originalSelect) {
			const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
			selectItemOptions.innerHTML = this.getOptions(originalSelect);
		}
		optionAction(selectItem, originalSelect, optionItem) {
			if (originalSelect.multiple) {
				optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
				const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
				originalSelectSelectedItems.forEach((originalSelectSelectedItem => {
					originalSelectSelectedItem.removeAttribute("selected");
				}));
				const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
				selectSelectedItems.forEach((selectSelectedItems => {
					originalSelect.querySelector(`option[value="${selectSelectedItems.dataset.value}"]`).setAttribute("selected", "selected");
				}));
			} else {
				if (!originalSelect.hasAttribute("data-show-selected")) {
					if (selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`)) selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`).hidden = false;
					optionItem.hidden = true;
				}
				originalSelect.value = optionItem.hasAttribute("data-value") ? optionItem.dataset.value : optionItem.textContent;
				this.selectAction(selectItem);
			}
			this.setSelectTitleValue(selectItem, originalSelect);
			this.setSelectChange(originalSelect);

			if (document.documentElement.classList.contains('sort-open')) {
				document.documentElement.classList.remove('sort-open');
			}
		}
		selectChange(e) {
			const originalSelect = e.target;
			this.selectBuild(originalSelect);
			this.setSelectChange(originalSelect);
		}
		setSelectChange(originalSelect) {
			if (originalSelect.hasAttribute("data-validate")) formValidate.validateInput(originalSelect);
			if (originalSelect.hasAttribute("data-submit") && originalSelect.value) {
				let tempButton = document.createElement("button");
				tempButton.type = "submit";
				originalSelect.closest("form").append(tempButton);
				tempButton.click();
				tempButton.remove();
			}
			const selectItem = originalSelect.parentElement;
			this.selectCallback(selectItem, originalSelect);
		}
		selectDisabled(selectItem, originalSelect) {
			if (originalSelect.disabled) {
				selectItem.classList.add(this.selectClasses.classSelectDisabled);
				this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
			} else {
				selectItem.classList.remove(this.selectClasses.classSelectDisabled);
				this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
			}
		}
		searchActions(selectItem) {
			this.getSelectElement(selectItem).originalSelect;
			const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
			const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
			const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption}`);
			const _this = this;
			selectInput.addEventListener("input", (function () {
				selectOptionsItems.forEach((selectOptionsItem => {
					if (selectOptionsItem.textContent.toUpperCase().indexOf(selectInput.value.toUpperCase()) >= 0) selectOptionsItem.hidden = false; else selectOptionsItem.hidden = true;
				}));
				true === selectOptions.hidden ? _this.selectAction(selectItem) : null;
			}));
		}
		selectCallback(selectItem, originalSelect) {
			document.dispatchEvent(new CustomEvent("selectCallback", {
				detail: {
					select: originalSelect
				}
			}));
		}
	}
	modules.select = new SelectConstructor({});
})();
function oneSelect() {
	const selectOneSelects = document.querySelectorAll('.select_one-select');
	selectOneSelects.forEach(select => {
		const selectOptions = select.querySelectorAll('.select__options .select__option');

		selectOptions.forEach(option => {
			option.addEventListener('click', function () {
				selectOptions.forEach(option => {
					option.classList.remove('_select-selected')
				});
				this.classList.add('_select-selected')
			})
		});
	});
}
if (document.querySelector('.select_one-select')) {
	oneSelect()
}

/* ====================================
Добавить картинкам draggable="false"
==================================== */
const imgs = document.getElementsByTagName('img');
for (let i = 0; i < imgs.length; i++) {
	imgs[i].setAttribute('draggable', false);
}

//========================================================================================================================================================
// Обработа медиа запросов из атрибутов 
function dataMediaQueries(array, dataSetValue) {
	// Получение объектов с медиа запросами
	const media = Array.from(array).filter(function (item, index, self) {
		if (item.dataset[dataSetValue]) {
			return item.dataset[dataSetValue].split(",")[0];
		}
	});
	// Инициализация объектов с медиа запросами
	if (media.length) {
		const breakpointsArray = [];
		media.forEach(item => {
			const params = item.dataset[dataSetValue];
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});
		// Получаем уникальные брейкпоинты
		let mdQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mdQueries = uniqArray(mdQueries);
		const mdQueriesArray = [];

		if (mdQueries.length) {
			// Работаем с каждым брейкпоинтом
			mdQueries.forEach(breakpoint => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);
				// Объекты с нужными условиями
				const itemsArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				mdQueriesArray.push({
					itemsArray,
					matchMedia
				})
			});
			return mdQueriesArray;
		}
	}
}

// Уникализация массива
function uniqArray(array) {
	return array.filter(function (item, index, self) {
		return self.indexOf(item) === index;
	});
}

//========================================================================================================================================================
// Вспомогательные модули блокировки прокрутки
let bodyLockStatus = true;
let bodyLockToggle = (delay = 300) => {
	if (document.documentElement.classList.contains('lock')) {
		bodyUnlock(delay);
	} else {
		bodyLock(delay);
	}
}
let bodyUnlock = (delay = 300) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			document.documentElement.classList.remove("lock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}
let bodyLock = (delay = 300) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			// el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		}
		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		document.documentElement.classList.add("lock");

		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}

//========================================================================================================================================================
// Вспомогательные модули плавного раскрытия и закрытия объекта
let _slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore ? target.style.removeProperty('height') : null;
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			!showmore ? target.style.removeProperty('overflow') : null;
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.hidden = target.hidden ? false : null;
		showmore ? target.style.removeProperty('height') : null;
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}

// Получение хеша в адресе сайта
function getHash() {
	if (location.hash) { return location.hash.replace('#', ''); }
}
// Указание хеша в адресе сайта
function setHash(hash) {
	hash = hash ? `#${hash}` : window.location.href.split('#')[0];
	history.pushState('', '', hash);
}
