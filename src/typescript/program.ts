// данные
import * as datastorage from './datastorage';
// формы
import {callbacksetter as addHandlerForAssortimenUnitIsCreated} from "./form-create-product-unit";
import addHandlerForOrderListCreated from './form-create-order-list';
import renderFormAddOrderItem from "./form-add-order-item";
// типы
import { ArticleUnit } from "./units/article-item";
import { ArticleList } from "./units/article-list";
import { ProductUnit } from "./units/product-unit";
import { ControllerArticleList } from './controller-article-list';
import { ControllerOrderList } from './units/controller-order-list';
// рендеры
import { RenderArticleList } from "./renders/render-article-list";
import { ArticleListOrder } from './units/article-list';
import { RenderArticleUnit, RenderArticleProduct } from './renders/render-article-item';


/** контейнеры списков для покупок */
const conteinerOrderList = document.getElementById("block-order-list") as HTMLElement;

/** контейнеры списков-источников ассортимента */
const conteinerSouceList = document.getElementById("block-source-list") as HTMLElement;

// главный контроллер всех списков.
const controllerArticleList = new ControllerArticleList("main controller article lists");

// оновной список ассортимента.
const mainAssortimentList = new ArticleList('main assortiment list');
const renderMainAssortimentList = new RenderArticleList(
    "основной список ассортимента",
    RenderArticleProduct.renderFor.bind(RenderArticleProduct)
);
renderMainAssortimentList.render(mainAssortimentList, conteinerSouceList);

controllerArticleList.addList(mainAssortimentList, "assortiment", true);

// контроллер коллекции списков покупок.
const orders = new ControllerOrderList('main orders set');



// ОБРАБОТЧИИК создание продукта главной формой.
addHandlerForAssortimenUnitIsCreated(function (product) {
    console.log("главная форма сотворила предмет!", product);
    datastorage.addProductUnit(product, (err: Error, result: any) => {
        console.log("Сохраняю продукт: ", product);
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            mainAssortimentList.addItem(product);
        }
    });
});

// ОБРАБОТЧИК создания списков заказов.
addHandlerForOrderListCreated(function (arg) {
    console.log("форма создания списков сотворила список!", `arg ${arg}`);
    // тестовый код проверки размещения.
    let term: string;
    switch(arg) {
        case "day": term = "Один день";
        break;
        case "weak": term = "Недельный";
        break;
        case "month": term = "Месяц";
        break;
        case "onetime": term = "Одноразовый";
        break;
        default:
            term = `${arg} дн.`;
        }
    const al = new ArticleListOrder("Список необходимых приобритений", term);
    orders.addList(al, al.label);
    
	const renderAl = new RenderArticleList(
        "Список покупок", 
        RenderArticleUnit.renderFor.bind(RenderArticleUnit)
    );
    renderAl.render(al, conteinerOrderList);
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


// test code: обкатка формы добавления позиции в список покупок.
renderMainAssortimentList.on("requireitem", function (data: unknown) {
    if (data instanceof ProductUnit) {
        const renderForm = new renderFormAddOrderItem(
            (applyData) => {
                // TODO: Нужно написать правила преобразование числовых величин в зависимости от типа продукта.
                const quantity = parseInt(applyData.quantity);
                if (isFinite(quantity)) {
                    orders.active?.addItem(new ArticleUnit(data, quantity));
                }
            },
            (cancelData) => {
                console.log(cancelData)
            }
        );
        renderForm.price = data.price;
        renderForm.quantity = data.amount;
        renderForm.render(document.body);
    } else {
        console.error("Неверный элемент");
    }
});


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
