import {callbacksetter as assortimenItemCreate} from "./form-create-product-unit.js";
import {callbacksetter as orderListCreate } from './form-create-order-list.js';
import * as datastorage from './datastorage.js';
window.datastorage = datastorage;
const mainAssortiment = new AssortimentList("Главный список");
AssortimentListUnit.bindRender(
    document.getElementById("main-assortiment-list"), 
    RenderListUnit, 
    (view, model) => {
        view.setTitle = model.title; 
        view.setAmount = model.amount;
        view.setPrice = model.price;
    }
);

// ОБРАБОТЧИИК создание продукта главной формаой.
assortimenItemCreate(function (product) {
    console.log("главная форма сотворила предмет!", product);
    datastorage.addProductUnit(product, (error, result) => {
        console.log("Сохраняю продукт: ", product);
        error ? console.error(error) : console.log(result);
    });
});

// ОБРАБОТЧИК создания списка заказов.
orderListCreate(function (arg) {
    console.log("форма создания списков сотворила список!");
    // тестовый код проверки размещения.
    const ol =  new RenderOrderList("Супер");
    ol.label = "Hello", ol.term = arg, ol.quantity = 4, ol.total = 25.15;
    ol.insertInto(document.querySelector("#conteiner_order_lists"));
    [1, 3, 2].forEach(n => ol.append(new RenderListUnit()._node_li));
});

// получение коллекции элементов продукт.
datastorage.getProductCollection(function (error, dataset, info='') {
    // кода будут получены данные - тогда и будет наполнен список.
    if (error) console.error("Ошибонька!", error);
    else {
        console.log("Все прекрасно, Сэр!"+info, dataset);
        for (const product of  dataset) {
            mainAssortiment.addProduct(product);
        }
    }
});