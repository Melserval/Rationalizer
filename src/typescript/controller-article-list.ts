// глобальное хранилище списков-контйнеров для экземпляров ArticleUnit.
// контролирует фокус на выбранных списках, списки выбраные для извлечения
// и/или получения (добавления) ассортимента.
import { ArticleList } from "./units/article-list";


type ListRole = "order" | "assortiment" | "reflection";

export class ControllerArticleList {

	/** целевой вью (DOM элемент), для взаимодействия с 
	 * элементами управления браузером (мышь, клавиатура)
	 * */
	private targetItemList: unknown;

	/** Реестр активных (выбранных) списков */
	private usedlist = new Map<ListRole, ArticleList>();

	private lists = new Map<ListRole, Set<ArticleList>>();

	constructor(public description: string) {
		this.lists.set("order", new Set<ArticleList>());
		this.lists.set("assortiment", new Set<ArticleList>());
	}

	/**
	 * 
	 * @param list коллекция элементов ArticleUnit.
	 * @param role вид и предназначения списка.
	 * @param asActive установить как активный (целевой).
	 */
	addList(list: ArticleList, role: ListRole,  asActive: boolean) {
		if (! this.lists.has(role)) {
			throw new Error("Недействительная роль для списка!");
		}
		this.lists.get(role)?.add(list);
		if (asActive) {
			this.usedlist.set(role, list);
		}
	}

	/**
	 * Установить активный список принимающий заказы.
	 */
	setReceivingList() {

	}

	/**
	 * Установить активный список выбираемых позиций.
	 */
	setSelectionList() {

	}
}
