export class RenderHeaderList {

	protected _nodeElement = document.createElement('header');

	private _span_label = document.createElement('span');
	private _span_term = document.createElement('span');
	private _span_quantity = document.createElement('span');
	private _span_total = document.createElement('span');
	
	constructor() {
		this._nodeElement.append(
			this._span_label,
			this._span_term,
			this._span_quantity,
			this._span_total
		);
	}

	static fabricRender(): () => RenderHeaderList {
		return function () {
			return new RenderHeaderList();
		}
	}

	render(destination: HTMLElement) {
		destination.append(this._nodeElement);
	}

	get element() {
		return this._nodeElement;
	}

	set label(label: string) { 
		this._span_label.textContent = label; 
	}

	set term(term: string) { 
		this._span_term.textContent = term; 
	}

	set quantity(quantity: number) { 
		this._span_quantity.textContent = quantity.toString(10); 
	}

	set total(total: number) { 
		this._span_total.textContent = total.toString(10);
	}

}