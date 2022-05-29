import { IArticleItem } from "./i-article-item";

/**
 * Данные составленого списка асортимента.
 */
export class ArticleList {
	
	private _events: {[eventname: string]: CallableFunction[]} = {
		// событие добавление нового экземпляра IArticleItem
		'additem': new Array<CallableFunction>(),
		// событие удаление экземпляра IArticleItem
		'removeitem': new Array<CallableFunction>()
	};

	private _created: number = Date.now();
	private _items = new Map<string, IArticleItem>();
	private _label: string;
	
	constructor(label: string);
	constructor(label: string) {
		this._label = label;
	}
	
	/**
	 * Добавление ассортимента в список.
	 * @param au единица ассортимента.
	 */
	addItem(au: IArticleItem | IArticleItem[]) {
		if (Array.isArray(au)) {
			for (const item of au) {
				this.addItem(item);
			}
		} else {
			this._items.set(au.id, au);
			this.dispatchEvent('additem', {detail: au});
		}
	}

	getItem(id: string): IArticleItem | null {
		return this._items.get(id) ?? null;
	}
	
	/** коллекция элементов - позиций ассортимента.  */
	get items(): IArticleItem[] {
		return Array.from(this._items.values());
	}
	/** количество асортимента. */
	get quantity(): number {
		return this._items.size;
	}
	/**
	 * Название, метка списка.
	 *
	 * @return  {string}  метка
	 */
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


export class ArticleListOrder extends ArticleList {

	/** временной отрезок (дней). */
	get term(): string {
		return this._term;
	}

	constructor(label: string, term: string) {
		super(label);
		this._term = term;
	}

	private _term: string;

}
