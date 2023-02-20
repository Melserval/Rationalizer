// === МОДУЛЬ === поставщик данных приложения.
// отсюда данные поступают в программу. это может быть:
// - локальное браузерное хранилище.
// - константные данные.
// - удаленныe базы данных.

import { ProductUnit, ProductUnitJson } from "./units/product-unit";
import * as uType from "./types";
import { ArticleOrderList } from "./units/article-list";
import { ArticleUnit } from "./units/article-item";
import { BudgetPeriod } from "./budget/BudgetPeriod";

export type DBSet = {[key: string]: string };

const api_uri_host = "http://localhost:8000/api";

/**
 * Запрос коллекции ассортимента.
 * @param callback (error, data [, info])
 */
export function getProductCollection(
	callback: (err: Error | null, data: ProductUnit[] | null, from: string) => void
) {
	// если за отведенное время бд не ответила - тогда берем данные из локальной коллекции.
	const TIME = 1450;
	const timerId = setTimeout(() => {
		localstorDataSet.getData().then(
			data => callback(null, data, "local"), 
			error => callback(error, null, "local")
		);
	}, TIME);
	// HACK: Нужно это переделать в анализ ответов от сервера.
	productDataSet
	.then(data => {
		clearTimeout(timerId);
		callback(null, data, "constant");
	})
	.catch(error => callback(error, null, "constant"));
};

/**
 * Сохранение объекта продукта в хранилище.
 *
 * @param   ProductUnit<string>  product  сохраняемый элемент.
 *
 * @return  Promise<string>      ID успешно добавленного продукта.
 */
export function addProductUnit(product: ProductUnit): Promise<string> {
	return Promise.race([
		// Запись в локальную бд.
		localstorDataSet.getData()
		.then((dataset) => {
			dataset.push(product);
			return localstorDataSet.setData(dataset)
		}),
		// Запись в базу данных
		fetch("http://localhost:8000/api/data/add-product", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify(product.toJSON())
		})     // продукт id.
		.then(response => response.ok ? response.text() : Promise.reject())
	]);
};


/**
 * Удаление оъекта продукта из хранилища.
 * @param {(product: ProductUnit)boolean} predicate
 * @param {(err: Error, result: string)void} callback 
 */
export function removeProductUnit(
	predicate: ((value: ProductUnit) => boolean), 
	callback?: ((error: Error | null, result?: string) => void)
) {
	// TODO: Организовать проверку наличия/ожидания коллекции.
	const setDataResult = localstorDataSet.getData()
	.then(data => {
		const result = data.filter(function (p) {
			if (!predicate(p)) return true;
			console.log("Продукт с id: " + p.id + " удален.");
			return false;
		});
		return localstorDataSet.setData(result);
	});
	if (callback) setDataResult.then(callback.bind(null, null), callback);
};

const localstorDataSet = {
	LOCAL_STORAGE_KEY: 'product_unit_set',
	getData() {
		return new Promise<ProductUnit[]>((resolve, reject) => {
			try {
				const jsontext = localStorage.getItem(this.LOCAL_STORAGE_KEY);
				if (jsontext === null) {
					resolve([]);
				} else {
					resolve(JSON.parse(jsontext).map((item: ProductUnitJson) => ProductUnit.fromJson(item)));
				}
		   } catch (err) {
			   reject(err);
		   }
		});
	},
	setData(products: ProductUnit[]) {
		return new Promise<string>((resolve, reject) => {
			try {
				localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(products));
				resolve(`Данные сохранены в локальном хранилище [${products.length}]`);
			} catch (err) {
				reject(err);
			}
		});
	},
	clearData() {
		localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify([]));
		return Promise.resolve(true);
	}
};

// --- получение данных из удаленной базы данных. ---

// Создание типов единиц измерений из списка на сервере.
const typesOfMeasure = fetch(api_uri_host + "/type/measure")
	.then(response => response.ok ? response.json() : null)
	.then(measures => {
		// числовые ключи соответствуют id типа в БД и обеспечат 
		// быстрый доступ к типам при сооздании Product.
		const types = new Map<number, uType.MeasureType>();
		for (const measure of measures) {
			// проверка что тип из базы идентичен типу реализованному на клиенте.
			var type = uType.MeasureType.info(measure.type_name)
			if (type !== null 
				&& type.labelFull == measure.label_full
				&& type.labelShort == measure.label_short
				&& type.description == (measure.description ?? "")) {
				types.set(measure.id, type);
			} else {
				throw new Error("Несовпадения типов БД/Клиент" + measure.type_name);
			}
		}
		return types;
	});
// Создание типов упаковок (видов распостранения) из списка на сервере.
const typesOfVendors = fetch(api_uri_host + "/type/package")
	.then(response => response.ok ? response.json() : null)
	.then(vendors => {
		// числовые ключи соответствуют id типа в БД и обеспечат 
		// быстрый доступ к типам при сооздании Product.
		const types = new Map<number, uType.VendorType>();
		for (const vendor of vendors) {
			// проверка что тип из базы идентичен типу реализованному на клиенте.
			var type = uType.VendorType.info(vendor.type_name)
			if (type !== null 
				&& type.labelFull == vendor.label_full
				&& type.labelShort == vendor.label_short
				&& type.description == (vendor.description ?? "") ) {
				types.set(vendor.id, type);
			} else {
				console.log(type);
				console.log(vendor);
				throw new Error("Несовпадения типов БД/Клиент" + vendor.type_name);
			}
		}
		return types;
	});
// Создание списка продуктов из списка на сервере.
// (создание Product зависимо от типов, поэтому используется цепочка промисов).
const productDataSet = Promise.all([typesOfMeasure, typesOfVendors])
.then(typesMV => 
	fetch(api_uri_host + "/data/product")
	.then(response => response.ok ? response.json() : null)
	.then(products => {
		const [measures, vendors] = typesMV;
		const productObjects = new Array<ProductUnit>();
		for (const p of products) {
			let measureType = measures.get(p.measure_id);
			let vendorType = vendors.get(p.package_id);
			if (measureType && vendorType) {
				productObjects.push(
					new ProductUnit(p.title, 
										p.amount, 
										parseFloat(p.price), 
										vendorType, 
										measureType,
										null, 
										null,
										p.id));
			} else {
				throw new Error(`Не удалось создать продукт из БД${p.title}`);
			}
		}
		return productObjects;
	})
);
// Загрузка списка заказов.
// (список заказов зависит от списка продуктов.)
const ordersDataSet = fetch(api_uri_host + "/data/get-orders")
	.then(response => response.ok ? response.json() : null);

export const orderListDataSet = Promise.all([ordersDataSet, productDataSet])
.then(ordersAndProducts => {
	const [orders, products] = ordersAndProducts;
	const orderObjects = new Array<ArticleOrderList>();
	for (let order of orders) {
		const {id, created, quantity, total, term, label} = order.order;
		//TODO: Подумать над инкапсуляцией преобразования id в дату создания.
		let AOL = new ArticleOrderList(label, term, parseInt(id, 36));
		let purshases: ArticleUnit[] = []; 
		try {
			for (const pjson of order.items) {
				let product = products.find(p => p.id === pjson.product_id);
				if (!product) throw pjson;
				purshases.push(ArticleUnit.fromJSON(pjson, product));
			}
			AOL.addItem(purshases);
		} catch (err) {
			console.error("Возникла ошибка при создании коллекции списков закупок из БД", err);
		}
		orderObjects.push(AOL);
	}
	return orderObjects;
});

///////// ---  Финансовые периоды --- \\\\\\\\\\\\

/** Отправка на сервер: сохранить фин. период */
export async function addBudgetPeriod(period: BudgetPeriod): Promise<string> {
	const response = await fetch(api_uri_host + "/data/add-budget-period", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(period.toJSON())
	});
	return await (response.ok ? response.text() : Promise.reject());
}

/** Загружает данные фин. периода. */
export function getBudgetPeriod(): Promise<BudgetPeriod> {
	return fetch(uri_api_host + "/data/get-budgetperiod")
		.then(response => response.ok ? response.json(): Promise.reject('Ошибка запроса'))
		.then(budget => budget.length ? budget[0]: Promise.reject('Пустой результат'))
		.then(budget => new BudgetPeriod(
			budget.resources_deposit,
			budget.resources_reserved,
			budget.resources_utilize,
			budget.exchange,
			budget.period_start,
			budget.period_end,
			budget.id
		));
};

/** Отправляет данные списка закупок на сервер. */
export async function addOrderList(list: ArticleOrderList): Promise<string> {
	console.log("Ордер на вставку в БД", list);
	const response = await fetch(uri_api_host + "/data/add-orderlist", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body:  JSON.stringify(list.toJSON())
	});
	return await (response.ok ? response.text() : Promise.reject());
}

/** Отправляет данные элемента списка заказа на сервер. */
export async function addPurshase(item: ArticleUnit , orderList: ArticleOrderList): Promise<string> {
	const response = await fetch(uri_api_host + "/data/add-purshase", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body:  JSON.stringify( Object.assign(item.toJSON(), {"orderId": orderList.id}) )
	});
	return await (response.ok ? response.text() : Promise.reject());
}
