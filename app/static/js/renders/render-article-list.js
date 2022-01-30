/**
 * Представление списка элементов ассортимента.
 */
export default class RenderArticleList {
	_nodeElement = document.createElement("div");
	_header  = document.createElement('header');
	_ul = document.createElement('ul');
	_span_label = document.createElement('span');
	_span_term = document.createElement('span');
	_span_quantity = document.createElement('span');
	_span_total = document.createElement('span');

	constructor() { 
		this._header.append(
			this._span_label,
			this._span_term,
			this._span_quantity,
			this._span_total
		);
		this._nodeElement.append(this._header);
		this._nodeElement.append(this._ul);
		this._ul.classList.add("items-list");
		this._header.classList.add("items-list-header");
		this._nodeElement.classList.add("block-order-list");
	}
	insertInto(nodeElement) {
		nodeElement.append(this._nodeElement);
	}
	remove() {
		this._nodeElement.remove();
	}
	append(HTMLElementLi) {
		this._ul.append(HTMLElementLi);
	}
	get getNode() { return this._nodeElement; }
	set label(label) { this._span_label.textContent = label; }
	set term(term) { this._span_term.textContent = term; }
	set quantity(quantity) { this._span_quantity.textContent = quantity; }
	set total(total) { this._span_total.textContent = total; }
}