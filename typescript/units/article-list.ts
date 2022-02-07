import ArticleUnit from "./article-unit";

/**
 * Данные составленого списка асортимента.
 */
export default class ArticleList {
	private _created: number = Date.now();
	private _items: ArticleUnit[] = [];
	private _term: number = 0;
	
	constructor() 
	{ }

	/**
	 * Добавление ассортимента в список.
	 * @param au единица ассортимента.
	 */
	addAItem(au: ArticleUnit) {
		this._items.push(au);
	}

	/** количество асортимента. */
	get quantity(): number {
		return this._items.length;
	}
	/** временной отрезок (дней). */
	get term(): number {
		return this._term;
	}
}