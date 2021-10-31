'use strict';

/**
 * Главная Единица Ассортимента. Содержит всю основную информацию.
 * Остальные классы, представляющие данные по ассортименту,
 * должны ссылаться на их экзэмляры и хранить только ссылку,
 * количество, стоимость и дату приобритения с примечанием.
 */
class AssortimentUnit {
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
}

/**
 * Объект - элемент для списка ассортимента.
 * предоставляет передачу данных для рендера
 * и хранит "свои" значения для цены/количества.
 */
class ListUnit {
	/**
	 * @param {AssortimentUnit} unit
	 */
	constructor(unit) {
		this.link = unit;
	}
	get title() { return this.link.title; }
	get price() { return this.link.price; }
	get amount() { return this.link.amount; }
}

/**
 * Список единиц ассортимента.
 * 
 * Эти списки не должны хранить собственные (полные) экземпляры ассортимента,
 * а только ссылку(и) на основное хранилище ассортимента и связанные данные,
 * (количества, цены, примечания) с различными идентификаторами для фильтрации.
 * Они не вызывают методы управления коллекцией обьекта-хранилища данных, но
 * передают ему особый объект с директивами.
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
