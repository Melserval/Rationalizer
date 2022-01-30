import {callbacksetter as assortimenItemCreate} from "./form-create-product-unit.js";
import {callbacksetter as orderListCreate } from './form-create-order-list.js';
import * as datastorage from './datastorage.js';

import ArticleUnit from "./units/article-unit.js";
import RenderArticleUnit from "./renders/render-article-unit.js";
import RenderArticleList from "./renders/render-article-list.js";

// основной список ассортимента
const mainAssortiment = (function(){
    const units = [];
    const events = {};
    const obj = {};
	let focusedAssortimentUnit = null;
    let focusedAssortimentUnitIndex = -1;

    const getElementLi = function(etarget) {
        let parent = etarget.parentNode;
        while (parent !== null && parent !== this) {
            if (parent.nodeName == "LI") {
                return parent;
            } else {
                parent = parent.parentNode;
            }
        }
        return null;
    };

    const focusAssortimentUnit = function (elementLi) {
        try {
            if (elementLi === null) throw new Error("Элемент не подходит!");
            if (focusedAssortimentUnit == elementLi) return;
            focusedAssortimentUnit?.classList.remove('focusedli');
            focusedAssortimentUnit = elementLi;
            focusedAssortimentUnit?.classList.add('focusedli');
        } catch (err) {
            console.error("Недопустимый HTML элемент", err);
        }
    };

    const focusedNextAssortimenUnit = function () {
        const li = focusedAssortimentUnit.nextElementSibling?.closest('.items-list li');
        if (li === null) return;
        focusAssortimentUnit(li);
    };

    const focusedPreviousAssortimenUnit = function () {
        const li = focusedAssortimentUnit.previousElementSibling?.closest('.items-list li');
        if (li === null) return;
        focusAssortimentUnit(li);
    };

    const conteinerUL = document.getElementById("main-assortiment-list");
    conteinerUL.addEventListener("dblclick", (e) => {
        events["selectitem"].forEach(e => e(focusedAssortimentUnit));
    });

	conteinerUL.addEventListener('click', (e) => {
		const elementLi = e.target.closest('.items-list li');
		if (elementLi === null) return;
        focusAssortimentUnit(elementLi);
	});

    events["selectitem"] = [];
    events["deleteitem"] = [];

    obj.on = function(eventName, handler) {
        if (eventName in events) {
            events[eventName].push(handler);
        } else {
            throw new Error("Нет такого события для mainAssortiment!");
        }
    }

    obj.off = function(eventName, handler) {
        if (eventName in events) {
            const callbacks = events[eventName];
            for (let i = callbacks.length - 1; i >= 0; i--) {
                if (callbacks[i] === handler) {
                    callbacks.splice(i, 1);
                }
            }
        }
    }

    obj.throw = function(eventName, arg) {
        if (eventName in events) {
            if (eventName === "selectitem") {
                events["selectitem"].forEach(e => e(focusedAssortimentUnit));
            } else {
                events[eventName].forEach(handler => handler(arg));
            }
        }
    };

    obj.addProduct = function(product) {
        const p = new ArticleUnit(product);
        p.render();
        units.push(p);
    };
    obj.nextUnit = focusedNextAssortimenUnit;
    obj.previousUnit = focusedPreviousAssortimenUnit;
    return obj;
}) /* конец блока mainAssortiment */();


ArticleUnit.bindRender(
    document.getElementById("main-assortiment-list"),
    RenderArticleUnit,
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
    const ol =  new RenderArticleList("Супер");
    ol.label = "Hello", ol.term = arg, ol.quantity = 4, ol.total = 25.15;
    ol.insertInto(document.querySelector("#conteiner_order_lists"));
    [1, 3, 2].forEach(n => ol.append(new RenderArticleUnit()._node_li));
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


function selectItem(element) {
    console.log("!!! выбран элемент !!!:", element);
}

mainAssortiment.on("selectitem", selectItem);
//mainAssortiment.off("selectitem", selectItem);


// Обработка фокуса на списках ассортимента.
window.targetItemList = null;
document.body.addEventListener('click', function (e) {
	window.targetItemList = e.target.closest('.items-list')
	console.log(window.targetItemList);
});

window.addEventListener('keydown', function (e) {
	if (window.targetItemList === null) return;
	if (e.code != 'ArrowUp' && e.code != 'ArrowDown') return;
	e.preventDefault();
	if (e.code == 'ArrowUp') mainAssortiment.previousUnit();
    if (e.code == 'ArrowDown') mainAssortiment.nextUnit();
});

window.addEventListener('keypress', function (e) {
    if (window.targetItemList === null) return;
    if (e.code !== 'Enter') return;
    mainAssortiment.throw('selectitem');
});
