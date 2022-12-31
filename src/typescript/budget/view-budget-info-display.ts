// контролирует отображение информации о состоянии бюджета на дисплее.

const budgetInfoArea = document.getElementById("budget-info-display") as HTMLDivElement;
const span_daysRemain = budgetInfoArea?.querySelector(".remain span:nth-child(2)") as HTMLSpanElement;
const span_freeMeans = budgetInfoArea?.querySelector(".free span:nth-child(2)") as HTMLSpanElement;
const span_reservMeans = budgetInfoArea?.querySelector(".reserv span:nth-child(2)") as HTMLSpanElement;
const span_utilizeMeans = budgetInfoArea?.querySelector(".utilize span:nth-child(2)") as HTMLSpanElement;


/** Установка показываемых на дисплее данных бюджетного периода. */
const viewBudgetInfoController = {
	
	set freeMeans(value: number) {
		span_freeMeans.textContent = value.toFixed(2);
	},
	set reserveMeans(value: number) {
		span_reservMeans.textContent = value.toFixed(2);
	},
	set utilizeMeans(value: number) {
		span_utilizeMeans.textContent = value.toFixed(2);
	},
	set daysRemain(value: number) {
		span_daysRemain.textContent = value.toString(10);
	}
};

export default viewBudgetInfoController;