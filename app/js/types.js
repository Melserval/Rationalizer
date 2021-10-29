"use strict";
// *** различные типы представляющее единицы измерения и выды ассортимента. ***

/* 
 * Объект - проксимизатор, позволяет удобно определять новые типы, вызывая как: 

 * функцию - typeObject("typename", "title", "shorttitle", "desctiption")
 *  обязательны аргументы: 1 - название типа.
 * 
 * свойство-медод - typeObject.<typename>("title", "shorttitle", "desctiption") 
 */
const proxyTypeHandler = {
    set(target, prop, value) {
        throw new TypeError(`Нельзя просто так добавлять свойства в сюда!`);
    },
    get(target, prop) {
        if (prop in target) return target[prop];
        return function(...args) {
            target.types[prop] = new target(...args);
        }
    },
    apply(target, thisArg, args) {
        if (args.length >= 1 && typeof args[0] === 'string') 
        {
            let type = Symbol.for(args[0]);
            target.typeInfo.set(type, new target(type, ...args.slice(1)));
            return type;
        } else {
            throw new Error("Неверное количество или тип аргументов для "+target.name);
        }
    }
};


// --- типы распостранения ассортимента (упакован, фасованный, развес, штучный, etc...) ---
class VendorType {
    constructor(vendortype, title, desc="") {
        if (typeof vendortype !== 'symbol') {
            throw new TypeError("vendor type должен быть Symbol! Передан тип " + (typeof vendortype));
        }
        this.type = vendortype;
        this.title = title;
        this.description = desc;
    }
    static typeInfo = new Map();
} 
VendorType = new Proxy(VendorType, proxyTypeHandler);

const vendorType_unit = VendorType("vendorType_unit", "штучный");
const vendorType_packed = VendorType("vendorType_packed", "фасованный");
const vendorType_weighed = VendorType("vendorType_weighed", "развесной");


// --- типы единиц измерения (вес, обьем, etc...) ---
class MeasureType {
    /**
     * Новый тип единицы измерения.
     * @param {string} measuretype название для типа.
     * @param {string} full полное обозначание
     * @param {string} short краткое обозначение
     * @param {string} [desc] полное описание.
     */
    constructor(measuretype, full, short, desc="") {
        if (typeof measuretype !== 'symbol') {
            throw new TypeError("measure type должен быть Symbol! Передан тип " + (typeof measuretype));
        }
        this.type = measuretype;
        this.title = full;
        this.short = short;
        this.description = desc;
    }
    static typeInfo = new Map();
}
MeasureType = new Proxy( MeasureType, proxyTypeHandler);

const measureType_unit = MeasureType("measureType_unit", "штука", "шт.");
const measureType_milliliter = MeasureType("measureType_milliliter", "миллилитр", "ml.");
const measureType_liter = MeasureType("MeasureType_liter", "литр", "l.");
const measureType_gramm = MeasureType("measureType_gramm", "грамм", "gr.");
const measureType_kilogramm =  MeasureType("measureType_kilogramm", "килограмм", "kg.");
const measureType_kilowatt =  MeasureType("measureType_kilowatt", 'киловатт', 'kw.');
