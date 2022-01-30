/**
 * Главная Единица Ассортимента. Содержит всю основную информацию.
 * Этот класс представляет и хранить данные о ассортименте в программе.
 * Остальные классы, представляющие данные по ассортименту, должны
 * ТОЛЬКО извлекать из них информацию. Они не должны дублироваться.
 */
export default class ProductUnit {
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
		return new this(json.title ?? null, 
						json.amount ?? null, 
						json.price ?? null, 
						Symbol.for(json.packageType),
			            Symbol.for(json.measureType), 
			            json.category ?? null, 
			            json.describe ?? null, 
			            json.id ?? null);
	}
	// TODO: реализация механизма сохранения обновления данных обьекта в хранилищах данных.
}