// === МОДУЛЬ === поставщик данных приложения.
// отсюда данные поступают в программу. это может быть:
// - локальное браузерное хранилище.
// - константные данные.
// - удаленныe базы данных.

import { ProductUnit, ProductUnitJson } from "./units/product-unit";
import * as uType from "./types";

/**
 * Запрос коллекции ассортимента.
 * @param callback (error, data [, info])
 */
export const getProductCollection = function(callback: (err: Error | null, data: ProductUnit[] | null, from: string) => void) {
	localstorDataSet.getData().then(
		data => callback(null, data, "local"), 
		error => callback(error, null, "local")
	);
	constDataSet.then(
		data => callback(null, data, "constant"), 
		error => callback(error, null, "constant")
	);
};

/**
 * Сохранение объекта продукта в хранилище.
 * @param product сохраняемый элемент.
 * @param callback (error, result) обработчик результата.
 */
export const addProductUnit = function (product: ProductUnit, callback?: CallableFunction) {
	localstorDataSet.getData()
		.then((dataset) => {
			dataset.push(product);
			return localstorDataSet.setData(dataset)
		})
		.then(info => callback?.(null, info))
		.catch(error => callback?.(error));
};


/**
 * Удаление оъекта продукта из хранилища.
 * @param {(product: ProductUnit)boolean} predicate
 * @param {(err: Error, result: string)void} callback 
 */
export const removeProductUnit = function( 
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

// получение данных из удаленной базы данных.

//TODO: так как создание объектов Product зависимо от типов, необходимо использовать цепочку промисов.

const typesOfMeasure = fetch("http://localhost:8000/api/type/measure")
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

const typesOfVendors = fetch("http://localhost:8000/api/type/package")
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

const constDataSet = Promise.all([typesOfMeasure, typesOfVendors])
	.then(typesMV => {
		return fetch("http://localhost:8000/api/data/product")
			.then(response => response.ok ? response.json() : null)
			.then(products => {
				const [measures, vendors] = typesMV;
				const productObjects = new Array<ProductUnit>();
				for (const p of products) {
					let measureType = measures.get(p.measure_id);
					let vendorType = vendors.get(p.package_id);
					if (measureType && vendorType) {
						productObjects.push(
							new ProductUnit(p.title, p.amount, parseFloat(p.price), vendorType, measureType)
						);
					} else {
						throw new Error("Не удалось создать продукт из БД" + p.title);
					}
				}
				return productObjects;
			});
	});
// жуткая хрень эти цепочки промисов....