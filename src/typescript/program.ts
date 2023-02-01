// данные
import * as datastorage from './datastorage';
// формы
import {callbacksetter as addHandlerForAssortimenUnitIsCreated} from "./form-create-product-unit";
import { onOrderListCreated, TimePeriod } from './form-create-order-list';
import renderFormAddOrderItem from "./form-add-order-item";
// типы
import { ArticleUnit } from "./units/article-item";
import { ArticleList, EventItem } from "./units/article-list";
import { ProductUnit } from "./units/product-unit";
// рендеры
import { RenderArticleAssortimentList, RenderArticleList, RenderArticleOrderList } from "./renders/render-article-list";
import { ArticleOrderList } from './units/article-list';
// контроллеры
import { ControllerOrderList, EventList } from './units/controller-order-list';
import { ControllerArticleList } from './controller-article-list';
import controllerPeriodPurshase, { EventPeriod } from "./budget/controller-period-purshase";




/** контейнеры списков для покупок */
const conteinerOrderList = document.getElementById("block-order-list") as HTMLElement;

/** контейнеры списков-источников ассортимента */
const conteinerSouceList = document.getElementById("block-source-list") as HTMLElement;

// главный контроллер всех списков.
const controllerArticleList = new ControllerArticleList("main controller article lists");

// контроллер коллекции списков покупок (основной экран).
const controllerOrderList = new ControllerOrderList('main orders set');

// оновной список ассортимента.
const mainAssortimentList = new ArticleList('main assortiment list');
const renderMainAssortimentList = new RenderArticleAssortimentList("основной список ассортимента");
renderMainAssortimentList.render(mainAssortimentList, conteinerSouceList);
controllerArticleList.addList(mainAssortimentList, "assortiment", true);


// ОБРАБОТЧИИК создание продукта главной формой.
addHandlerForAssortimenUnitIsCreated(async (product) => {
    console.log("главная форма сотворила предмет!", product);
    await datastorage.addProductUnit(product);
    mainAssortimentList.addItem(product);
});

// ОБРАБОТЧИК создания списков заказов.
onOrderListCreated(function (arg) {
    console.log("форма создания списков сотворила список!", `arg ${arg}`);
    // тестовый код проверки размещения.
    let term: string;
    switch(arg) {
        case TimePeriod.day: 
            term = "Один день";
            break;
        case TimePeriod.weak: 
            term = "Недельный";
            break;
        case TimePeriod.month: 
            term = "Месяц";
            break;
        case TimePeriod.onetime: 
            term = "Одноразовый";
            break;
        case TimePeriod.custom:
            term = `${arg} дн.`;
    }
    const al = new ArticleOrderList("Список необходимых приобритений", term);
    datastorage.addOrderList(al);
    controllerOrderList.addList(al);
});

// загрузка коллекции элементов ProducUnit.
datastorage.getProductCollection(function (error, dataset, info='') {
    // когда будут получены данные - тогда и будет наполнен список.
    if (error) {
        console.error("Ошибонька!", error);
        return;
    } else if (dataset) {
        for (const product of dataset) {
            mainAssortimentList.addItem(product);
        }
    }
});

// загрузка коллекции элементов списков закупок.
datastorage.orderListDataSet.then(orders => {
    orders.forEach(o => {
        controllerOrderList.addList(o);
    });
});

// test code: обкатка формы добавления позиции в список покупок.
renderMainAssortimentList.on("requireitem", function (data: unknown) {
    if (data instanceof ProductUnit) {
        const renderForm = new renderFormAddOrderItem(
            data,
            (quantity) => controllerOrderList.active?.addItem(new ArticleUnit(data, quantity)),
            console.log
        );
        renderForm.render(document.body);
    } else {
        console.error("Неверный элемент");
    }
});

// обработка событий в списках покупок для учета фин-периодов.
controllerOrderList.on(EventList.add, list => controllerPeriodPurshase.handleAddedList(list));
controllerOrderList.on(EventList.remove, list => controllerPeriodPurshase.handleRemoveList(list));
controllerOrderList.on(EventList.activate, i => controllerPeriodPurshase.setActiveList(i));
controllerOrderList.on(EventList.deactivate, i => controllerPeriodPurshase.unsetActiveList(i));

// обработка событий в списках покупок для рендеров.
controllerOrderList.on(EventList.add, list => {
	const render = new RenderArticleOrderList("Список покупок");
    render.render(list, conteinerOrderList);
});

// обработка событий в списках покупок для записи в БД
controllerOrderList.onList(EventItem.add, datastorage.addPurshase);

// обработка событий в списках периодов для записи в БД
controllerPeriodPurshase.on(EventPeriod.add, datastorage.addBudgetPeriod);

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
            console.log("Клик На список заказов", li);
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
