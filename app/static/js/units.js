'use strict';

/**
 * Главная Единица Ассортимента. Содержит всю основную информацию.
 * Этот класс представляет и хранить данные о ассортименте в программе.
 * Остальные классы, представляющие данные по ассортименту, должны
 * ТОЛЬКО извлекать из них информацию. Они не должны дублироваться.
 */
class ProductUnit {
	/**
	 * @param {string} title название единицы ассортимента
	 * @param {number} amount количество
	 * @param {number} price стоимость
	 * @param {Symbol} vendor вид распостранения
	 * @param {Symbol} measure в каких единицах измерятся
	 * @param {string} [category] категория 
	 * @param {string} [desc] описание 
	 * @param {string} [unitid] идентификатор
	 */
	constructor(title, amount, price, vendor, measure, category, desc, unitid) {
		this.title = title;
		this.amount = amount;
		this.price = price;
		this.packageType = vendor;
		this.measureType = measure;
		this.category = category || "общая";
		this.describe = desc || "";
		this.id = unitid || Date.now().toString(24);
	}

	toJSON() {
		return {
			"title": this.title,
		 	"amount": this.amount,
			"price": this.price,
		 	"packageType": Symbol.keyFor(this.packageType),
		 	"measureType": Symbol.keyFor(this.measureType),
		 	"category": this.category,
		 	"describe": this.describe,
		 	"id": this.id
		};
	}

	static fromJson(json) {
		
		return new this(json.title ?? null, json.amount ?? null, json.price ?? null, Symbol.for(json.packageType),
			             Symbol.for(json.measureType), json.category ?? null, json.describe ?? null, json.id ?? null);
	}

	// TODO: реализация механизма сохранения обновления данных обьекта в хранилищах данных.
}

/**
 * Объект - элемент для списка ассортимента.
 * предоставляет передачу данных для рендера.
 */
class AssortimentListUnit {
	/**
	 * @param {ProductUnit} product
	 */
	constructor(product) {
		this._product = product;
		this._views = [];
	}
	render() {
		this.constructor.renders.forEach(render => {
			let view = new render.renderView();
			view.insertInto(render.nodeElement);
			render.handler(view, this);
			this._views.push(view);
		});
	}
	get title() { return this._product.title; }
	get price() { return this._product.price; }
	get amount() { return this._product.amount; }

	static renders = [];
	static bindRender(nodeElement, renderView, handler) {
		this.renders.push({nodeElement, renderView, handler});
	}
}

// --- Списки единиц ассортимента ---
//  Эти списки не должны хранить собственные (полные) экземпляры ассортимента,
// а только ссылку(и) на основное хранилище ассортимента и связанные данные,
// (количества, цены, примечания) с различными идентификаторами для фильтрации.
// Они не вызывают методы управления коллекцией обьекта-хранилища данных, но
// передают ему особый объект с директивами.


/**
 * Список единиц требуемого.
 */
class OrderList {
	/**
	 * @param {string} listName название-идентификатор списка.
	*/
	constructor(listname) {
		this.listName = listname || "список ассортимента";
		this.listUnitCollection = [];
	}

	add(unit) {
		this.listUnitCollection.push(unit);
	}
}
