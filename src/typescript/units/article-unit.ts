import { ProductUnit } from "./product-unit";
import { MeasureType } from "../types";


/** 
 * Представляет ссылку на единицу ассортимента ProductUnit, хранит 
 * ассоциированное с ним - "заказанное" количество продукта и сумму.
 */
export default class ArticleUnit {

	private static unitCount = 0;

	/** Уникальный идентификатор объекта. */
	public readonly id: number;

	public readonly productId: string;
	private _price: number;
	private _amount: number;
	private _title: string;
	private _measure: symbol;
	
	/**
	 * @param productOrData данные 
	 */
	constructor(product: ProductUnit);
	constructor(id: string, title: string, amount: number, price: number, measureType: symbol);
	constructor(productOrId: ProductUnit | string, title="", amount=0, price=0, measureType=Symbol("less")) {
		if (productOrId instanceof ProductUnit) {
			this.productId = productOrId.id;
			this._title    = productOrId.title;
			this._amount   = productOrId.amount;
			this._price    = productOrId.price;
			this._measure  = productOrId.measureType;
		} else {
			this.productId = productOrId;
			this._title    = title;
			this._amount   = amount;
			this._price    = price;
			this._measure  = measureType;
		}
		
		this.id = ArticleUnit.unitCount += 1;
	}

	/** название продукта. */
	get title(): string { 
		return this._title;
	}
	/** цена продукта. */
	get price(): number { 
		return this._price;
	}
	/** количество продукта. */
	get amount(): number { 
		return this._amount;
	}
	/** информация о товарной единице. */
	get measureType() {
		return MeasureType.info(this._measure);
	}
}
