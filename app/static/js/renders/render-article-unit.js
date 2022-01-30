/**
 * Представляет элемент ассортимента в списках товаров/заказов.
 */
export default class RenderArticleUnit  {
	_nodeElement = document.createElement('li');
	_span_title = document.createElement('span');
	_span_amount = document.createElement('span');
	_span_price = document.createElement('span');

	constructor() {
		this._nodeElement.append(
			this._span_title, 
			this._span_amount, 
			this._span_price
		);
	}
	insertInto(nodeElement) {
		nodeElement.append(this._nodeElement);
	}
	remove() {
		this._nodeElement.remove();
	}
	setClassName(classname) {
		this._nodeElement.classList.add(classname);
	}
	removeClassName(classname) {
		this._nodeElement.classList.remove(classname);
	}
	get getNode() { return this._nodeElement; }
	set setTitle(value) { this._span_title.textContent = value; }
	set setAmount(value) { this._span_amount.textContent = value; }
	set setPrice(value) { this._span_price.textContent = value; }
}; 