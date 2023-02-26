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
import { BudgetPeriod, EventBudget } from "./BudgetPeriod";


export const enum EventPeriodController {
	/** В коллекцию добавлен период. */
	add = "add",
	/** период назначен активным. */
	activate = "activate"
};


export type EventCallback = (item: BudgetPeriod) => void;


class ControllerCollectorPeriodPurshase {

	// обработчики собственных событий контроллера.
	private _events: {[enventname:string]: Array<EventCallback>} = {
		[EventPeriodController.add] : new Array(),
		[EventPeriodController.activate]: new Array()
	};

	// обработчики для событий на хранимых элементах.
	private _events_of_item = new Map<EventBudget, Array<EventCallback>>();
	
	// идентификатор текущего выбранного финансового периода.
	// значение "0" - для списков без определенного периода.
	private _activePeriodId: string;

	// идентификаторы списков покупок для текущего периода.
	private activePeriodListId = new Set<number>();

	private periodCollection = new Map<string, BudgetPeriod>();

	constructor() {
		this._activePeriodId = "0";
		
		// переброска обработчиков для активируемых элементов.
	}

	get activePeriodId(): string {
		return this._activePeriodId;
	}

	/** Вернет текущий активный финансовый период или Null если нет активного периода. */
	get activePeriod(): BudgetPeriod | null {
		return this.periodCollection.get(this._activePeriodId) ?? null;
	}

	/** Установит период из коллекции как активный по его Id. */
	activatePeriodById(id: string): boolean {
		if (this.periodCollection.has(id)) {
			this.activatePeriod(this.periodCollection.get(id));
			return true;
		}
		return false;
	}
	
	// устанавливает переданный элемент как активный,
	// вешает на него обработчики (для элементов),
	// а с предыдущего активного периода - снимает.
	private activatePeriod(period: BudgetPeriod) {
		const prevPeriod = this.periodCollection.get(this._activePeriodId);
		if (prevPeriod) {
			this._events_of_item.forEach((callbacks, eventName) => callbacks.forEach(prevPeriod.off.bind(prevPeriod, eventName)));
		}
		this._activePeriodId = period.id;
		this._events_of_item.forEach((callbacks, eventName) => callbacks.forEach(period.on.bind(period, eventName)));
		this.dispatchEvent(EventPeriodController.activate, period);
	}

	/** 
	 * Добавляет объект периода в контроллер
	 * Этот период станет активным если установлен флаг.
	 */
	addPeriod(period: BudgetPeriod, activate?: boolean) {
		this.periodCollection.set(period.id, period);
		this.dispatchEvent(EventPeriodController.add, period);
		if (activate) {
			this.activatePeriodById(period.id);
		}
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
	}

	/** Действие при добавлении нового списка покупок. */
	handleAddedList(list: ArticleOrderList): void {
		this.activePeriodListId.add(list.created);
	}

	/** Действия при удалении списка покупок. */
	handleRemoveList(list: ArticleOrderList): void {
		this.activePeriodListId.delete(list.created);
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
	on(eventName: EventPeriodController, clb: EventCallback): void {
		if (eventName in this._events) {
			this._events[eventName].push(clb);
		} else {
			throw new Error("Нет такого события для BudgetPeriod!");
		}
	}

	/** удаление обработчиков */
	off(eventName: EventPeriodController, clb: EventCallback) {
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

	dispatchEvent(eventname: EventPeriodController, item: BudgetPeriod): void {
		this._events[eventname].forEach(clbc => clbc(item));
	}

	/** Установка обработчиков для дочерних элементов. */
	onItem(eventName: EventBudget, callabck: (item: BudgetPeriod)=> void): void {
		if (this._events_of_item.has(eventName)) {
			this._events_of_item.get(eventName).push(callabck);
		} else {
			this._events_of_item.set(eventName, [callabck])
		}
	}

	offItem(eventName: EventBudget, callabck: EventCallback): void {
		if (this.activePeriod && this._events_of_item.has(eventName)) {
			this.activePeriod.off(eventName, callabck);
			const callbacks = this._events_of_item.get(eventName);
			for (let i = callbacks.length - 1; i >= 0; i--) {
				if (callbacks[i] === callabck) {
					callbacks.splice(i, 1);
				}
			}
		}
	}
}

/** Экзэмпляр класса контроллера-коллектора финансовых периодов и списков закупок. */
export const periodController = new ControllerCollectorPeriodPurshase();