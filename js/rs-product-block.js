document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll("[data-copy-text]").forEach(element => {
		element.addEventListener("click", () => {
			const text = element.innerText || element.textContent;
			navigator.clipboard.writeText(text).then(() => {
				console.log("Текст скопирован:", text);
			}).catch(err => console.error("Ошибка копирования:", err));
		});
	});

	// Копирование URL страницы
	document.querySelectorAll("[data-copy-url]").forEach(button => {
		button.addEventListener("click", () => {
			const pageUrl = window.location.href;
			navigator.clipboard.writeText(pageUrl).then(() => {
				console.log("URL скопирован:", pageUrl);
			}).catch(err => console.error("Ошибка копирования URL:", err));
		});
	});
});
