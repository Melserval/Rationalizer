// Рендер для показа статистики в списках закупок/ассортимента/etc.
// Используется как внутренний компонент этих списков.

import { ArticleList, ArticleListOrder } from "../../units/article-list";

/** Базовый рендер заголовка для списков. */
export abstract class RenderListHeader {

	protected _nodeElement: HTMLElement;

	constructor() {
		this._nodeElement = document.createElement('header');
	}

	/**
	 * Принимает данные для показа в рендере заголовка.
	 *
	 * @param {unknown} item Данные для показа.
	 * @return  {void}
	 */
	public abstract showData(item: unknown): void;

	get element() {
		return this._nodeElement;
	}

	render(destination: HTMLElement) {
		destination.append(this._nodeElement);
	}
}

/** Рендер заголовка для списка закупок. */
export class RenderOrderListHeader extends RenderListHeader {

	private _span_label: HTMLSpanElement;   
	private _span_term: HTMLSpanElement;    
	private _span_quantity: HTMLSpanElement;
	private _span_total: HTMLSpanElement;   
	
	constructor() {
		super();

		this._span_label = document.createElement('span');
		this._span_label.classList.add("header-title");

		this._span_term = document.createElement('span');
		this._span_term.classList.add("header-term");
		
		this._span_quantity = document.createElement('span');
		this._span_quantity.classList.add("header-quantity");
		
		this._span_total = document.createElement('span');
		this._span_total.classList.add("header-total");
		
		this._nodeElement.append(
			this._span_term,
			this._span_label,
			this._span_quantity,
			this._span_total
		);
	}
	
	set label(label: string) { 
		this._span_label.textContent = `[${label}]`; 
	}
	set term(term: string) { 
		this._span_term.textContent = term; 
	}
	set quantity(quantity: number) { 
		this._span_quantity.textContent = quantity.toString(10); 
	}
	set total(total: number) { 
		this._span_total.textContent = total.toFixed(2);
	}

	showData(item: ArticleListOrder) {
		this.label    = item.label;
		this.quantity = item.quantity;
		this.term     = item.term;
		this.total    = item.total;
	}
}

/** Рендер заголовка для списка ассортимента. */
export class RenderAssortimentListHeader extends RenderListHeader {

	private _span_label: HTMLSpanElement;
	private _span_quantity: HTMLSpanElement;

	constructor() {
		super();

		this._span_label = document.createElement('span');
		this._span_label.classList.add("header-title");

		this._span_quantity  = document.createElement('span');
		this._span_quantity.classList.add("header-quantity");
		
		this._nodeElement.append(
			this._span_label,
			this._span_quantity
		);
	}

	showData(item: ArticleList) {
		this.label = item.label;
		this.quantity = item.quantity;
	}
	
	set label(label: string) { 
		this._span_label.textContent = `[${label}]`; 
	}

	set quantity(quantity: number) { 
		this._span_quantity.textContent = quantity.toString(10);
	}
}