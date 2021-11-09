// === МОДУЛЬ === поставщик данных приложения.
// отсюда данные поступают в программу. это может быть:
// - локальное браузерное хранилище.
// - константные данные.
// - удаленныe базы данных.


/**
 * Запрос коллекции ассортимента.
 * @param {(error, data, info?)void} callback (error, data [, info])
 */
export const getProductCollection = function(callback) {
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
 * @param {ProductUnit} product сохраняемый элемент.
 * @param {(error, result)void} [callback] обработчик результата.
 */
export const addProductUnit = function (product, callback) {
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
export const removeProductUnit = function(predicate, callback) {
    // TODO: Организовать проверку наличия/ожидания коллекции.
    localstorDataSet.getData()
    .then(data => new Promise((resolve, reject) => {
        try {
            const result =  data.reduce(function (acc, product) {
                if (predicate(product)) {
                    console.log("Продукт с id: " + product.id + " удален.");
                    return acc;
                } 
                acc.push(product);
                return acc;
            }, []); 
            localstorDataSet.setData(result).then(resolve.bind(null, result));
        } catch (error) {
           reject(error);
        }
    }))
    .then(callback?.bind(null, null))
    .catch(callback);
};

// симуляция получения данных по сети...
const loaddata = new Promise(function (resolve, reject) {
    
});

const localstorDataSet = {
    LOCAL_STORAGE_KEY: 'product_unit_set',
    getData() {
        return new Promise((resolve, reject) => {
           try {
                const data =  JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY))
                    ?.map(item => ProductUnit.fromJson(item)) ?? [];
               resolve(data);
           } catch (err) {
               reject(err);
           }
        });
    },
    setData(productCollection) {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(productCollection));
                resolve(`Данные сохранены в локальном хранилище [${productCollection.length}]`);
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

const constDataSet = Promise.resolve([
    [`Вкусная колбаска "До пюрешки"`,              500, 72.00, vendorType_packed, measureType_gramm],
    [`Невкусная шинка "Кузьмич" (Колбасный Ряд)`,  500, 48.60, vendorType_packed, measureType_gramm],
    [`Сгущенное молоко "Ичня"`,                    500, 67.50, vendorType_packed, measureType_milliliter],
    [`Хлеб "Пшеничный", нарезной (Кулиничи)`,      650, 21.40, vendorType_packed, measureType_gramm],
    [`Хлеб "Пушкаревский", нарезной (Кулиничи)`,   600, 21.40, vendorType_packed, measureType_gramm],
    [`Майонез "Домашний" (Торчин)`,                580, 39.60, vendorType_packed, measureType_gramm],
    [`Кетчуп "Лагидный" (Торчин)`,                 450, 18.50, vendorType_packed, measureType_gramm],
    [`Витамины "Ундевит" упаковка 50 драже`,       1,   22.60, vendorType_unit,   measureType_unit],
    [`Таблетки "Парацетомол 500" упаковка 10 шт.`, 1,   26.40, vendorType_unit,   measureType_unit],
    [`Хлеб "Белорусский", нарезной (Киев Хлиб)`,   700, 25.30, vendorType_packed, measureType_gramm],
    [`Картофель, сорт 2`,                            1,   7.60, vendorType_weighed, measureType_kilogramm],
    [`Морковь, сорт 1`,                              1,   7.60, vendorType_weighed, measureType_kilogramm],
    [`Свекла, сорт 1`,                               1,   8.40, vendorType_weighed, measureType_kilogramm],
    [`оплата интернета`,                             1, 199.00, vendorType_unit,    measureType_unit],
    [`оплата электроэнергии`,                        1,  1.44, vendorType_weighed, measureType_kilowatt],
    [`Горох сухой, половинками (Розумный выбор)`,    1, 16.60, vendorType_packed, measureType_kilogramm],
    [`Гречка (Розумный выбор)`,                      1, 39.90, vendorType_packed, measureType_kilogramm],
    [`Колбаса "Салями Премиум", варено-копченая (Добров)`, 320, 77.70, vendorType_packed, measureType_gramm],
    [`Соль пищевая.`,                                 1.5, 7.70, vendorType_packed, measureType_kilogramm]
].map(item => new ProductUnit(...item)));
