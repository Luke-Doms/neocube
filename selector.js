import { InitApp } from './game_files/App.js';

const sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const selectors = document.querySelectorAll('select');

function SetSelectors(selectors, sizes) {
	selectors.forEach(selector => {
		selector.innerHTML = '';

		sizes.forEach((size, index) => {
			const newSize = document.createElement('option');
			newSize.value = size;
			newSize.textContent = size;

			if (index == 2) {
				newSize.selected = true; 
			}

			selector.appendChild(newSize);
			});
		});
}

function ChangeSize(app) {
	app.Unload();
	const currentValues = Array.from(selectors).map(select => select.value);
	window.app = InitApp(currentValues[0], currentValues[1], currentValues[2]);
}

window.ChangeSize = ChangeSize;

SetSelectors(selectors, sizes);
