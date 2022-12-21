// === МОДУЛЬ === основная форма создания единицы ассортимента.
import {ProductUnit} from "./units/product-unit";
import * as ut from './types';

const callbacks: CallableFunction[] = [];

export function callbacksetter(callback: (p: ProductUnit) => void ) {
	callbacks.push(callback);
}

let caller: CallableFunction;

const mainFormUnitCreate       = <HTMLDivElement>document.getElementById("form-create-item");
const radioBtnSet_TypeVendor   = <NodeListOf<HTMLInputElement>>document.getElementsByName("radio-type-vendor");
const radioBtnSet_TypeMeasure  = <NodeListOf<HTMLInputElement>>document.getElementsByName("radio-type-measure");
const conteinerBtn_setCategory = <HTMLDivElement>document.getElementById("set-category-btn-list");
	
const input_ItemName       = <HTMLInputElement>document.getElementById("input-item-name");
const input_ItemAmount     = <HTMLInputElement>document.getElementById("input-item-amount");
const input_ItemPrice      = <HTMLInputElement>document.getElementById("input-item-price");
const input_ItemDescribe   = <HTMLInputElement>document.getElementById("input-item-describe");
	
const btn_ItemCreateApply  = <HTMLButtonElement>document.getElementById("item-create-apply");
const btn_ItemCreateDone   = <HTMLButtonElement>document.getElementById("item-create-done");
const btn_ItemCreateReset = document.getElementById("item-create-reset") as HTMLButtonElement;

let amountType: symbol;
let selectedVendorType: symbol;
let selectedMeasureType: symbol;
let selectedUnitCategory: any;

function parseAmount(amount: string) {
	switch (amountType) {
		case ut.numberType_float: return parseFloat(amount);
		case ut.numberType_integer: return parseInt(amount);
		default: throw new TypeError("Неопределенный amount type");
	}
}

function parsePrice(price: string): number {
	let result = parseFloat(price);
	if (isNaN(result)) throw new Error("недопустимый формат числа стоимости");
	return result;
}

function activateBlock(htmlCollection: NodeListOf<HTMLInputElement>) {
	for (let i = 0; i < htmlCollection.length; i++) {
		htmlCollection[i].disabled = false;
		if (htmlCollection[i].id) {
			document.querySelector(`label[for="${htmlCollection[i].id}"]`)?.classList.remove("disabled");
		}
	}
}

function deactivateBlock(htmlCollection: NodeListOf<HTMLInputElement>) {
	for (let i = 0; i < htmlCollection.length; i++) {
		htmlCollection[i].disabled = true;
		if (htmlCollection[i].id) {
			document.querySelector(`label[for="${htmlCollection[i].id}"]`)?.classList.add("disabled");
		}
	}
}

/**  сценарии при выборе радио кнопки с определенными id. */
class radioBtnHandler {
	static [key: string]: CallableFunction
}
// - радио кнопки определения типа распостранения -
radioBtnHandler["radio-is-unit"] = function () {
	selectedVendorType = ut.vendorType_unit.symbolType;
	deactivateBlock(radioBtnSet_TypeMeasure);
	// при штучном товаре единица измерения "штука".
	selectedMeasureType = ut.measureType_unit.symbolType;
	amountType = ut.numberType_integer;
};
radioBtnHandler["radio-is-weight"] = function () {
	selectedVendorType = ut.vendorType_weighed.symbolType;
	activateBlock(radioBtnSet_TypeMeasure);
};
radioBtnHandler["radio-is-packed"] = function () {
	selectedVendorType = ut.vendorType_packed.symbolType;
	activateBlock(radioBtnSet_TypeMeasure);
};

// - радио кнопки установки типа единиц измерения -
radioBtnHandler["radio-measure-milliliter"] = function () {
	selectedMeasureType = ut.measureType_milliliter.symbolType;
	amountType = ut.numberType_integer;
};
radioBtnHandler["radio-measure-gramm"] = function () {
	selectedMeasureType = ut.measureType_gramm.symbolType;
	amountType = ut.numberType_integer;
};

mainFormUnitCreate.addEventListener("change", function (e) {
	const element = e.target as HTMLInputElement;
	if (element.nodeName == "INPUT" && 
	 element.name == "radio-type-vendor" || 
	 element.name == "radio-type-measure") 
	{
		radioBtnHandler[element.id]();
	}		
});

/** Очистка полей формы. */
function formCleaner(e?: Event) {
	radioBtnSet_TypeMeasure.forEach(item => item.checked = false);
	radioBtnSet_TypeVendor.forEach(item => item.checked = false);
	input_ItemName.value     = "";
	input_ItemAmount.value   = "";
	input_ItemPrice.value    = "";
	input_ItemDescribe.value = "";
}

btn_ItemCreateReset.addEventListener("click", formCleaner);

// Создание продукта.
btn_ItemCreateApply.addEventListener("click", (e) => {
	try {
		let vendor = ut.VendorType.info(selectedVendorType);
		let measure = ut.MeasureType.info(selectedMeasureType);
		if (vendor == null || measure == null) {
			throw new Error("Неопределен тип");
		}
		const product = new ProductUnit(
			input_ItemName.value,
			parseAmount(input_ItemAmount.value),
			parsePrice(input_ItemPrice.value),
			vendor,
			measure,
			selectedUnitCategory,
			input_ItemDescribe.value
		);
		// TODO: нужно событие для создаваемых в форме объектов.
		for (const callback of callbacks)
			if (typeof callback === 'function') 
				callback(product);
		if (callbacks.length === 0) 
			throw "незаданы функции обрабоки";
		formCleaner();
	} catch (err) {
		console.error("[Форма создания продукта]", "Объект не будет создан, так как возникла ошибка:", err);
	}
});

conteinerBtn_setCategory.addEventListener("click", (e) => {
	const element = e.target as HTMLElement;
	if (element.nodeName === "BUTTON") {
		selectedUnitCategory = element.textContent;
	}
});

// TODO: Это временная версия скрытия формы, она должна быть доработана.
btn_ItemCreateDone.addEventListener("click", (e) => {
	mainFormUnitCreate.style.display = "none";
	mainFormUnitCreate.parentElement?.classList.add('compact');

	if (!mainFormUnitCreate.parentElement) return;

	mainFormUnitCreate.parentElement.onclick = (e) => {

		if (e.target === mainFormUnitCreate.parentElement 
		&& mainFormUnitCreate.parentElement)
		{
			mainFormUnitCreate.parentElement.classList.remove('compact');
			mainFormUnitCreate.style.display = "block";
			mainFormUnitCreate.parentElement.onclick = null;
		}
	};
});
