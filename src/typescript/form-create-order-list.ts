// === МОДУЛЬ === форма создания списка-перечня.

type TimePeriod = "day" | "weak" | "month" | "onetime" | number;


/**
 *  вызываемых при создании списка
 * с помощью интерфейса формы.
 */

/**
 * Назначение обработчиков выбора времени действия списка заказов.
 * @param callback функция, которой будет передано значение 
 * выбранной продолжительности действия списка заказов.
 */
export default function onOrderListCreated(callback: (arg: TimePeriod) => void) {
	callbacks.push(callback);
}

const callbacks = new Array<CallableFunction>();
const createOrderList = (arg: TimePeriod) => callbacks.forEach(callback => callback(arg));

const btn_CustomDaysList = document.getElementById("btn_custom_days_list") as HTMLButtonElement;

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

// --- создание списка на выборочное количество дней ---
btn_CustomDaysList.addEventListener("click", function (e) {
    const element = e.target as HTMLElement;
    if (element != this) return;
    
    const days = parseInt((element.firstElementChild as HTMLInputElement).value);
    if (isNaN(days) || !isFinite(days)) {
        // HACK: Временное решение.
        alert("Недопустимое количество дней!");
        return;
    }
    createOrderList(days);
});

// --- создание списка на 1 день ---
const btn_DayList  = document.getElementById("btn_day_list") as HTMLButtonElement;
btn_DayList.addEventListener("click", () => createOrderList("day"));

// --- создание списка на неделю (7 дней) ---
const btn_WeakList = document.getElementById("btn_weak_list") as HTMLButtonElement;
btn_WeakList.addEventListener("click", () => createOrderList("weak"));

// --- создание списка на месяц (30 дней) ---
const btn_MonthList = document.getElementById("btn_month_list") as HTMLButtonElement;
btn_MonthList.addEventListener("click", () => createOrderList("month"));

// --- создание отдельного списка покупок ---
const btn_OrderList = document.getElementById("btn_order_list") as HTMLButtonElement;
btn_OrderList.addEventListener("click", () => createOrderList("onetime"));
