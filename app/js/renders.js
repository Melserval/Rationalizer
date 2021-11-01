// элементы ui.
"use strict";

/**
 * Представляет элемент ассортимента в списках товаров/заказов.
 */
class RenderListUnit  {
	_node_li = document.createElement('li');
	_span_name = document.createElement('span');
	_span_amount = document.createElement('span');
	_span_price = document.createElement('span');

	constructor() {
		this._node_li.append(
			this._span_name, 
			this._span_amount, 
			this._span_price
		);
	}
	insertInto(nodeElement) {
		nodeElement.append(this._node_li);
	}
	remove() {
		this._node_li.remove();
	}
	set setName(value) { this._span_name.textContent = value; }
	set setAmount(value) { this._span_amount.textContent = value; }
	set setPrice(value) { this._span_price.textContent = value; }
}; 

/**
 * Представление списка элементов ассортимента.
 */
class RenderOrderList {
	_node_div = document.createElement("div");
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
		this._node_div.append(this._header);
		this._node_div.append(this._ul);
		this._ul.classList.add("items-list")
		this._header.classList.add("items-list-header")
		this._node_div.classList.add("block-order-list");
	}
	insertInto(nodeElement) {
		nodeElement.append(this._node_div);
	}
	remove() {
		this._node_li.remove();
	}
	append(HTMLElementLi) {
		this._ul.append(HTMLElementLi);
	}
	set label(label) { this._span_label.textContent = label; }
	set term(term) { this._span_term.textContent = term; }
	set quantity(quantity) { this._span_quantity.textContent = quantity; }
	set total(total) { this._span_total.textContent = total; }
 }