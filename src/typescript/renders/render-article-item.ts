import { ProductUnit } from '../units/product-unit';
import { ArticleUnit } from '../units/article-item';
/**
 * Представляет элемент ассортимента в списках товаров/заказов.
 */
export class RenderArticleItem<T> {

	protected _nodeElement: HTMLLIElement; 
	protected _children = new Array<HTMLElement>();
	
	protected constructor(
		protected _renderedItem: T
	) {
		this._nodeElement = document.createElement('li');
		this._nodeElement.append(...this._children);
	}

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

	//abstract initialize(item: T): void;

	/**
	 * Создает LI элемент, наполняет данными из au.
	 * @param au элемент с данными.
	 * @param destination элемент для размещения рендера.
	 */
	render(destination: HTMLElement) {
		destination.append(this._nodeElement);
	}

	/**
	 * Объект для рендера объекта ассортимента.
	 *
	 * @param   {U}  item  объект ассортимента.
	 * @return  {[type]}   Рендер.
	 */
	static renderFor<U>(item: U) {
		return new this(item);
	}
}
/**
 * Рендер объекта продукта.
 */
export class RenderArticleProduct<T extends ProductUnit> extends RenderArticleItem<T> {

	_span_title = document.createElement('span');
	_span_package = document.createElement('span');
	_span_amount = document.createElement('span');
	_span_price = document.createElement('span');
	
	constructor(item: T) {
		super(item);
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
		this._span_price.textContent = value.toFixed(2).toString();
	}

	set package(value: string) {
		this._span_package.textContent = value;
	}
}

/**
 * Рендер объекта заказанной единицы.
 */
export class RenderArticleUnit<T extends ArticleUnit> extends RenderArticleItem<T> {

	_span_title = document.createElement('span');
	_span_amount = document.createElement('span');
	_span_price = document.createElement('span');
	
	constructor(item: T) {
		super(item);

		this._nodeElement.append(
			this._span_title,
			this._span_amount,
			this._span_price
		);
		this._span_title.classList.add("article-title");
		this._span_amount.classList.add("article-amount");
		this._span_price.classList.add("article-price");
		
		this.title = item.title;
		this.amount = item.amount;
		this.price = item.price;
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
		this._span_price.textContent = value.toFixed(2).toString();
	}
}
