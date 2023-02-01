import { ArticleUnit } from "./article-item";
import { IArticleItem } from "./i-article-item";

type EventCallback<T extends IArticleItem> = (item: T, target?: ArticleList<T>) => void;

export const enum EventItem {
	/** добавлен элемент IArticleItem. */
	add = "additem",
	/** удален элемент IArticleItem. */
	remove = "removeitem"
};

export type ArticleListJson = {
	id: string,
	created: string,
	label: string
}

export type OrderListJson = ArticleListJson & {
	term: string,
	total: number
}

/**
 * Данные составленого списка асортимента.
 * 
 * @event additem при добавлении в коллекцию элемента.
 * @event removeitem при удалении элемента из коллекции.
 */
export class ArticleList<T extends IArticleItem=IArticleItem> {
	
	private _events: {[eventname: string]: Array<EventCallback<T>>} = {
		[EventItem.add]: new Array(),
		[EventItem.remove]: new Array()
	};

	readonly created: number;
	readonly id: string;
	protected _items = new Map<string, T>();
	private _label: string;

	constructor(label: string, created: number=Date.now()) {
		this._label = label;
		this.created = created;
		this.id = created.toString(36);
	}

	toJSON(): ArticleListJson {
		return {
			id: this.id,
			created: new Date(this.created).toISOString(),
			label: this.label
		}
	}
	
	/**
	 * Добавление ассортимента в список.
	 * @param au единица ассортимента.
	 */
	addItem(au: T | T[]) {
		if (Array.isArray(au)) {
			for (const item of au) {
				this.addItem(item);
			}
		} else {
			this._items.set(au.id, au);
			this.dispatchEvent('additem', au);
		}
	}

	getItem(id: string): T | null {
		return this._items.get(id) ?? null;
	}
	
	/** коллекция элементов - позиций ассортимента.  */
	get items(): T[] {
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
	on(eventName: EventItem, clb: EventCallback<T>): void {
		if (eventName in this._events) {
			this._events[eventName].push(clb);
		} else {
			throw new Error("Нет такого события для ArticleList!");
		}
	}

	/** удаление обработчиков */
	off(eventName: EventItem, clb: EventCallback<T>) {
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

	dispatchEvent(eventname: string, item: T) {
		for (let clbc of this._events[eventname]) {
			clbc(item, this);
		}
	}
}


export class ArticleOrderList extends ArticleList<ArticleUnit> {
	
	private _term: string;

	constructor(label: string, term: string, created?: number) {
		super(label, created);
		this._term = term;
	}

	override toJSON(): OrderListJson {
		return Object.assign(super.toJSON(), {
			quantity: this.quantity,
			total: this.total,
			term: this.term
		});
	}

	/** временной отрезок (дней). */
	get term(): string {
		return this._term;
	}

	/** общая сумма покупок. */ 
	get total(): number {
		let total = 0;
		for (const item of (this._items as Map<string, ArticleUnit>).values()) {
			total += item.total;
		}
		return total;
	}
}
