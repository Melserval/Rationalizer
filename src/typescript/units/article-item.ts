import { ProductUnit } from "./product-unit";
import { IArticleItem } from "./i-article-item";
import { ArticleList } from "./article-list";
import { DBSet } from "../datastorage";

export type ArticleUnitJson = {
	productId: string,
	quantity: number,
	price: number
}

/** 
 * Представляет ссылку на единицу ассортимента ProductUnit, хранит 
 * ассоциированное с ним - "заказанное" количество продукта и сумму.
 */
export class ArticleUnit implements IArticleItem {

	private static unitCount = 0;

	/** Уникальный идентификатор объекта. */
	public readonly id: string;

	/**
	 * @param productOrData данные 
	 */
	constructor(
		readonly product: IArticleItem, 
		private _quantity: number
	) {
		 this.id = (ArticleUnit.unitCount += 1).toString(10);
	}

	toJSON(): ArticleUnitJson {
		return {
			productId: this.product.id,
			quantity: this._quantity,
			price: this.price
		}
	}
	
	static fromJSON(item: ArticleUnitJson, product: ProductUnit): ArticleUnit {
		return new this(product, item.quantity);
	}

	static createFromDBSet(dbset: DBSet, products: Iterable<ProductUnit>): ArticleUnit {
		try {
			const productId: string = dbset.product_id;
			const quantity: number = parseInt(dbset.quantity);
			if (isNaN(quantity)) {
				throw Error("Недопустимое значение для числа");
			}
			for (const p of products) {
				if (p.id === productId) {
					return new ArticleUnit(p, quantity);
				}
			}
			throw Error(`Не найден продукт с id ${productId}.`);
		} catch (err) {
			console.error("Неудалось создать объект покупки из данных БД.", err);
		}
	}

	get productId(): string {
		return this.product.id;
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
	/** количество экзэмпляров продукта */
	get quantity(): number {
		return this._quantity;
	}
	get total(): number {
		return this.product.price * this._quantity;
	}
	get measureType() {
		return this.product.measureType;
	}
	get vendorType() {
		return this.product.vendorType;
	}
	
}
