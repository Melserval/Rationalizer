// Оперирует коллекцией списков покупок.

import ArticleList from './article-list';

class ControllerOrderList {

	public listSetName: string;
	private listCollection = new Map<string, ArticleList>();
	private _active_list: ArticleList | undefined;

	constructor(setName: string) { 
		this.listSetName = setName;
	}

	get active(): ArticleList | null {
		return this._active_list ?? null;
	}

	private set activeList(value: ArticleList) {
		this._active_list = value;
		// TODO: здесь должно создаваться событие при установке списка активным.
		console.log("Список теперь активен.", value.label);
	}

	addList(list: ArticleList, listName: string) {
		this.listCollection.set(listName, list);
		if (this.listCollection.size == 1) {
			this.activeList = list;
		}
	}

	removeList(item: string | ArticleList): boolean {
		if (typeof item == "string" && this.listCollection.has(item)) {
			return this.listCollection.delete(item);
		} 
		if (typeof item == "object" && item instanceof ArticleList) {
			for (const [k, v] of this.listCollection.entries()) {
				if (v === item) {
					return this.listCollection.delete(k);
				}
			}
		}
		return false;
	}

	setActive(item: string | ArticleList): boolean {
		if (typeof item == "string") {
			this.activeList = <ArticleList>this.listCollection.get(item);
		}
		if (typeof item == "object" && item instanceof ArticleList) {
			for (const [k, v] of this.listCollection.entries()) {
				if (item === v) {
					this.activeList = v;
					return true;
				}
			}
		}
		return false;
	}

}

export default ControllerOrderList;