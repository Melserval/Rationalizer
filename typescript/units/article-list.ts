import ArticleUnit from "./article-unit";

/**
 * Данные составленого списка асортимента.
 */
export default class ArticleList {
	private _created: number = Date.now();
	private _items: ArticleUnit[] = [];
	private _term: number = 0;
	private _label: string;
	
	constructor(label: string = "") 
	{ 
		this._label = label;
	}

	/**
	 * Добавление ассортимента в список.
	 * @param au единица ассортимента.
	 */
	addAItem(au: ArticleUnit) {
		this._items.push(au);
	}
	
	/** коллекция элементов - позиций ассортимента.  */
	get items(): ArticleUnit[] {
		return this._items;
	}
	/** количество асортимента. */
	get quantity(): number {
		return this._items.length;
	}
	/** временной отрезок (дней). */
	get term(): number {
		return this._term;
	}
	/** название, метка списка. */
	get label(): string {
		return this._label;
	}
}