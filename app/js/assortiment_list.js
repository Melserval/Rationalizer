// Списки единиц ассортимента. 
// Эти списки не должны хранить собственные (полные) экземпляры ассортимента,
// а только ссылку(и) на основное хранилище ассортимента и связанные данные 
// (количества, цены, примечания) с различными идентификаторами для фильтрации 
// отображаемых элементов (единиц) ассортимента. Так же они не должны напрямую 
// вызывать методы управления коллекцией обьекта-хранилища данных, а только 
// передавать ему особый объект с "директивами" для выполнения. Это позволит
// проверить их правомочность в главном обьекте данных (или на сервере).
'use strict';

class AssortimentList {
	unitCount = 0;
	units = [];
	renders = [];
	views = [];

	constructor(listname) {
		this.listName = listname || "список ассортимента";
	}

	add(asunit) {
		this.units.push(asunit);
	}

	show() {
		this.units.forEach(unit => {
			this.renders.forEach(render => render.render(unit));
		});
	}
}