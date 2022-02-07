import { ProductUnit } from "./product-unit";
/**
 * Объект представляющий единицу продукта, хранящий цену и количество,
 * а также ссылку на на ассоциируемый с этим объектом тип ProductUnit.
 */
export default class ArticleUnit {

	private _product: ProductUnit;
	
	/**
	 * @param {ProductUnit} product
	 */
	constructor(product: ProductUnit) {
		this._product = product;
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
