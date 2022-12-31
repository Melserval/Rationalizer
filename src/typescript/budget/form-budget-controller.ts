// модуль назначения финансовых периодов и бюджета.

import { BudgetPeriod } from "./BudgetPeriod";

const callbacks: CallableFunction[] = [];

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
	const errors: Error[] = [];
	try {
		if (input_StartPeriod.valueAsDate == null) 
			errors.push( new Error("Поле не должно быть пустым"));
		if (input_EndPeriod.valueAsDate == null) 
			errors.push(new Error("Поле не должно быть пустым"));
		if (+input_BudgetAmount.value == 0) 
			errors.push(new Error("Сумма не должна быть 0"));
		if (input_StartPeriod.valueAsNumber >= input_EndPeriod.valueAsNumber) 
			errors.push(new Error("Конечная дата не должна быть меньше начальной"));

		if (errors.length > 0) throw errors;

		const budgetPeriod = new BudgetPeriod(
			parseFloat(input_BudgetAmount.value),
			input_StartPeriod.valueAsDate as Date,
			input_EndPeriod.valueAsDate as Date
		);
		
		callbacks.forEach(clb => clb(budgetPeriod));
	} catch (err) {
		console.error("Форма установки бюджета:", ...errors);
	}

});

form_BudgetSetting.addEventListener("reset", function(e) {
	//HACK: Hmm... как то бы указать что вызывать ПОСЛЕ очистки.
	setTimeout(() => input_StartPeriod.valueAsDate = new Date(), 10);
});

console.log("buget module is loaded.");

/** Установщик колбэков получающих объект-финансовый период. */
export default function(callback: CallableFunction) {
	callbacks.push(callback);
}