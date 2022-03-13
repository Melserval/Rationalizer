import { ProductUnit } from "./product-unit";
import { MeasureType } from "../types";


/** 
 * Представляет ссылку на единицу ассортимента ProductUnit, хранит 
 * ассоциированное с ним - "заказанное" количество продукта и сумму.
 */
export default class ArticleUnit {

	private static unitCount = 0;

	public readonly product: ProductUnit;

	/** Уникальный идентификатор объекта. */
	public readonly id: number;
	
	/**
	 * @param {ProductUnit} product данные 
	 */
	constructor(product: ProductUnit) {
		this.product = product;
		this.id = ArticleUnit.unitCount += 1;
	}

	/** название продукта. */
	get title(): string { 
		return this.product.title;
	}
	/** цена продукта. */
	get price(): number { 
		return this.product.price;
	}
	/** количество продукта. */
	get amount(): number { 
		return this.product.amount;
	}
	/** информация о товарной единице. */
	get measureType() {
		return MeasureType.info(this.product.measureType);
	}
}
