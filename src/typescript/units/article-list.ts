import ArticleUnit from "./article-unit";

/**
 * Данные составленого списка асортимента.
 */
export default class ArticleList {
	
	private _events: {[eventname: string]: CallableFunction[]} = {
		// событие добавление нового экземпляра ArticleUnit
		'additem': new Array<CallableFunction>(),
		// событие удаление экземпляра ArticleUnit
		'removeitem': new Array<CallableFunction>()
	};

	private _created: number = Date.now();
	private _items = new Map<number, ArticleUnit>();
	private _term: string;
	private _label: string;
	
	constructor(label: string);
	constructor(label: string, term: string);
	constructor(label: string, term: string, dataset: ArticleUnit[])
	constructor(label: string, term: string="0", dataset?: ArticleUnit[]) {
		this._label = label;
		this._term = term;
		if (dataset) {
			for (const au of dataset) {
				this.addItem(au);
			}
		}
	}

	/**
	 * Добавление ассортимента в список.
	 * @param au единица ассортимента.
	 */
	addItem(au: ArticleUnit) {
		this._items.set(au.id, au);
		this.dispatchEvent('additem', {detail: au});
	}
	
	/** коллекция элементов - позиций ассортимента.  */
	get items(): ArticleUnit[] {
		return Array.from(this._items.values());
	}
	/** количество асортимента. */
	get quantity(): number {
		return this._items.size;
	}
	/** временной отрезок (дней). */
	get term(): string {
		return this._term;
	}
	/** название, метка списка. */
	get label(): string {
		return this._label;
	}
	
	/** Уставновка обработчика для события порожденных... */
	on(eventName: string, clb: CallableFunction): void {
		if (eventName in this._events) {
			this._events[eventName].push(clb);
		} else {
			throw new Error("Нет такого события для ArticleList!");
		}
	}

	/** удаление обработчиков */
	off(eventName: string, clb: CallableFunction) {
		if (eventName in this._events) {
			const callbacks = this._events[eventName];
			for (let i = callbacks.length - 1; i >= 0; i--) {
				if (callbacks[i] === clb) {
					callbacks.splice(i, 1);
				}
			}
		} else {
			throw new Error("Нет такого события для ArticleList!");
		}
	}

	dispatchEvent(eventname: string, event: {detail: any, bubbles?: boolean, [key: string]: any}) {
		for (let clbc of this._events[eventname]) {
			clbc(event.detail);
		}
	}
}
