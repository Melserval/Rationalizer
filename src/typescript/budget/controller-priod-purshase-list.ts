
// получает наборы активных список закупок.
// получает активный финансовый период.
// сводит их вместе. 
//
// синхронизирует запрос сумм в списках покупок из бюджетных периодов.

import { BudgetPeriod } from "./BudgetPeriod";
import { ArticleListOrder } from "../units/article-list";
import viewBudgetController from "./view-budget-info-display";

class ControllerCollectorPeriodPurshase {
	// текущий активный список закупок.
	// что бы не пересчитывать все списки в коллекции.
	private activePurshaseList: ArticleListOrder | null;
	
	// идентификатор текущего выбранного финансового периода.
	// значение "0" - для списков без определенного периода.
	private activePeriodId: number;

	private periodCollection: Map<number, BudgetPeriod>;
	private purshaseCollection: Map<number, ArticleListOrder[]>;

	constructor() {
		this.activePeriodId = 0;
		this.activePurshaseList = null;
		this.periodCollection = new Map();
		this.purshaseCollection = new Map();
	}

	addPeriod(period: BudgetPeriod) {
		this.activePeriodId = period.id;
		this.periodCollection.set(period.id, period);
	}

	addPurshase(purshase: ArticleListOrder) {
		if (this.purshaseCollection.get(this.activePeriodId) === undefined) {
			this.purshaseCollection.set(this.activePeriodId, []);
		} 
		this.purshaseCollection.get(this.activePeriodId)?.push(purshase);
		
		// HACK: тестовая реализация вычисления суммы баланса.
		purshase.on("additem", () => {
			if (this.activePeriodId == 0) return;
			const bp: BudgetPeriod = this.periodCollection.get(this.activePeriodId) as BudgetPeriod;
			
			viewBudgetController.freeMeans = bp.getAmount();
			viewBudgetController.reserveMeans = bp.getReserve();
			bp.addUtilize(purshase.total);
			viewBudgetController.utilizeMeans = bp.getUtilize();
		})
	}
}

/** Экзэмпляр класса контроллера-коллектора финансовых периодов и списков закупок. */
export default new ControllerCollectorPeriodPurshase();