// === МОДУЛЬ === форма создания списка-перечня.


/**
 * Назначение обработчиков вызываемых при создании списка
 * с помощью интерфейса формы.
 */
export default function createdOrderList(callback: CallableFunction) {
	callbacks.push(callback);
}

const callbacks = new Array<CallableFunction>();

// --- создание списка на выборочное количество дней ---
const btn_CustomDaysList = document.getElementById("btn_custom_days_list") as HTMLButtonElement;

btn_CustomDaysList.addEventListener("click", function (e) {
	console.dir(e);
    const element = e.target as HTMLElement;
    if (element != this) return;
    createOrderList((element.firstElementChild as HTMLInputElement).value);
});

btn_CustomDaysList.addEventListener("focus", function (e) {
    const element = e.target as HTMLButtonElement;
    if (element !== this) return;
        (element.firstElementChild as HTMLInputElement).focus();
});

btn_CustomDaysList.addEventListener("keypress", function (e) {
    const element = e.target as HTMLElement;
    if (element.nodeName !== "INPUT" || e.code !== "NumpadEnter") return;
    console.log((element as HTMLInputElement).value);
});

// TODO: Разобраться с возможным null значением ссылок на элементы. Проверить как будет работать если вернуть null.

// --- создание списка на 1 день ---
const btn_DayList  = document.getElementById("btn_day_list") as HTMLButtonElement;
btn_DayList.addEventListener("click", () => createOrderList(1));

// --- создание списка на неделю (7 дней) ---
const btn_WeakList = document.getElementById("btn_weak_list") as HTMLButtonElement;
btn_WeakList.addEventListener("click", () => createOrderList(7));

// --- создание списка на месяц (30 дней) ---
const btn_MonthList = document.getElementById("btn_month_list") as HTMLButtonElement;
btn_MonthList.addEventListener("click", () => createOrderList(30));

// --- создание отдельного списка покупок ---
const btn_OrderList = document.getElementById("btn_order_list") as HTMLButtonElement;
btn_OrderList.addEventListener("click", () => createOrderList(0));

const createOrderList = (arg: any) => callbacks.forEach(callback => callback(arg));
