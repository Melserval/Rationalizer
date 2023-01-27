// Оперирует коллекцией списков покупок.

import { ArticleOrderList, EventItem } from './article-list';
import { ArticleUnit } from "./article-item"
export type EventCallback<T> = (item: T) => any;

// События происходящие с коллекцией списков.
// То есть события этого контроллера.
export const enum  EventList {
	/** появление нового списка в коллекции. */
	add = "addlict",
	/** удаление списка из коллекции. */
	remove = "removelist",
	/** список стал активным. */
	activate = "activatelist",
	/** список перестал быть активным (срабатыват перед "activate"). */
	deactivate = "deactivatelist"
};

// Так же контролер пробрасывает наверх события из активного списка.

class ControllerOrderList {

	private _events: {[enventname:string]: Array<EventCallback<ArticleOrderList>>} = {
		[EventList.add] : new Array(),
		[EventList.remove]: new Array(),
		[EventList.activate]: new Array(),
		[EventList.deactivate]: new Array()
	};

	// хранение переносимых обработчиков с активного списка на следующий активный. 
	private _events_active_list = new Map<EventItem, Array<EventCallback<ArticleUnit>>>([
		[EventItem.add, new Array()],
		[EventItem.remove, new Array()]
	]);

	public listSetName: string;
	private listCollection = new Map<string, ArticleOrderList>();
	private _active_list: ArticleOrderList | undefined;

	constructor(setName: string) { 
		this.listSetName = setName;
	}

	dispatchEvent(eventname: EventList, eventitem: ArticleOrderList) {
		if (eventname in this._events) {
			for (const callback of this._events[eventname]) {
				callback(eventitem);
			}
		} else {
			console.error("Неизвестное событие", eventname);
		}
	}

	get active(): ArticleOrderList | null {
		return this._active_list ?? null;
	}

	private set activeList(value: ArticleOrderList) {
		if (this._active_list) {
			this.dispatchEvent(EventList.deactivate, this._active_list);
			// снятие обработчиков с предыдущего списка (если он был).
			this._events_active_list.forEach((clbcArray, eventName) => {
				clbcArray.forEach(callback => this._active_list?.off(eventName, callback));
			});
		}
		this._active_list = value;
		this.dispatchEvent(EventList.activate, value);
		
		// навешивание обработчиков заданных через этот контроллер.
		this._events_active_list.forEach((clbcArray, eventName) => {
			clbcArray.forEach(callback => value.on(eventName, callback));
		});


		console.log("Список теперь активен.", value.label);
	}

	addList(list: ArticleOrderList, listname?:string) {
		this.listCollection.set(list.label, list);
		this.dispatchEvent(EventList.add, list);
		// если это единственный список в коллекции 
		// тогда он становится активным.
		if (this.listCollection.size == 1) {
			this.activeList = list;
		}
	}

	removeList(item: string | ArticleOrderList): boolean {
		if (typeof item == "string" && this.listCollection.has(item)) {
			this.dispatchEvent(EventList.remove, this.listCollection.get(item) as ArticleOrderList);
			return this.listCollection.delete(item);
		} 
		if (typeof item == "object" && item instanceof ArticleOrderList) {
			for (const [k, v] of this.listCollection.entries()) {
				if (v === item) {
					this.dispatchEvent(EventList.remove, v);
					return this.listCollection.delete(k);
				}
			}
		}
		return false;
	}

	setActive(item: string | ArticleOrderList): boolean {
		if (typeof item == "string" && this.listCollection.has(item)) {
			this.activeList = <ArticleOrderList>this.listCollection.get(item);
			return true;
		}
		if (typeof item == "object" && item instanceof ArticleOrderList) {
			for (const [k, v] of this.listCollection.entries()) {
				if (item === v) {
					this.activeList = v;
					return true;
				}
			}
		}
		return false;
	}

	/** Уставновка обработчика контроллера. */
	on(eventName: EventList, clb: EventCallback<ArticleOrderList>): void {
		if (eventName in this._events) {
			this._events[eventName].push(clb);
		} else {
			throw new Error("Нет такого события для Конроллера списков!");
		}
	}

	/** удаление обработчиков конролера.*/
	off(eventName: EventList, clb: EventCallback<ArticleOrderList>) {
		if (eventName in this._events) {
			const callbacks = this._events[eventName];
			for (let i = callbacks.length - 1; i >= 0; i--) {
				if (callbacks[i] === clb) {
					callbacks.splice(i, 1);
				}
			}
		} else {
			throw new Error("Нет такого события для Конроллера списков!");
		}
	}

	// На самом деле обработчики тут только будут храниться,
	// установка/снятие со списков происходит в сеттере activeList.

	/** Уставновка обработчика для активного списка. */
	onList(eventName: EventItem, clb: (item: ArticleUnit, order?: ArticleOrderList) => void): void {
		
		if (this._events_active_list.has(eventName)) {
			this._events_active_list.get(eventName).push(clb);
		} else {
			throw new Error("Нет такого события для ArticleOrderList!");
		}
	}
	
	/** удаление обработчиков с активеного списка.*/
	offList(eventName: EventItem, clb: (list: ArticleUnit, Order?: ArticleOrderList) => void): void {
		if (this._events_active_list.has(eventName)) {
			const callbacks = this._events_active_list.get(eventName);
			for (let i = callbacks.length - 1; i >= 0; i--) {
				if (callbacks[i] === clb) {
					callbacks.splice(i, 1);
				}
			}
		} else {
			throw new Error("Нет такого события для ArticleOrderList!");
		}
	}

}

export { ControllerOrderList };