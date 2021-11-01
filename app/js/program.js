import {callbacksetter as assortimenItemCreate} from "./form-create-assortiment-item.js";
import {callbacksetter as orderListCreate } from './form-create-order-list.js';
import {callbacksetter as getAssortimentSet, storagerdata as saveData } from './datastorage.js';

assortimenItemCreate(function (arg) {
    console.log("главная форма сотворила предмет!");
    console.log(arg);
    saveData(arg, savedateClbHandler);
});

orderListCreate(function (arg) {
    console.log("форма создания списков сотворила список!");
    // тестовый код проверки размещения.
    const ol =  new RenderOrderList("Супер");
    ol.label = "Hello", ol.term = arg, ol.quantity = 4, ol.total = 25.15;
    ol.insertInto(document.querySelector("#conteiner_order_lists"));
    [1, 3, 2].forEach(n => ol.append(new RenderListUnit()._node_li));
    saveData(ol, savedateClbHandler);
});

getAssortimentSet(function (error, dataset) {
    // кода будут получены данные - тогда и будет наполнен список.
    if (error) console.error("Ошибонька!", error);
    else console.log("Все прекрасно, Сэр!", dataset);
});

const savedateClbHandler =  (error, result) => {
    console.log("сохранение данных...");
    if (error) console.log("Ошибонька!", error);
    else console.log("Все прекрасно, Сэр!", result);
};