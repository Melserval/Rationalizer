// модуль назначения финансовых периодов и бюджета.

import { BudgetPeriod } from "./BudgetPeriod";

const callbacks: CallableFunction[] = [];

const form_BudgetSetting   = document.getElementById("form-budget-setting") as HTMLFormElement;
// элементы ввода формы.
const input_StartPeriod    = document.getElementById("input-start-period") as HTMLInputElement;
const input_EndPeriod      = document.getElementById("input-end-period") as HTMLInputElement;
const input_BudgetAmount   = document.getElementById("input-budget-amount") as HTMLInputElement;
const input_RateOfExchange = document.getElementById("input-rate-of-exchange") as HTMLInputElement;
const btn_ConfirmPeriod    = document.getElementById("btn-confirm-period") as HTMLButtonElement;
const p_FormMessage        = document.getElementById("p-budget-message") as HTMLParagraphElement;


// FIX: Почему неактуальная дата?
const today = new Date();
input_StartPeriod.valueAsDate = today;

// установка инимально возможной конечной даты - на 1 день длиннее текущей.
// для установки атрибута "min" требуется формат вида "2022-01-01".
today.setDate(today.getDate() + 1);
const month = today.getMonth() < 9 ? "0" + (today.getMonth() + 1): today.getMonth() + 1 + "";
const day = today.getDate() < 10 ? "0" + today.getDate(): today.getDate() + "";
input_EndPeriod.setAttribute("min", `${today.getFullYear()}-${month}-${day}`);

// при фокусе убирает дефолтный "0" мешающий вводу суммы.
function eraseInputNull(this: HTMLInputElement) { if (this.value == "0") this.value = ""; }
input_BudgetAmount.addEventListener('focusin', eraseInputNull);
input_RateOfExchange.addEventListener('focusin', eraseInputNull);

// при потере фокуса, если сумма не вводилась, возвращает "0".
function writeInputNull(this: HTMLInputElement) { if (this.value == "") this.value = "0"; }
input_BudgetAmount.addEventListener('focusout', writeInputNull);
input_RateOfExchange.addEventListener('focusout', writeInputNull);

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
			0,
			0,
			parseFloat(input_RateOfExchange.value),
			input_StartPeriod.valueAsDate as Date,
			input_EndPeriod.valueAsDate as Date
		);
		p_FormMessage.textContent = "Бюджет принят! clap-clap!";
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
export default function(callback: (item: BudgetPeriod) => void) {
	callbacks.push(callback);
}