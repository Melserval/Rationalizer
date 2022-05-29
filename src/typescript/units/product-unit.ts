import { MeasureType, VendorType, vendorType_packed } from "../types";
import { IArticleItem } from "./i-article-item";

/**
 * Главная Единица Ассортимента. Содержит всю основную информацию.
 * Этот класс представляет и хранить данные о ассортименте в программе.
 * Остальные классы, представляющие данные по ассортименту, должны
 * ТОЛЬКО извлекать из них информацию. Они не должны дублироваться.
 */
class ProductUnit implements IArticleItem {

	/** 
	 * @param title название единицы ассортимента
	 * @param amount количество
	 * @param price стоимость
	 * @param vendorType вид распостранения
	 * @param measureType в каких единицах измерятся
	 * @param category категория 
	 * @param describe описание
	 * @param id идентификатор
	 */
	constructor(
		public title: string,
		public amount: number,
		public price: number,
		public vendorType: VendorType,
		public measureType: MeasureType,
		public category: string = "общая",
		public describe: string = "",
		public id: string = Date.now().toString(24)
	) { }

	toJSON(): ProductUnitJson {
		return {
			"title": this.title,
		 	"amount": this.amount,
			"price": this.price,
		 	"vendorType": this.vendorType.typeName,
		 	"measureType": this.measureType.typeName,
		 	"category": this.category,
		 	"describe": this.describe,
		 	"id": this.id
		};
	}

	static fromJson(json: ProductUnitJson) {
		let measureType = MeasureType.info(json.measureType);
		let vendorType = VendorType.info(json.vendorType);
		if (measureType == null || vendorType == null) {
			throw new Error("Нераспознан обязательный тип!");
		}

		return new this(json.title ?? null, 
						json.amount ?? null, 
						json.price ?? null, 
						vendorType,
			            measureType, 
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
	vendorType: string;
	measureType: string;
	category: string;
	describe: string;
	id: string;
}

export {ProductUnit, ProductUnitJson};