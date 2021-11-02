// === МОДУЛЬ === поставщик данных приложения.
// отсюда данные поступают в программу. это может быть как локальное,
// браузерное хранилище (LocalStorage), константные данные, так и 
// функционал подключения к удаленным базам данных.

// -> callback = function (error, data [, info]) { };
export const callbacksetter = function(callback) {
    localstorDataSet.then(data => callback(null, data, "local"), callback);
    constDataSet.then(data => callback(null, data, "constant"), callback);
};

// сохранение переданных данных из программы.
export const storagerdata = function (data, callback) {
    new Promise(savedata.bind(null, data))
        .then(callback.bind(null, null), callback);
};

// симуляция получения данных по сети...
const loaddata = new Promise(function (resolve, reject) {
    
});

// симуляция сохранения/отправки данных.
const LOCAL_STORAGE_KEY = 'product_unit_set';
const savedata = function (data, resolve, reject) {
    try {
        const storage =  JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? [];
        storage.push(data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storage));
        resolve(`Данные сохранены в локальном хранилище [${storage.length}]`);
    } catch (err) {
        reject(err);
    }
};

const localstorDataSet = new Promise((resolve, reject) => {
    try {
        resolve( JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
                      ?.map(item => ProductUnit.fromJson(item)) ?? [] );
    } catch (err) {
        reject(err);
    }
});

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
