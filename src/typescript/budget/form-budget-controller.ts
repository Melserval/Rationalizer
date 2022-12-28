// модуль назначения финансовых периодов и бюджета.


const form_BudgetSetting = document.getElementById("form-budget-setting") as HTMLFormElement;
// элементы ввода формы.
const input_StartPeriod  = document.getElementById("input-start-period") as HTMLInputElement;
const input_EndPeriod    = document.getElementById("input-end-period") as HTMLInputElement;
const input_BudgetAmount = document.getElementById("input-budget-amount") as HTMLInputElement;
const btn_ConfirmPeriod  = document.getElementById("btn-confirm-period") as HTMLButtonElement;

// FIX: Почему неактуальная дата?
input_StartPeriod.valueAsDate = new Date();

form_BudgetSetting.addEventListener("submit", function(e) {
	e.preventDefault();
	console.log(input_StartPeriod);
	console.log(input_EndPeriod);
	console.log(input_BudgetAmount);
});

form_BudgetSetting.addEventListener("reset", function(e) {
	//HACK: Hmm... как то бы указать что вызывать ПОСЛЕ очистки.
	setTimeout(() => input_StartPeriod.valueAsDate = new Date(), 10);
});


// бюджетный период
class BudgetPeriod {
	private _startPeriod: Date;
	private _endPeriod: Date;
	private _budgetAmout: number;
	private _budgetReserved: number;
	private _budgetUtilize: number;

	constructor(amount: number, start: Date, end?: Date) {
		this._budgetAmout = amount;
		this._startPeriod = start;
		this._endPeriod = end || (end = new Date(), end.setMonth(start.getMonth() + 1), end);
		this._budgetReserved = 0;
		this._budgetUtilize = 0;
	}
}

console.log("buget module is loaded.");

export {BudgetPeriod};