/**
 * Главная Единица Ассортимента. Содержит всю основную информацию.
 * Этот класс представляет и хранить данные о ассортименте в программе.
 * Остальные классы, представляющие данные по ассортименту, должны
 * ТОЛЬКО извлекать из них информацию. Они не должны дублироваться.
 */
class ProductUnit {

	/** 
	 * @param title название единицы ассортимента
	 * @param amount количество
	 * @param price стоимость
	 * @param packageType вид распостранения
	 * @param measureType в каких единицах измерятся
	 * @param category категория 
	 * @param describe описание
	 * @param id идентификатор
	 */
	constructor(
		public title: string, 
		public amount: number, 
		public price: number, 
		public packageType: symbol, 
		public measureType: symbol, 
		public category: string = "общая",
		public describe: string = "", 
		public id: string = Date.now().toString(24)
	) { }

	toJSON(): ProductUnitJson {
		return {
			"title": this.title,
		 	"amount": this.amount,
			"price": this.price,
		 	"packageType": Symbol.keyFor(this.packageType) ?? "UNKNOW", //TODO: Разобраться с допустимыми строковыми значениями для типов учетных единиц.
		 	"measureType": Symbol.keyFor(this.measureType) ?? "UNKNOW",
		 	"category": this.category,
		 	"describe": this.describe,
		 	"id": this.id
		};
	}

	static fromJson(json: ProductUnitJson) {
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

type ProductUnitJson = {
	title: string;
	amount: number;
	price: number;
	packageType: string;
	measureType: string;
	category: string;
	describe: string;
	id: string;
}

export {ProductUnit, ProductUnitJson};