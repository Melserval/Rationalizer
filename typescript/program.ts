import {callbacksetter as addHandlerForAssortimenUnitIsCreated} from "./form-create-product-unit.js";
import * as datastorage from './datastorage.js';
import addHandlerForOrderListCreated from './form-create-order-list.js';

import ArticleUnit from "./units/article-unit.js";
import ArticleList from "./units/article-list.js";
import RenderArticleUnit from "./renders/render-article-unit.js";
import RenderArticleList from "./renders/render-article-list.js";
import { ProductUnit } from "./units/product-unit.js";


/** размещение списков для покупок */
const conteinerOrderList = document.querySelector("#conteiner_order_lists") as HTMLElement;
/** размещение списков-источников ассортимента */
const conteinerSouceList = document.getElementById("main-assortiment-list") as HTMLElement;

// оновной список ассортимента.
const mainAssortimentList = new ArticleList('main assortiment list');
const renderMainAssortimentList = new RenderArticleList();
renderMainAssortimentList.render(mainAssortimentList, conteinerSouceList);

// ОБРАБОТЧИИК создание продукта главной формой.
addHandlerForAssortimenUnitIsCreated(function (product) {
    console.log("главная форма сотворила предмет!", product);
    datastorage.addProductUnit(product, (err: Error, result: any) => {
        console.log("Сохраняю продукт: ", product);
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
});

// ОБРАБОТЧИК создания дополнительных списков.
addHandlerForOrderListCreated(function (arg) {
    console.log("форма создания списков сотворила список!", `arg ${arg}`);
    // тестовый код проверки размещения.
	const al = new ArticleList("Hello!", arg);
	const renderAl = new RenderArticleList();
    renderAl.render(al, conteinerOrderList);
});

// загрузка коллекции элементов ProducUnit.
datastorage.getProductCollection(function (error, dataset, info='') {
    // когда будут получены данные - тогда и будет наполнен список.
    if (error) {
        console.error("Ошибонька!", error);
        return;
    } else if (dataset) {
        console.log("Все прекрасно, Сэр!"+info, dataset);
        for (const product of dataset) {
            mainAssortimentList.addItem(new ArticleUnit(product));
        }
    }
});


function selectItem(element: any) {
    console.log("!!! выбран элемент !!!:", element);
}

renderMainAssortimentList.on("selectitem", selectItem);
//mainAssortiment.off("selectitem", selectItem);


// Глобальная Обработка фокуса на списках ассортимента.
let targetItemList: HTMLUListElement | null = null;
document.body.addEventListener('click', function (e) {
    const element = e.target as HTMLElement;
	targetItemList = element.closest('.items-list') as HTMLUListElement;
});
// TODO: Необходимо доработать связь между фокусом на элементе li, списке UL
// и элементом визуализации, так как будет не один жестко закодированный список.
window.addEventListener('keydown', function (e) {
	if (targetItemList === null) return;
	if (e.code != 'ArrowUp' && e.code != 'ArrowDown') return;
	e.preventDefault();
	if (e.code == 'ArrowUp') renderMainAssortimentList.focusPreviousItem();
    if (e.code == 'ArrowDown') renderMainAssortimentList.focusNextItem();
});

window.addEventListener('keypress', function (e) {
    if (targetItemList === null) return;
    if (e.code !== 'Enter') return;
    renderMainAssortimentList.throw('selectitem', e);
});
