// контролирует отображение информации о состоянии бюджета на дисплее.

const budgetInfoArea = document.getElementById("budget-info-display") as HTMLDivElement;

const span_startRemain = budgetInfoArea?.querySelector(".remain-start .value") as HTMLSpanElement;
const span_endRemain = budgetInfoArea?.querySelector(".remain-end .value") as HTMLSpanElement;
const span_daysRemain = budgetInfoArea?.querySelector(".remain-days .value") as HTMLSpanElement;
const span_freeMeans = budgetInfoArea?.querySelector(".free span:nth-child(2)") as HTMLSpanElement;
const span_reservMeans = budgetInfoArea?.querySelector(".reserv span:nth-child(2)") as HTMLSpanElement;
const span_utilizeMeans = budgetInfoArea?.querySelector(".utilize span:nth-child(2)") as HTMLSpanElement;


/** Установка показываемых на дисплее данных бюджетного периода. */
const viewBudgetInfoController = {

	set startRemain(value: string) {
		span_startRemain.textContent = value;
	},
	set endRemain(value: string) {
		span_endRemain.textContent = value;
	},
	set daysRemain(value: number) {
		span_daysRemain.textContent = value.toFixed(0);
	},
	set freeMeans(value: number) {
		span_freeMeans.textContent = value.toFixed(2);
	},
	set reserveMeans(value: number) {
		span_reservMeans.textContent = value.toFixed(2);
	},
	set utilizeMeans(value: number) {
		span_utilizeMeans.textContent = value.toFixed(2);
	}
};

/** Управление отображеним данных периода на дисплее */
export { viewBudgetInfoController };