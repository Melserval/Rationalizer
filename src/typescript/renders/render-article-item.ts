import { ProductUnit } from '../units/product-unit';
import { ArticleUnit } from '../units/article-item';

export type ArticleItems = RenderArticleProduct | RenderArticleUnit;

/**
 * Представляет элемент ассортимента в списках товаров/заказов.
 */
export abstract class RenderArticleItem<T> {

	protected _nodeElement: HTMLLIElement;
	
	constructor(
		protected _renderedItem: T
	) {
		this._nodeElement = document.createElement('li');
	}
	// NOTE: Над названием еще нужно поработать.
	protected abstract initialize(item: T): void;

	remove() {
		this._nodeElement.remove();
	}

	setClassName(classname: string) {
		this._nodeElement.classList.add(classname);
	}

	removeClassName(classname: string) {
		this._nodeElement.classList.remove(classname);
	}

	/** объект отображаемых данных */
	get dataItem(): T {
		return this._renderedItem;
	}

	get element(): HTMLLIElement {
		return this._nodeElement;
	}

	/**
	 * Помещает созданный HTML элемент в DOM.
	 * @param destination элемент для размещения рендера.
	 */
	render(destination: HTMLElement) {
		this.initialize(this._renderedItem);
		destination.append(this._nodeElement);
	}
}
/**
 * Рендер объекта продукта для списка ассортимента.
 */
export class RenderArticleProduct extends RenderArticleItem<ProductUnit> {

	_span_title = document.createElement('span');
	_span_package = document.createElement('span');
	_span_amount = document.createElement('span');
	_span_price = document.createElement('span');

	protected initialize(item: ProductUnit): void {
		this._nodeElement.append(
			this._span_title,
			this._span_package,
			this._span_amount,
			this._span_price
		);
		this._span_title.classList.add("article-title");
		this._span_package.classList.add("article-package");
		this._span_amount.classList.add("article-amount");
		this._span_price.classList.add("article-price");
	
		this.title = item.title;
		this.amount = item.amount;
		this.price = item.price;
		this.package = item.vendorType.labelShort;
	}

	set title(value: string) {
		this._span_title.textContent = value;
	}

	set amount(value: number) {
		// measureTypeLabel	
		const mtl = this._renderedItem.measureType.labelShort;
		this._span_amount.textContent = value.toString(10) + ` ${mtl}`;
	}
	
	set price(value: number) {
		this._span_price.textContent = value.toFixed(2);
	}

	set package(value: string) {
		this._span_package.textContent = value;
	}
}

/**
 * Рендер объекта заказанной единицы.
 */
export class RenderArticleUnit extends RenderArticleItem<ArticleUnit> {

	_span_title = document.createElement('span');
	_span_amount = document.createElement('span');
	_span_quantity = document.createElement('span');
	_span_price = document.createElement('span');
	_span_total = document.createElement('span');
	
	protected initialize(item: ArticleUnit): void {
		this._nodeElement.append(
			this._span_title,
			this._span_amount,
			this._span_price,
			this._span_quantity,
			this._span_total
		);
		this._span_title.classList.add("article-title");
		this._span_amount.classList.add("article-amount");
		this._span_quantity.classList.add("article-quantity");
		this._span_price.classList.add("article-price");
		this._span_total.classList.add("article-total");
		
		this.title = item.title;
		this.amount = item.amount;
		this.price = item.price;
		this.quantity = item.quantity;
		this.total = item.total;
	}

	set title(value: string) {
		this._span_title.textContent = value;
	}

	set amount(value: number) {
		const mtl = this._renderedItem.measureType.labelShort;
		this._span_amount.textContent = value.toString(10) + ` ${mtl}`;
	}

	set quantity(value: number) {
		this._span_quantity.textContent = value.toString(10);
	}
	
	set price(value: number) {
		this._span_price.textContent = value.toFixed(2);
	}

	set total(value: number) {
		this._span_total.textContent = value.toFixed(2);
	}
}
