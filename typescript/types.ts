/*
 * различные типы представляющее единицы измерения и выды ассортимента.
*/


// --- собственные типы для различных сущностей, замена enum и struct ---
export class UserType {
    private static typeInfo = new Map<string, UserType>();

    private readonly typeName: string;
    readonly symbolType: symbol;
    readonly labelFull: string;
    readonly labelShort?: string;
    readonly description?: string;

    /**
     * Новый тип единицы измерения.
     * @param typename  название нового типа
     * @param labelFull  полное описательное название 
     * @param labelShort краткое обозначение
     * @param desc полное описание или пояснения
     */
    constructor(typename:  string, labelFull: string, labelShort?: string, desc?: string) {
        try {
            if (typename.match(/^[a-z_$]+[a-z0-9_$]+$/i) === null) {
                throw new Error("Неверный формат для имени типа");
            }
            this.typeName = typename;
            this.symbolType = Symbol.for(typename);
            this.labelFull = labelFull;
            this.labelShort = labelShort ;
            this.description = desc;
            UserType.typeInfo.set(this.typeName, this);
        } catch (err: any) {
            console.error("Возникла ошибка при создании типа.", err.message);
            throw err;
        }
    }

    /**
     * 
     * @param typename строка идентификатор, в формате константы.
     * @param labelFull  полное описательное название 
     * @param labelShort краткое обозначение
     * @param desc полное описание или пояснения
     * @returns символ типа.
     */
    static create(typename: string, labelFull: string, labelShort?: string, desc?: string): symbol {
        return (new this(typename, labelFull, labelShort, desc)).symbolType;
    }
    
    /**
     * Предоставляет информацию о пользовательском типе.
     * @param typeSymbol интересующий тип
     * @returns объект содержащий информацию о типе.
     */
    static info(checkType: symbol | string): UserType | null {
        if (typeof checkType === 'string') {
            return this.typeInfo.get(checkType) ?? null;
        }
        const typename = Symbol.keyFor(checkType);
        if (typename) {
            return this.typeInfo.get(typename) ?? null;
        }
        return null;
    }

    /**
     * Проверяет что тип является соответствующим коллекции типов. 
     * @param checkType проверяемый тип
     * @returns допустимый ли тип.
     */
    static isValid(checkType: symbol | string): boolean {
        if (typeof checkType === 'string') {
            return this.typeInfo.has(checkType);
        } else {
            const nametype = Symbol.keyFor(checkType);
            return nametype ? this.typeInfo.has(nametype) : false;
        }
    }
}


// --- типы распостранения ассортимента (упакован, фасованный, развес, штучный, etc...) ---
export class VendorType extends UserType { } 

export const 
    vendorType_unit = VendorType.create("vendorType_unit", "штучный"),
    vendorType_packed = VendorType.create("vendorType_packed", "фасованный"),
    vendorType_weighed = VendorType.create("vendorType_weighed", "развесной");


// --- типы единиц измерения (вес, обьем, etc...) ---
export class MeasureType extends UserType { }

export const 
    measureType_unit = MeasureType.create("measureType_unit", "штука", "шт."),
    measureType_milliliter = MeasureType.create("measureType_milliliter", "миллилитр", "ml."),
    measureType_liter = MeasureType.create("MeasureType_liter", "литр", "l."),
    measureType_gramm = MeasureType.create("measureType_gramm", "грамм", "gr."),
    measureType_kilogramm =  MeasureType.create("measureType_kilogramm", "килограмм", "kg."),
    measureType_kilowatt =  MeasureType.create("measureType_kilowatt", 'киловатт', 'kw.');


// --- типы чисел (целый, с плавающей точкой) ---
export class NumberType extends UserType { }

export const 
    numberType_integer = NumberType.create("numberType_integer", "integer"),
    numberType_float = NumberType.create("numberType_float", "float");
