// иннициализация компонентов модуля.
import { EventPeriod, periodController }    from "./controller-period-purshase";
import  periodFormClbcSet                   from "./form-budget-controller";
import { getBudgetPeriodLast, addBudgetPeriod } from "../datastorage";
import { viewBudgetInfoController }         from "./view-budget-info-display";
import { EventBudget } from "./BudgetPeriod";




// Создание периода в формой, помещение в контроллер и БД.
periodFormClbcSet(budget => {
	addBudgetPeriod(budget);
	periodController.addPeriod(budget, true);
});

// получение последнего (текщего) периода из бд.
getBudgetPeriodLast()
	.then(budget => periodController.addPeriod(budget, true), console.log);


// обновление данных на дисплее.
periodController.on(EventPeriod.add, period => {
	viewBudgetInfoController.freeMeans    = period.getAmount();
	viewBudgetInfoController.reserveMeans = period.getReserve();
	viewBudgetInfoController.utilizeMeans = period.getUtilize();
});

periodController.onItem(EventBudget.change, period => {
	viewBudgetInfoController.freeMeans    = period.getAmount();
	viewBudgetInfoController.reserveMeans = period.getReserve();
	viewBudgetInfoController.utilizeMeans = period.getUtilize();
});

export { periodController, EventPeriod };