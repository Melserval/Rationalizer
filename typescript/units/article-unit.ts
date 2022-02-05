/**
 * Объект представляющий единицу продукта, хранящий цену и количество,
 * а также ссылку на на ассоциируемый с этим объектом тип ProductUnit.
 */

export default class ArticleUnit {
	/**
	 * @param {ProductUnit} product
	 */
	constructor(product) {
		this._product = product;
		this._views = [];
	}
	render() {
		this.constructor.renders.forEach(render => {
			let view = new render.renderView();
			view.insertInto(render.nodeElement);
			render.handler(view, this);
			this._views.push(view);
		});
	}
	get title() { return this._product.title; }
	get price() { return this._product.price; }
	get amount() { return this._product.amount; }

	static renders = [];
	static bindRender(nodeElement, renderView, handler) {
		this.renders.push({nodeElement, renderView, handler});
	}
}
