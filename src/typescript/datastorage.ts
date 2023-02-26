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

/** Получить с сервера: Последний добавленнный фин. период. */
export function getBudgetPeriodLast(): Promise<BudgetPeriod> {
	return fetch(api_uri_host + "/data/get-budget-period-last", {
		'method': 'POST'
	})
	.then(response => response.ok ? response.json() : Promise.reject("Не удалось получить last period"))
	.then(dbset => dbset.length == 1 ? dbset[0] : Promise.reject("БД вернула пустой результат"))
	.then((dbset: DBSet) => BudgetPeriod.createFromDBSet(dbset));
};

/** Получить с сервера: Фин. период с указанным id */
export function getBudgetPeriodById(periodId: string): Promise<BudgetPeriod> {
	return fetch(api_uri_host + "/get-budget-period", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body:  JSON.stringify({periodId})
	})
	.then(result => result.ok ? result.json() : Promise.reject("Не удалось получить period by id"))
	.then((item: DBSet) => BudgetPeriod.createFromDBSet(item));
}

/**
 * Отправка на сервер: связать заказ с указанным фин. периодом
 * 
 * @param   {string}   orderId   Идентификатор списка закупок.
 * @param   {string}   periodId  Идентификатор фин. периода.
 *
 * @return  {Promise<string>}            результат связи с БД.
 */
export function associateOrderByPeriod(orderId: string, periodId: string): Promise<string> {
	console.log(`Ассоцияция заказа ${orderId} с периодом ${periodId}`);
	return fetch(api_uri_host + "/data/add-order-period", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify({orderId, periodId})
	})
	.then(response => response.ok ? 
		response.json() : 
		Promise.reject<string>(response.statusText)
	);
}

 ///////////////// --- Заказы - Покупки --- \\\\\\\\\\\\\\\\\\\\\

/** Отправка на сервер: сохранить заказ */
export async function addOrder(list: ArticleOrderList): Promise<string> {
	console.log("Ордер на вставку в БД", list);
	const response = await fetch(api_uri_host + "/data/add-order", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body:  JSON.stringify(list.toJSON())
	});
	return await (response.ok ? response.text() : Promise.reject());
}

/** Получить с сервера: заказ по его id */
export async function getOrderById(orderId: string): Promise<string> {
	const response = await fetch(api_uri_host + "/data/get-order", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body:  JSON.stringify({orderId})
	});
	return await (response.ok ? response.json() : Promise.reject());
}

/** Получить с сервера: заказы связанные с фин. периодом с указанным id */
export function getOrdersByPeriodId(periodId: string): Promise<ArticleOrderList[]> {
	return fetch(api_uri_host + "/data/get-orders-by-period", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body:  JSON.stringify({periodId})
	})
	.then(result => result.ok ? result.json() : Promise.reject("Не удалось получить orders by period id"))
	.then((dbset: DBSet[]) => dbset.map(order => ArticleOrderList.createFromDBSet(order)));
}

/** Отправка на сервер: сохранить покупку. */
export async function addPurshase(purshase: ArticleUnit , orderList: ArticleOrderList): Promise<string> {
	const response = await fetch(api_uri_host + "/data/add-purshase", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body:  JSON.stringify( Object.assign(purshase.toJSON(), {"orderId": orderList.id}) )
	});
	return await (response.ok ? response.text() : Promise.reject());
}

/** Получить с сервера: Коллекция покупок из заказа с указанным id */
export function getPurshasesByOrderId(orderId: string): Promise<ArticleUnit[]> {
	const purshaseDBSet = fetch(api_uri_host + "/data/get-purshases", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body:  JSON.stringify({orderId})
	})
	.then(result => result.ok ? result.json() : Promise.reject("Не удалось получить purshases by order id"));
	
	return Promise.all([productDataSet, purshaseDBSet])
	.then(productAndDBset => {
		const [products, purshases] = productAndDBset;
		return purshases.map((dbset: DBSet) => ArticleUnit.createFromDBSet(dbset, products));
	});
}
