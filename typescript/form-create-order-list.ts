// === МОДУЛЬ === форма создания списка-перечня.


/**
 * Назначение обработчиков вызываемых при создании списка
 * с помощью интерфейса формы.
 */
export default function createdOrderList(callback) {
	callbacks.push(callback);
}

const callbacks = [];

// --- создание списка на выборочное количество дней ---
const btn_CustomDaysList = document.getElementById("btn_custom_days_list");

btn_CustomDaysList.addEventListener("click", function (e) {
	console.dir(e);
    if (e.target != this) return;
    createOrderList(e.target.firstElementChild.value);
});

btn_CustomDaysList.addEventListener("focus", function (e) {
    console.dir(e);
    if (e.target !== this) return;
    e.target.firstElementChild.focus();
});

btn_CustomDaysList.addEventListener("keypress", function (e) {
    if (e.target.nodeName !== "INPUT" || e.code !== "NumpadEnter") return;
    console.log(e.target.value);
});

// --- создание списка на 1 день ---
const btn_DayList  = document.getElementById("btn_day_list");
btn_DayList.addEventListener("click", () => createOrderList(1));

// --- создание списка на неделю (7 дней) ---
const btn_WeakList = document.getElementById("btn_weak_list");
btn_WeakList.addEventListener("click", () => createOrderList(7));

// --- создание списка на месяц (30 дней) ---
const btn_MonthList = document.getElementById("btn_month_list");
btn_MonthList.addEventListener("click", () => createOrderList(30));

// --- создание отдельного списка покупок ---
const btn_OrderList = document.getElementById("btn_order_list");
btn_OrderList.addEventListener("click", () => createOrderList(0));

const createOrderList = (arg) => callbacks.forEach(callback => callback(arg));
