// === МОДУЛЬ === основная форма создания единицы ассортимента.
import {ProductUnit} from "./units/product-unit";
import * as ut from './types';


export function callbacksetter(callback: CallableFunction) {
	caller = callback;
}

let caller: CallableFunction;

const ENF = () => { throw new Error("html_element_not_found") };

const mainFormUnitCreate       = <HTMLDivElement>document.getElementById("form-create-item") ?? ENF();
const radioBtnSet_TypePacked   = <NodeListOf<HTMLInputElement>>document.getElementsByName("radio-type-vendor") ?? ENF();
const radioBtnSet_TypeMeasure  = <NodeListOf<HTMLInputElement>>document.getElementsByName("radio-type-measure") ?? ENF();
const conteinerBtn_setCategory = <HTMLDivElement>document.getElementById("set-category-btn-list") ?? ENF();
	
const input_ItemName       = <HTMLInputElement>document.getElementById("input-item-name") ?? ENF();
const input_ItemAmount     = <HTMLInputElement>document.getElementById("input-item-amount") ?? ENF();
const input_ItemPrice      = <HTMLInputElement>document.getElementById("input-item-price") ?? ENF();
const input_ItemDescribe   = <HTMLInputElement>document.getElementById("input-item-describe") ?? ENF();
	
const btn_ItemCreateApply  = <HTMLButtonElement>document.getElementById("item-create-apply") ?? ENF();
const btn_ItemCreateDone   = <HTMLButtonElement>document.getElementById("item-create-done") ?? ENF();

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
	Array.prototype.forEach.call(htmlCollection, element => {
		element.disabled = false;
		if (element.id) 
			document.querySelector(`label[for="${element.id}"]`)?.classList.remove("disabled") ?? ENF();
	});
}

function deactivateBlock(htmlCollection: NodeListOf<HTMLInputElement>) {
	Array.prototype.forEach.call(htmlCollection, element => {
		element.disabled = true;
		if (element.id)
			document.querySelector(`label[for="${element.id}"]`)?.classList.add("disabled");
	});
}

/**  сценарии при выборе радио кнопки с определенными id. */
class radioBtnHandler {
	static [key: string]: CallableFunction
}
// - радио кнопки определения типа распостранения -
radioBtnHandler["radio-is-unit"] = function () {
	selectedVendorType = ut.vendorType_unit;
	deactivateBlock(radioBtnSet_TypeMeasure);
	// при штучном товаре единица измерения "штука".
	selectedMeasureType = ut.measureType_unit;
	amountType = ut.numberType_integer;
};
radioBtnHandler["radio-is-weight"] = function () {
	selectedVendorType = ut.vendorType_weighed;
	activateBlock(radioBtnSet_TypeMeasure);
};
radioBtnHandler["radio-is-packed"] = function () {
	selectedVendorType = ut.vendorType_packed;
	activateBlock(radioBtnSet_TypeMeasure);
};

// - радио кнопки установки типа единиц измерения -
radioBtnHandler["radio-measure-milliliter"] = function () {
	selectedMeasureType = ut.measureType_milliliter;
	amountType = ut.numberType_integer;
};
radioBtnHandler["radio-measure-gramm"] = function () {
	selectedMeasureType = ut.measureType_gramm;
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

btn_ItemCreateApply.addEventListener("click", (e) => {
	try {
		const product = new ProductUnit(
			input_ItemName.value,
			parseAmount(input_ItemAmount.value),
			parsePrice(input_ItemPrice.value),
			selectedVendorType,
			selectedMeasureType,
			selectedUnitCategory,
			input_ItemDescribe.value
		);
		// TODO: нужно событие для создаваемых в форме объектов.
		if (typeof caller === 'function') caller(product);
	} catch (err) {
		console.error("Объект не будет создан, так как возникла ошибка.", err);
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
