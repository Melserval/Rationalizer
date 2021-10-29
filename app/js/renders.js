// элементы ui.
"use strict";

class RenderAssortimentUnit  {
	_node_li = doucument.createElement('li');
	_span_name = doucment.createElement('span');
	_span_amount = doucment.createElement('span');
	_span_price = doucment.createElement('span');

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