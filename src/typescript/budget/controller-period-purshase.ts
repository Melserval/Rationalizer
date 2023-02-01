// получает активный финансовый период.
// подписывается на события списков покупок. 
// используя эти события осуществляет вычисления финансов.
//
// синхронизирует запрос сумм в списках покупок из бюджетных периодов.
//
// Форма создания бюджетного периода подключается непосредственно к контроллеру.
// Дисплей показа информации по бюджету подключается непосредственно к контроллеру.
// Контроллер осуществляет обратную связь, между дисплеем и данными.

// типы
import { ArticleUnit } from "../units/article-item";
import { ArticleOrderList, EventItem } from "../units/article-list";
import { IArticleItem } from "../units/i-article-item";
import { BudgetPeriod } from "./BudgetPeriod";
// форма
import FormCreateBudgetPeriod from "./form-budget-controller";
// рендер
import viewBudgetController from "./view-budget-info-display";



export const enum EventPeriod {
	/** Добавлен новый период. */
	add = "add"
};

export type EventCallback = (item: BudgetPeriod) => void;

class ControllerCollectorPeriodPurshase {
	private _events: {[enventname:string]: Array<EventCallback>} = {
		[EventPeriod.add] : new Array()
	}
	// текущий активный список закупок.
	// что бы не пересчитывать все списки в коллекции.
	
	// идентификатор текущего выбранного финансового периода.
	// значение "0" - для списков без определенного периода.
	private _activePeriodId: string;

	// идентификаторы списков покупок для текущего периода.
	private activePeriodListId = new Set<number>();

	private periodCollection = new Map<string, BudgetPeriod>();

	constructor() {
		this._activePeriodId = "0";
		// FIX: (1)Разобраться с этим. Врядли это должно быть так прибито...
		FormCreateBudgetPeriod(this.addPeriod.bind(this)); // создаст объект периода .
	}

	get activePeriodId(): string {
		return this._activePeriodId;
	}

	/** Добавляет объект периода в контроллер */
	addPeriod(period: BudgetPeriod) {
		this._activePeriodId = period.id;
		this.periodCollection.set(period.id, period);
		this.dispatchEvent(EventPeriod.add, period);
		this.updateDisplayInfo(period);
	}

	/** Действия при добавлении позиции в список покупок. */
	protected handleAddPurshase(data: IArticleItem) {
		//HACK: временное преобразование.
		const item = data as ArticleUnit;

		if (!this._activePeriodId || !this.periodCollection.has(this._activePeriodId)) {
			return;
		}

		const bp: BudgetPeriod = this.periodCollection.get(this._activePeriodId) as BudgetPeriod;
		bp.addReserve(item.total);
		this.updateDisplayInfo(bp);
	}

	/** Действия при удалении позиции из списока покупок. */
	protected handleRemovePurshase(data: IArticleItem) {
		//HACK: временное преобразование.
		const item = data as ArticleUnit;

		if (!this._activePeriodId || !this.periodCollection.has(this._activePeriodId)) {
			return;
		}
		
		const bp: BudgetPeriod = this.periodCollection.get(this._activePeriodId) as BudgetPeriod;
		bp.addReserve(-(item.total));
		this.updateDisplayInfo(bp);
	}

	/** Действие при добавлении нового списка покупок. */
	handleAddedList(list: ArticleOrderList): void {
		this.activePeriodListId.add(list.created);
	}

	/** Действия при удалении списка покупок. */
	handleRemoveList(list: ArticleOrderList): void {
		this.activePeriodListId.delete(list.created);
	}

	updateDisplayInfo(bp: BudgetPeriod): void {
		// FIX: (2)Разобраться с этим. Врядли это должно быть так прибито...
		viewBudgetController.freeMeans = bp.getAmount();
		viewBudgetController.reserveMeans = bp.getReserve();
	}


	// установщики и щистильщики обработчиков событий на списках закупок.
	// это нужно что бы не захламлять пямять висящими на всех списках
	// фукциями-хандлерами, тут они снимаются и перевешиваются на активный список.

	/** Получает активный (целевой) список покупок. */
	setActiveList(list: ArticleOrderList): void {
		// вешает на этот список различные слушатели и обработчики.
		list.on(EventItem.add, this.handleAddPurshase.bind(this));
		list.on(EventItem.remove, this.handleRemovePurshase.bind(this));
	}
	
	/** Получает дективируемый список покупок. */
	unsetActiveList(list: ArticleOrderList): void {
		// удаляет свои обработчики и слушатели с этого списка.
		list.off(EventItem.add, this.handleAddPurshase.bind(this))
		list.off(EventItem.remove, this.handleRemovePurshase.bind(this));
	}

		/** Уставновка обработчика  */
	on(eventName: EventPeriod, clb: EventCallback): void {
		if (eventName in this._events) {
			this._events[eventName].push(clb);
		} else {
			throw new Error("Нет такого события для BudgetPeriod!");
		}
	}

	/** удаление обработчиков */
	off(eventName: EventPeriod, clb: EventCallback) {
		if (eventName in this._events) {
			const callbacks = this._events[eventName];
			for (let i = callbacks.length - 1; i >= 0; i--) {
				if (callbacks[i] === clb) {
					callbacks.splice(i, 1);
				}
			}
		} else {
			throw new Error("Нет такого события для BudgetPeriod!");
		}
	}

	dispatchEvent(eventname: EventPeriod, item: BudgetPeriod): void {
		this._events[eventname].forEach(clbc => clbc(item));
	}
}



/** Экзэмпляр класса контроллера-коллектора финансовых периодов и списков закупок. */
export default new ControllerCollectorPeriodPurshase();
