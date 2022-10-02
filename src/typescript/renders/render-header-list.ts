import { ArticleList, ArticleListOrder } from "../units/article-list";

export interface IRenderListHeader {	
	get element() : HTMLElement;
	render(destination: HTMLElement): void;
	update(item: ArticleList): void;
}



export abstract class RenderListHeader<T> {

	protected _nodeElement = document.createElement('header');

	protected abstract initializer(item: T): void;
	public abstract update(item: T): void;

	constructor(protected _renderedItem: T) { }
	
	get element() {
		return this._nodeElement;
	}

	render(destination: HTMLElement) {
		this.initializer(this._renderedItem);
		destination.append(this._nodeElement);
	}
}

export class RenderOrderListHeader extends RenderListHeader<ArticleListOrder> {
	
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

	update(item: ArticleListOrder) {
		this.label    = item.label;
		this.quantity = item.quantity;
		this.term     = item.term;
		this.total    = item.total;
	}

	private _span_label = document.createElement('span');
	private _span_term = document.createElement('span');
	private _span_quantity = document.createElement('span');
	private _span_total = document.createElement('span');

	protected initializer(item: ArticleListOrder): void {
		this._span_label.classList.add("header-title");
		this._span_quantity.classList.add("header-quantity");
		this._span_term.classList.add("header-term");
		this._span_total.classList.add("header-total");

		this._nodeElement.append(
			this._span_term,
			this._span_label,
			this._span_quantity,
			this._span_total
		);
		this.update(item);
	}
}

export class RenderAssortimentListHeader extends RenderListHeader<ArticleList> {

	private _span_label = document.createElement('span');
	private _span_quantity = document.createElement('span');

	protected initializer(item: ArticleList): void {
		this._span_label.classList.add("header-title");
		this._span_quantity.classList.add("header-quantity");
		
		this._nodeElement.append(
			this._span_label,
			this._span_quantity
		);
		this.update(item);
	}

	update(item: ArticleList) {
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