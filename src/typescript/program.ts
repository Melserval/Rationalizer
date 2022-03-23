import * as datastorage from './datastorage';

// формы
import {callbacksetter as addHandlerForAssortimenUnitIsCreated} from "./form-create-product-unit";
import addHandlerForOrderListCreated from './form-create-order-list';
import RenterFormAddOrderItem from './renders/render-form-add-order-item';
// типы
import ArticleUnit from "./units/article-unit";
import ArticleList from "./units/article-list";
import { ProductUnit } from "./units/product-unit";
// рендеры
import RenderArticleUnit from "./renders/render-article-unit";
import RenderArticleList from "./renders/render-article-list";


const formaddorder = new RenterFormAddOrderItem();
formaddorder.render(document.body);
formaddorder.load("Hello form add order item", 100, 100500);
formaddorder.apply((data) => {
    console.log("hell there: form applable!")
    console.log(data);
})
formaddorder.cancel(() => {
    console.log("hello there: form cancelable!")
})

/** размещение списков для покупок */
const conteinerOrderList = document.getElementById("block-order-list") as HTMLElement;
/** размещение списков-источников ассортимента */
const conteinerSouceList = document.getElementById("block-source-list") as HTMLElement;

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

renderMainAssortimentList.on("requireitem", selectItem);
//mainAssortiment.off("selectitem", selectItem);

// операция добавления выбранного ассортимента в список закупок.
function processAddArticleToOrder(items: Iterable<ArticleUnit>, id : number) { }

// --- обработка по перемещению и управлению списками клафишами ---

// Глобальная Обработка фокуса на списках ассортимента.
let targetItemList: RenderArticleList | null = null;

document.body.addEventListener('click', function (e) {
    const target = e.target as HTMLElement;
    const element = target.closest('.block-article_list') as HTMLElement;

    if (element !== null) {
        if (element.id !== targetItemList?.id) {
            targetItemList?.focusHide();
            targetItemList = RenderArticleList.articleListCollection.get(element.id) ?? null;
        }
        if (targetItemList !== null) {
            const li = target.closest('.article_list__items li') as HTMLLIElement;
            targetItemList.selectItem(li);
        } else {
            throw new Error("Неверный id элемента списка.");
        }
    } else {
        targetItemList?.focusHide();
        targetItemList = null;
    }
});

document.body.addEventListener('dblclick', function (e) {
    if (targetItemList === null) return;
    const target = e.target as HTMLElement;
    const li = target.closest('.article_list__items li') as HTMLLIElement;
    if (li) {
        targetItemList.throw('requireitem');
    }
});


// TODO: Необходимо доработать связь между фокусом на элементе li, списке UL
// и элементом визуализации, так как будет не один жестко закодированный список.
window.addEventListener('keydown', function (e) {
	if (targetItemList === null) return;
	if (e.code != 'ArrowUp' && e.code != 'ArrowDown') return;
	e.preventDefault();
	if (e.code == 'ArrowUp') targetItemList.selectPreviousItem();
    if (e.code == 'ArrowDown') targetItemList.selectNextItem();
});

window.addEventListener('keypress', function (e) {
    if (targetItemList === null) return;
    if (e.code !== 'Enter') return;
    targetItemList.throw('requireitem');
});
