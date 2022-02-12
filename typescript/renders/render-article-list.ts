import ArticleList from "../units/article-list.js";
import ArticleUnit from "../units/article-unit.js";
import RenderArticleUnit from "./render-article-unit.js";

/**
 * Представление списка элементов ассортимента.
 */
export default class RenderArticleList {
	
	public static articleListCollection = new Map<string, RenderArticleList>();
	public readonly id : string;
	public listInfo: string;
	protected focusedLiElement: HTMLLIElement | null = null;

	protected events: { [key: string]: CallableFunction[] } = {
		// обработчики события при выборе элемента (получен "фокус").
		"selectitem": new Array<CallableFunction>(),
		// обработчики события при потери фокуса.
		"deleteitem": new Array<CallableFunction>()
	};

	private _items = new Array<RenderArticleUnit>();
	private _nodeElement = document.createElement("div");
	private _header  = document.createElement('header');
	private _span_label = document.createElement('span');
	private _span_term = document.createElement('span');
	private _span_quantity = document.createElement('span');
	private _span_total = document.createElement('span');
	private _ul = document.createElement('ul');
	private _p = document.createElement('p');
	
	constructor(info: string = "Стандартный список") {

		this.listInfo = info;
		this.id = Date.now().toString(24);
		this._nodeElement.id = this.id;
		RenderArticleList.articleListCollection.set(this.id, this);

		this._header.append(
			this._span_label,
			this._span_term,
			this._span_quantity,
			this._span_total
		);
		this._nodeElement.append(this._header);
		this._nodeElement.append(this._ul);
		this._nodeElement.append(this._p);
		this._ul.classList.add("article_list__items");
		this._header.classList.add("article_list__header");
		this._nodeElement.classList.add("block-article_list");
		this._p.classList.add("article_list__info");
		this._p.textContent = this.listInfo;

		// FIXME: Решить как будет обрабатываться фокус на элементе - внутри класса или глобально.
		// // выбор элемента, фокус на него.
		// this._ul.addEventListener('click', (e) => {
		// 	const element = e.target as HTMLElement;
		// 	const elementLi = element.closest('.article_list__items li') as HTMLLIElement;
		// 	if (elementLi === null) return;
		// 	this.focusAssortimentUnit(elementLi);
		// });
		// // выбор элемента, запуск операций ассоциированных с ним.
		// this._ul.addEventListener("dblclick", (e) => {
		// 	this.events["selectitem"].forEach(e => e(this.focusedLiElement));
		// });
	}

	remove() {
		this._nodeElement.remove();
	}

	set label(label: string) { 
		this._span_label.textContent = label; 
	}

	set term(term: number) { 
		this._span_term.textContent = term.toString(10); 
	}

	set quantity(quantity: number) { 
		this._span_quantity.textContent = quantity.toString(10); 
	}

	set total(total: number) { 
		this._span_total.textContent = total.toString(10);
	}

	/**
	 * Получает объект с данными и отображает их в HTML.
	 * @param al Элемент с данными.
	 * @param destination Элемент контейнер для рендера.
	 */
	render(al: ArticleList, destination: HTMLElement) {

		destination.append(this._nodeElement);

		this.label = al.label;
		this.total = 10500;
		this.quantity = al.quantity;
		this.term = al.term;
		
		for (let item of al.items) {
			this.renderItem(item)
		}

		al.on('additem', this.renderItem.bind(this));
	}

	protected renderItem(item: ArticleUnit) {
		let renderLi = new RenderArticleUnit();
		renderLi.render(item, this._ul);
		this._items.push(renderLi);
	}
	
	// ------  обработка перемещения по списку и выбора элементов -------

	/** выделяет элемент LI в спике, показывая что он сейчас в "фокусе". */
	focusAssortimentUnit(li: HTMLLIElement | null) {
		try {
			if (li == null && this.focusedLiElement === null) {
				this.focusedLiElement = this._items?.[0]._nodeElement;
				this.focusedLiElement?.classList.add('focusedli');
				return;
			}
			if (li == null && this.focusedLiElement !== null) {
				this.focusedLiElement?.classList.add('focusedli');
				return;
			}
			if (li != null && this.focusedLiElement === li) {
				return;
			}
			this.focusedLiElement?.classList.remove('focusedli');
			this.focusedLiElement = li;
			this.focusedLiElement?.classList.add('focusedli');
			// TODO: возможно нужно определить событие.
		} catch (err) {
			console.error("Недопустимый HTML элемент", err);
		}
	}
	
	focusNextItem() {
		const li = this.focusedLiElement?.nextElementSibling
		           ?.closest('.article_list__items li') as HTMLLIElement;
		if (li) this.focusAssortimentUnit(li);
	}

	focusPreviousItem() {
		const li = this.focusedLiElement?.previousElementSibling
		           ?.closest('.article_list__items li') as HTMLLIElement;
		if (li) this.focusAssortimentUnit(li);
	}

	/** Визуально убирает фокус с элемента. */
	focusHide() {
		this.focusedLiElement?.classList.remove('focusedli');
	}
	
	/** Уставновка обработчика для события порожденных... */
	on(eventName: string, clb: CallableFunction): void {
		if (eventName in this.events) {
			this.events[eventName].push(clb);
		} else {
			throw new Error("Нет такого события для mainAssortiment!");
		}
	}

	/** удаление обработчиков */
	off(eventName: string, clb: CallableFunction) {
		if (eventName in this.events) {
			const callbacks = this.events[eventName];
			for (let i = callbacks.length - 1; i >= 0; i--) {
				if (callbacks[i] === clb) {
					callbacks.splice(i, 1);
				}
			}
		}
	}

	/** Вызов (активация) события */
	throw(eventName: string, arg: any) {
		if (eventName in this.events) {
			// TODO: разобраться с типами аргументов для событий.
			this.events[eventName].forEach(e => e(arg));
		} else {
			throw new Error(`Попытка вызвать не существующее событие (${eventName})`);
		}
	};
}
