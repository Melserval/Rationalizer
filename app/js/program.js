import {callbacksetter as assortimenItemCreate} from "./form-create-assortiment-item.js";
import {callbacksetter as orderListCreate } from './form-create-order-list.js';

assortimenItemCreate(function (arg) {
    console.log("Hello from program.js");
    console.log(arg);
});

orderListCreate(function (arg) {
    // тестовый код проверки размещения.
    const ol =  new RenderOrderList("Супер");
    ol.label = "Hello", ol.term = arg, ol.quantity = 4, ol.total = 25.15;
    ol.insertInto(document.querySelector("#conteiner_order_lists"));
    [1, 3, 2].forEach(n => ol.append(new RenderListUnit()._node_li));
});