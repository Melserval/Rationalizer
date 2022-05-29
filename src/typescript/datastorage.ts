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

// симуляция получения данных по сети...
const loaddata = new Promise(function (resolve, reject) {
	
});

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

const constDataSet = Promise.resolve<ProductUnit[]>(new Array<[string, number, number, uType.VendorType, uType.MeasureType]>(
	[`Вкусная колбаска "До пюрешки"`,              500, 72.00, uType.vendorType_packed, uType.measureType_gramm],
	[`Невкусная шинка "Кузьмич" (Колбасный Ряд)`,  500, 48.60, uType.vendorType_packed, uType.measureType_gramm],
	[`Сгущенное молоко "Ичня"`,                    500, 67.50, uType.vendorType_packed, uType.measureType_milliliter],
	[`Хлеб "Пшеничный", нарезной (Кулиничи)`,      650, 21.40, uType.vendorType_packed, uType.measureType_gramm],
	[`Хлеб "Пушкаревский", нарезной (Кулиничи)`,   600, 21.40, uType.vendorType_packed, uType.measureType_gramm],
	[`Майонез "Домашний" (Торчин)`,                580, 39.60, uType.vendorType_packed, uType.measureType_gramm],
	[`Кетчуп "Лагидный" (Торчин)`,                 450, 18.50, uType.vendorType_packed, uType.measureType_gramm],
	[`Витамины "Ундевит" упаковка 50 драже`,       1,   22.60, uType.vendorType_unit,   uType.measureType_unit],
	[`Таблетки "Парацетомол 500" упаковка 10 шт.`, 1,   26.40, uType.vendorType_unit,   uType.measureType_unit],
	[`Хлеб "Белорусский", нарезной (Киев Хлиб)`,   700, 25.30, uType.vendorType_packed, uType.measureType_gramm],
	[`Картофель, сорт 2`,                            1,   7.60, uType.vendorType_weighed, uType.measureType_kilogramm],
	[`Морковь, сорт 1`,                              1,   7.60, uType.vendorType_weighed, uType.measureType_kilogramm],
	[`Свекла, сорт 1`,                               1,   8.40, uType.vendorType_weighed, uType.measureType_kilogramm],
	[`оплата интернета`,                             1, 199.00, uType.vendorType_unit,    uType.measureType_unit],
	[`оплата электроэнергии`,                        1,  1.44, uType.vendorType_weighed, uType.measureType_kilowatt],
	[`Горох сухой, половинками (Розумный выбор)`,    1, 16.60, uType.vendorType_packed, uType.measureType_kilogramm],
	[`Гречка (Розумный выбор)`,                      1, 39.90, uType.vendorType_packed, uType.measureType_kilogramm],
	[`Колбаса "Салями Премиум", варено-копченая (Добров)`, 320, 77.70, uType.vendorType_packed, uType.measureType_gramm],
	[`Соль пищевая.`,                                 1.5, 7.70, uType.vendorType_packed, uType.measureType_kilogramm]
).map(item => new ProductUnit(...item)));
