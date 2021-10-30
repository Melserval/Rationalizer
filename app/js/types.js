"use strict";
// *** различные типы представляющее единицы измерения и выды ассортимента. ***

// проксимизатор.
const proxyTypeHandler = {
    set(target, prop, value) {
        throw new TypeError(`Нельзя просто так добавлять свойства в сюда!`);
    },
    get(target, prop) {
        if (prop in target) return target[prop];
        // позволяет получать информацию о типе, передавая Symbol-идентификатор.
        switch (prop) {
            case "type": 
            case "short": 
            case "full":
            case "description":
                return (SymbolType) => target.typeInfo.get(SymbolType)[prop];
            case "info": 
                return (SymbolType) => target.typeInfo.get(SymbolType);
            default:
                return undefined;
        }
    },
    /**
     * Новый тип единицы измерения.
     * @param {Symbol} symbolType глобальный символ для типа.
     * @param {string} full полное обозначание
     * @param {string} short краткое обозначение
     * @param {string} [desc] полное описание.
     */
    apply(target, thisArg, args) {
        // позволяет удобно определять новые типы, вызывая  класс как функцию
        // -  typeObject("typename", "full", "shorttitle", "desctiption").
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


// --- собственные типы для различных сущностей, замена enum и struct ---
class UserType {
    /**
     * Новый тип единицы измерения.
     * @param {Symbol|string} symbolType символ типа | название нового типа
     * @param {string} full полное обозначание
     * @param {string} short краткое обозначение
     * @param {string} [desc] полное описание.
     */
    constructor(symbolType, full, short, desc) {
        if (typeof symbolType !== 'symbol' && typeof symbolType !== 'string') {
            throw new TypeError(`Первым аргументом должен быть Symbol или строка, но передан "${typeof symbolType}".`);
        }
        this.type = (typeof symbolType === 'symbol') ? symbolType : Symbol.for(symbolType);
        this.full = full;
        this.short = short;
        this.description = desc;
    }
}


// --- типы распостранения ассортимента (упакован, фасованный, развес, штучный, etc...) ---
class VendorType extends UserType {
    static typeInfo = new Map();
} 
VendorType = new Proxy(VendorType, proxyTypeHandler);
const vendorType_unit = VendorType("vendorType_unit", "штучный");
const vendorType_packed = VendorType("vendorType_packed", "фасованный");
const vendorType_weighed = VendorType("vendorType_weighed", "развесной");


// --- типы единиц измерения (вес, обьем, etc...) ---
class MeasureType extends UserType {
    static typeInfo = new Map();
}
MeasureType = new Proxy( MeasureType, proxyTypeHandler);
const measureType_unit = MeasureType("measureType_unit", "штука", "шт.");
const measureType_milliliter = MeasureType("measureType_milliliter", "миллилитр", "ml.");
const measureType_liter = MeasureType("MeasureType_liter", "литр", "l.");
const measureType_gramm = MeasureType("measureType_gramm", "грамм", "gr.");
const measureType_kilogramm =  MeasureType("measureType_kilogramm", "килограмм", "kg.");
const measureType_kilowatt =  MeasureType("measureType_kilowatt", 'киловатт', 'kw.');


// --- типы чисел (целый, с плавающей точкой) ---
class NumberType extends UserType {
    static typeInfo = new Map();
} 
NumberType = new Proxy(NumberType, proxyTypeHandler);
const numberType_integer = NumberType("numberType_integer", "integer");
const numberType_float = NumberType("numberType_float", "float");