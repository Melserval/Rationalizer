// Оперирует коллекцией списков покупок.

import ArticleList from './article-list';

class ControllerOrderList {

	public listSetName: string;
	private listCollection = new Map<string, ArticleList>();
	private activeList?: ArticleList;

	constructor(setName: string) { 
		this.listSetName = setName;
	}

	get active(): ArticleList | null {
		return this.activeList ?? null;
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
		if (typeof item == "string" && this.listCollection.has(item)) {
			this.activeList = this.listCollection.get(item);
			return true;
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