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
import { ArticleList, EventItem } from "../units/article-list";
import { IArticleItem } from "../units/i-article-item";
import { BudgetPeriod } from "./BudgetPeriod";
// форма
import FormCreateBudgetPeriod from "./form-budget-controller";
// рендер
import viewBudgetController from "./view-budget-info-display";


class ControllerCollectorPeriodPurshase {
	// текущий активный список закупок.
	// что бы не пересчитывать все списки в коллекции.
	// private activePurshaseList: ArticleListOrder | null;
	
	// идентификатор текущего выбранного финансового периода.
	// значение "0" - для списков без определенного периода.
	private activePeriodId: number;

	// идентификаторы списков покупок для текущего периода.
	private activePeriodListId = new Set<number>();

	private periodCollection = new Map<number, BudgetPeriod>();

	constructor() {
		this.activePeriodId = 0;
		// FIX: (1)Разобраться с этим. Врядли это должно быть так прибито...
		FormCreateBudgetPeriod(this.addPeriod.bind(this)); // создаст объект периода .
	}

	/** Добавляет объект периода в контроллер */
	addPeriod(period: BudgetPeriod) {
		this.activePeriodId = period.id;
		this.periodCollection.set(period.id, period);
	}

	/** Действия при добавлении позиции в список покупок. */
	protected handleAddPurshase(data: IArticleItem) {
		//HACK: временное преобразование.
		const item = data as ArticleUnit;

		if (this.activePeriodId == 0 || !this.periodCollection.has(this.activePeriodId)) {
			return;
		}

		const bp: BudgetPeriod = this.periodCollection.get(this.activePeriodId) as BudgetPeriod;
		bp.addReserve(item.total);
		this.updateDisplayInfo(bp);
	}

	/** Действия при удалении позиции из списока покупок. */
	protected handleRemovePurshase(data: IArticleItem) {
		//HACK: временное преобразование.
		const item = data as ArticleUnit;

		if (this.activePeriodId == 0 || !this.periodCollection.has(this.activePeriodId)) {
			return;
		}
		
		const bp: BudgetPeriod = this.periodCollection.get(this.activePeriodId) as BudgetPeriod;
		bp.addReserve(-(item.total));
		this.updateDisplayInfo(bp);
	}

	/** Действие при добавлении нового списка покупок. */
	handleAddedList(list: ArticleList): void {
		this.activePeriodListId.add(list.created);
	}

	/** Действия при удалении списка покупок. */
	handleRemoveList(list: ArticleList): void {
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
	setActiveList(list: ArticleList): void {
		// вешает на этот список различные слушатели и обработчики.
		list.on(EventItem.add, this.handleAddPurshase.bind(this));
		list.on(EventItem.remove, this.handleRemovePurshase.bind(this));
	}
	
	/** Получает дективируемый список покупок. */
	unsetActiveList(list: ArticleList): void {
		// удаляет свои обработчики и слушатели с этого списка.
		list.off(EventItem.add, this.handleAddPurshase.bind(this))
		list.off(EventItem.remove, this.handleRemovePurshase.bind(this));
	}
}



/** Экзэмпляр класса контроллера-коллектора финансовых периодов и списков закупок. */
export default new ControllerCollectorPeriodPurshase();