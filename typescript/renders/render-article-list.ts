import ArticleList from "../units/article-list";
import RenderArticleUnit from "./render-article-unit";

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
	_items = new Array<RenderArticleUnit>();

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

	remove() {
		this._nodeElement.remove();
	}

	set label(label: string) { 
		this._span_label.textContent = label; 
	}

	set term(term: number) { 
		this._span_term.textContent = term.toString(10); 
	}

	set quantity(quantity: number) { 
		this._span_quantity.textContent = quantity.toString(10); 
	}

	set total(total: number) { 
		this._span_total.textContent = total.toString(10);
	}

	/**
	 * Получает объект с данными и отображает их в HTML.
	 * @param al Элемент с данными.
	 * @param destination Элемент контейнер для рендера.
	 */
	render(al: ArticleList, destination: HTMLElement) {

		destination.append(this._nodeElement);

		this.label = al.label;
		this.total = 10500;
		this.quantity = al.quantity;
		this.term = al.term;

		for (let item of al.items) {
			let renderLi = new RenderArticleUnit();
			renderLi.render(item, this._ul);
			this._items.push(renderLi);
		}
	}
}
