
import { ArticleList, ArticleOrderList, EventItem } from "../units/article-list";
import { IArticleItem } from "../units/i-article-item";
import { RenderListHeader, RenderAssortimentListHeader, RenderOrderListHeader } from "./headers/render-list-header";
import { RenderArticleItem, RenderArticleProduct, RenderArticleUnit} from './render-article-item';
import { ProductUnit } from "../units/product-unit";
import { ArticleUnit } from "../units/article-item";

/**
 * Представление списка элементов ассортимента.
 */
export abstract class RenderArticleList {

	// HACK: Временная мера
	public static readonly articleListCollection = new Map<string, RenderArticleList>();

	public readonly listInfo: string;
	public readonly id : string;

	// Компонент представляющий шапку списка.
	protected abstract headerRender: RenderListHeader;

	// возвращает компонет для рендинга элементов списка.
	protected abstract getItemRender(item: any): RenderArticleItem<any>; 

	protected selectedLiItem: HTMLLIElement | null = null;
	
	protected events: { [key: string]: CallableFunction[] } = {
		// обработчики события при выборе элемента (получен "фокус").
		"selectitem": new Array<CallableFunction>(),
		// обработчики события при потере фокуса.
		"deleteitem": new Array<CallableFunction>(),
		// событие запрос выбранного элемента
		"requireitem": new Array<CallableFunction>() 
	};
	
	private _itemsRender = new Array<RenderArticleItem<IArticleItem>>();
	private _nodeElement = document.createElement("div");
	private _headerConteiner = document.createElement("div");
	private _ul = document.createElement('ul');
	private _p = document.createElement('p');
	

	constructor(listinfo: string) {
		this.listInfo = listinfo;
		this.id = Date.now().toString(24);
		this._nodeElement.id = this.id;

		this._nodeElement.append(this._headerConteiner);
		this._nodeElement.append(this._ul);
		this._nodeElement.append(this._p);

		this._nodeElement.classList.add("block-article_list");
		this._headerConteiner.classList.add("article_list__header");
		this._ul.classList.add("article_list__items");
		this._p.classList.add("article_list__info");
		
		this._p.textContent = this.listInfo;

		RenderArticleList.articleListCollection.set(this.id, this);
	}

	remove() {
		this._nodeElement.remove();
	}

	/**
	 * Получает объект с данными и отображает их в HTML.
	 * @param articleList Элемент с данными.
	 * @param destination Элемент контейнер для рендера.
	 */
	render<T extends IArticleItem>(articleList: ArticleList<T>, destination: HTMLElement) {
		destination.append(this._nodeElement);
		this.headerRender.render(this._headerConteiner);
		this.headerRender.showData(articleList);

		// рендер элементов коллекции.
		for (let item of articleList.items) {
			this.renderItem(item);
		}
		articleList.on(EventItem.add, (target: IArticleItem) => {
			this.renderItem(target);
			this.headerRender.showData(articleList);
		});
	}

	renderItem(item: IArticleItem) {
		let itemRender = this.getItemRender(item);
		itemRender.render(this._ul);
		this._itemsRender.push(itemRender); // T
	}
	
	// ------  обработка перемещения по списку и выбора элементов -------

	/** выделяет элемент LI в спике, показывая что он сейчас в "фокусе". */
	selectItem(li: HTMLLIElement | null) {
		try {
			if (li == null && this.selectedLiItem === null) {
				this.selectedLiItem = this._itemsRender?.[0].element;
				this.selectedLiItem?.classList.add('focusedli');
				return;
			}
			if (li == null && this.selectedLiItem !== null) {
				this.selectedLiItem?.classList.add('focusedli');
				return;
			}
			if (li != null && this.selectedLiItem === li) {
				return;
			}
			this.selectedLiItem?.classList.remove('focusedli');
			this.selectedLiItem = li;
			this.selectedLiItem?.classList.add('focusedli');
			// TODO: возможно нужно определить событие.
		} catch (err) {
			console.error("Недопустимый HTML элемент", err);
		}
	}
	
	selectNextItem() {
		const li = this.selectedLiItem?.nextElementSibling
		           ?.closest('.article_list__items li') as HTMLLIElement;
		if (li) this.selectItem(li);
	}

	selectPreviousItem() {
		const li = this.selectedLiItem?.previousElementSibling
		           ?.closest('.article_list__items li') as HTMLLIElement;
		if (li) this.selectItem(li);
	}

	/** Визуально убирает фокус с элемента. */
	focusHide() {
		this.selectedLiItem?.classList.remove('focusedli');
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
	throw(eventName: string, arg?: any) {
		if (eventName in this.events) {
			// TODO: разобраться с типами аргументов для событий.
			if (eventName === 'requireitem') {
				if (this.selectedLiItem) {
			// TODO: реализовать объект-контейнер с описанием/идентификатором для возвращаемых в коллбэки данных.
			// что бы получатель знал с каким типом данных он работает.
					const renderItem = this._itemsRender.find(renderau => renderau.element == this.selectedLiItem) ?? null;
					arg = renderItem && renderItem.dataItem;		
				} else {
					arg = null;
				}
			}
			this.events[eventName].forEach(e => e(arg));
		} else {
			throw new Error(`Попытка вызвать не существующее событие (${eventName})`);
		}
	}
}

export class RenderArticleAssortimentList extends RenderArticleList {

	protected getItemRender(item: ProductUnit) {
		return new RenderArticleProduct(item);
	}

	protected headerRender = new RenderAssortimentListHeader();
}

export class RenderArticleOrderList extends RenderArticleList {
	
	protected getItemRender(item: ArticleUnit) {
		return new RenderArticleUnit(item);
	}

	protected headerRender = new RenderOrderListHeader();
}