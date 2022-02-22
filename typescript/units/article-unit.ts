import { ProductUnit } from "./product-unit";


/** 
 * Представляет ссылку на единицу ассортимента ProductUnit, хранит 
 * ассоциированное с ним - "заказанное" количество продукта и сумму.
 */
export default class ArticleUnit {

	private static unitCount = 0;

	private _product: ProductUnit;

	/** Уникальный идентификатор объекта. */
	public readonly id: number;
	
	/**
	 * @param {ProductUnit} product данные 
	 */
	constructor(product: ProductUnit) {
		this._product = product;
		this.id = ArticleUnit.unitCount += 1;
	}

	/** название пролукта. */
	get title(): string { 
		return this._product.title;
	}
	/** цена продукта. */
	get price(): number { 
		return this._product.price;
	}
	/** количество продукта. */
	get amount(): number { 
		return this._product.amount;
	}
}
