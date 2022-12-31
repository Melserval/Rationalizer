// === МОДУЛЬ === форма создания списка-перечня.

export const enum TimePeriod {
    custom,
    day, 
    weak, 
    month, 
    onetime
}    

/**
 *  вызываемых при создании списка
 * с помощью интерфейса формы.
 */

/**
 * Назначение обработчиков выбора времени действия списка заказов.
 * @param callback функция, которой будет передано значение 
 * выбранной продолжительности действия списка заказов.
 */
export function onOrderListCreated(callback: (arg: TimePeriod) => void) {
	callbacks.push(callback);
}

const callbacks = new Array<CallableFunction>();
const createOrderList = (arg: TimePeriod) => callbacks.forEach(callback => callback(arg));

const btn_CustomDaysList = document.getElementById("btn_custom_days_list") as HTMLButtonElement;


// TODO: Разобраться с возможным null значением ссылок на элементы. Проверить как будет работать если вернуть null.

// --- создание списка на выборочное количество дней ---
function createCustomDaysList(strdays: string) {
    const days = parseInt(strdays);
    if (isNaN(days) || !isFinite(days)) {
        // HACK: Временное решение.
        alert("Недопустимое количество дней!");
        return;
    }
    createOrderList(days);
}
btn_CustomDaysList.addEventListener("keypress", function (e) {
    const element = e.target as HTMLElement;
    if (element.nodeName !== "INPUT" || e.code !== "NumpadEnter") return;
    createCustomDaysList((element as HTMLInputElement).value);
});
btn_CustomDaysList.addEventListener("click", function (e) {
    const element = e.target as HTMLElement;
    if (element != this) return;
    createCustomDaysList((element.firstElementChild as HTMLInputElement).value);
});

// --- создание списка на 1 день ---
const btn_DayList  = document.getElementById("btn_day_list") as HTMLButtonElement;
btn_DayList.addEventListener("click", () => createOrderList(TimePeriod.day));

// --- создание списка на неделю (7 дней) ---
const btn_WeakList = document.getElementById("btn_weak_list") as HTMLButtonElement;
btn_WeakList.addEventListener("click", () => createOrderList(TimePeriod.weak));

// --- создание списка на месяц (30 дней) ---
const btn_MonthList = document.getElementById("btn_month_list") as HTMLButtonElement;
btn_MonthList.addEventListener("click", () => createOrderList(TimePeriod.month));

// --- создание одноразового списка покупок ---
const btn_OrderList = document.getElementById("btn_order_list") as HTMLButtonElement;
btn_OrderList.addEventListener("click", () => createOrderList(TimePeriod.onetime));
