import ArticleUnit from "../units/article-unit";

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

	remove() {
		this._nodeElement.remove();
	}

	setClassName(classname: string) {
		this._nodeElement.classList.add(classname);
	}

	removeClassName(classname: string) {
		this._nodeElement.classList.remove(classname);
	}

	get element() {
		return this._nodeElement;
	}
	set title(value: string) {
		this._span_title.textContent = value;
	}
	set amount(value: number) {
		this._span_amount.textContent = value.toString(10);
	}
	set price(value: number) {
		this._span_price.textContent = value.toFixed(2).toString();
	}

	/**
	 * Создает LI элемент, наполняет данными из au.
	 * @param au элемент с данными.
	 * @param destination элемент для размещения рендера.
	 */
	render(au: ArticleUnit, destination: HTMLElement) {
		destination.append(this._nodeElement);

		this.title = au.title;
		this.amount = au.amount;
		this.price = au.price;
		if (au.articleNum)
			this._nodeElement.dataset.articleNum = au.articleNum;
	}
};
