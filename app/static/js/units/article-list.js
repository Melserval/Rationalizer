import ArticleUnit from "./article-list.js";

/**
 * 
 */
export default class ArticleList {
	#created = Date.now();
	#number = ++this.constructor.#numbers;
	#articles = [];
	#views = [];
	#term = 0;
	constructor() { }

	/**
	 * 
	 * @param {ArticleUnit} au объект товар.
	 */
	addArticle(au) {
		this.articles.push(au);
		au.render();
	}

	render() {
		for (const {root, creater, handler} of this.constructor.#renders) {
			const view = new creater();
			this.#views.push(view);
			view.insertInto(root);
			handler(view, this);
		}
	}

	get quantity() {
		return this.#articles.length;
	}

	get term() {
		return this.#term;
	}


//static
	static #numbers = 0;
	static #renders = [];

	/**
	 * Привязка конструктора HTML визуализатора.
	 *
	 * @param   {HTMLElement}  root  где разместить.
	 * @param   {Creteable}  creater чем создавать.
	 * @param   {Callable}  handler  чем обработать данные.
	 *
	 * @return  {void}
	 */
	static bindRender(root, creater, handler) {
		this.#renders.push({ root, creater, handler });
	}
}
