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
	constructor(dataset: {id: string, title: string, amount: number, price: number, measureType: symbol});
	constructor(productOrData: ProductUnit | {id: string, title: string, amount: number, price: number, measureType: symbol})
	{
		
			this.productId = productOrData.id
			this._title = productOrData.title;
			this._amount = productOrData.amount;
			this._price = productOrData.price;
			this._measure = productOrData.measureType;
		
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
