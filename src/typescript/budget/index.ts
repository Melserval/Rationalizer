// иннициализация компонентов модуля.
import { EventPeriodController, periodController } from "./controller-budget-period";
import  periodFormClbcSet from "./form-budget-controller";
import { getBudgetPeriodLast, addBudgetPeriod } from "../datastorage";
import { viewBudgetInfoController } from "./view-budget-info-display";
import { BudgetPeriod, EventBudget } from "./BudgetPeriod";




// Создание периода в формой, помещение в контроллер и БД.
periodFormClbcSet(budget => {
	addBudgetPeriod(budget)
	.then(result => periodController.addPeriod(budget, true))
	.catch(console.error);
});

// получение последнего (текщего) периода из бд.
getBudgetPeriodLast()
	.then(budget => periodController.addPeriod(budget, true), console.log);

function setDisplayInfo(period: BudgetPeriod) {
	viewBudgetInfoController.startRemain  = period.getStartDate().toLocaleDateString();
	viewBudgetInfoController.endRemain    = period.getEndDate()?.toLocaleDateString() ?? "0";
	viewBudgetInfoController.daysRemain   = period.getDaysToEnd();
	viewBudgetInfoController.freeMeans    = period.getAmount();
	viewBudgetInfoController.reserveMeans = period.getReserve();
	viewBudgetInfoController.utilizeMeans = period.getUtilize();
}

// обновление данных на дисплее.
periodController.on(EventPeriodController.activate, setDisplayInfo);
periodController.onItem(EventBudget.change, setDisplayInfo);

export { periodController, EventPeriodController as EventPeriod };