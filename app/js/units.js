'use strict';

/**
 * Единица ассортимента. Содержит всю основную информацию.
 * Остальные классы, представляющие данные по ассортименту,
 * должны ссылаться на этот класс и хранить только ссылку,
 * количество, стоимость и дату приобритения с примечанием.
 * 
 * @param {string} name название единицы ассортимента
 * @param {number} amount количество
 * @param {number} price стоимость
 * @param {Symbol} vendor вид распостранения
 * @param {Symbol} measure в каких единицах измерятся
 * @param {string} [category] категория 
 * @param {string} [desc] описание 
 * @param {string} [unitid] идентификатор
 */
function AssortimentUnit(name, amount, price, vendor, measure, category, desc, unitid) {
	this.name = name;
	this.amount = amount;
	this.price = price;
	this.packageType = vendor;
	this.measureType = measure;
	this.category = category || "общая";
	this.describe = desc || "";
	this.id = unitid || Date.now().toString(24);
}
