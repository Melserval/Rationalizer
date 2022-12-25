import { ProductUnit } from '../units/product-unit';
import { ArticleUnit } from '../units/article-item';


/**
 * Представление единицы ассортимента в списках товаров/заказов.
 * 
 * @type T - тип объекта для которого предназначен рендер.
 */
export abstract class RenderArticleItem<T> {

	protected _nodeElement: HTMLLIElement;

	// Данные, которые будет отображать этот рендер.
	// Ссылка на объект-источник данных необходима
	// для доступа к источнику при манипуляциях с 
	// рендером через дисплей.
	protected renderableItem: T;
	
	/**
	 * @param   {T}  renderable  визуализируемый рендером объект.
	 */
	constructor(renderable: T) {
		this.renderableItem = renderable;
		this._nodeElement = document.createElement('li');
	}

	/**
	 * Формирует внутреннию HTML структуру компонента и задает начальные значения.
	 * @param item Объект с данными для визуализации.
	 */
	protected abstract initialize(): void;

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
		return this.renderableItem;
	}

	get element(): HTMLLIElement {
		return this._nodeElement;
	}

	/**
	 * Помещает созданный HTML элемент в DOM.
	 * @param destination элемент для размещения рендера.
	 */
	render(destination: HTMLElement) {
		this.initialize();
		destination.append(this._nodeElement);
	}
}

/**
 * Рендер объекта продукта для списка ассортимента.
 * 
 * @param ProductUnit визуализируемый рендером объект.
 */
export class RenderArticleProduct extends RenderArticleItem<ProductUnit> {

	private _span_title: HTMLSpanElement;
	private _span_package: HTMLSpanElement;
	private _span_amount: HTMLSpanElement;
	private _span_price: HTMLSpanElement;   

	constructor(renderable: ProductUnit) {
		super(renderable);

		this._span_title = document.createElement('span');
		this._span_title.classList.add("article-title");

		this._span_package = document.createElement('span');
		this._span_package.classList.add("article-package");

		this._span_amount = document.createElement('span');
		this._span_amount.classList.add("article-amount");

		this._span_price = document.createElement('span');
		this._span_price.classList.add("article-price");
		
		this._nodeElement.append(
			this._span_title,
			this._span_package,
			this._span_amount,
			this._span_price
		);
	}

	protected initialize(): void {
		this.title   = this.renderableItem.title;
		this.amount  = this.renderableItem.amount;
		this.price   = this.renderableItem.price;
		this.package = this.renderableItem.vendorType.labelShort;
	}

	set title(value: string) {
		this._span_title.textContent = value;
	}

	set amount(value: number) {
		this._span_amount.textContent = `${value} ${this.renderableItem.measureType.labelShort}`;
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

	private _span_title: HTMLSpanElement;
	private _span_amount: HTMLSpanElement;
	private _span_quantity: HTMLSpanElement;
	private _span_price: HTMLSpanElement;
	private _span_total: HTMLSpanElement;

	constructor(renderable: ArticleUnit) {
		super(renderable);

		this._span_title = document.createElement('span');
		this._span_title.classList.add("article-title");

		this._span_amount = document.createElement('span');
		this._span_amount.classList.add("article-amount");
		
		this._span_quantity = document.createElement('span');
		this._span_quantity.classList.add("article-quantity");
		
		this._span_price = document.createElement('span');
		this._span_price.classList.add("article-price");
		
		this._span_total = document.createElement('span');
		this._span_total.classList.add("article-total");
		
		this._nodeElement.append(
			this._span_title,
			this._span_amount,
			this._span_price,
			this._span_quantity,
			this._span_total
		);
	}
	
	protected initialize(): void {
		this.title    = this.renderableItem.title;
		this.amount   = this.renderableItem.amount;
		this.price    = this.renderableItem.price;
		this.quantity = this.renderableItem.quantity;
		this.total    = this.renderableItem.total;
	}

	set title(value: string) {
		this._span_title.textContent = value;
	}

	set amount(value: number) {
		const mtl = this.renderableItem.measureType.labelShort;
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
