// управление созданием списка-перечня необходимого ассортимента.
"use strict";

// --- создание списка на выборочное количество дней --- 
const btn_CustomDaysList = document.getElementById("btn_custom_days_list");
btn_CustomDaysList.addEventListener("click", function (e) {
    if (e.target != this) return;
    createOrderList(e.target.firstElementChild.value);
});
btn_CustomDaysList.addEventListener("focus", function (e) {
    console.log(e);
    if (e.target !== this) return;
    e.target.firstElementChild.focus();
})
btn_CustomDaysList.addEventListener("keypress", function (e) {
    if (e.target.nodeName !== "INPUT" || e.code !== "NumpadEnter") return;
    console.log(e.target.value);
});

// --- создание списка на 1 день --- 
const btn_DayList  = document.getElementById("btn_day_list");
btn_DayList.addEventListener("click", createOrderList.bind(null, 1));

// --- создание списка на неделю (7 дней) --- 
const btn_WeakList = document.getElementById("btn_weak_list");
btn_WeakList.addEventListener("click", createOrderList.bind(null, 7));

// --- создание списка на месяц (30 дней) --- 
const btn_MonthList = document.getElementById("btn_month_list");
btn_MonthList.addEventListener("click", createOrderList.bind(null, 30));

// --- создание отдельного списка покупок ---
const btn_OrderList = document.getElementById("btn_order_list");
btn_OrderList.addEventListener("click", createOrderList.bind(null, 0));

function createOrderList(arg) {
    console.log("List created!", arg);
}