// === МОДУЛЬ === основная форма создания единицы ассортимента.
import ProductUnit from "./units/product-unit.js";

var caller = null;
export function callbacksetter(callback) {
	caller = callback;
}

const mainFormUnitCreate = document.getElementById("form-create-item");
const radioBtnSet_TypePacked   = document.getElementsByName("radio-type-vendor");
const radioBtnSet_TypeMeasure  = document.getElementsByName("radio-type-measure");
const conteinerBtn_setCategory = document.getElementById("set-category-btn-list");
	
const input_ItemName       = document.getElementById("input-item-name");
const input_ItemAmount     = document.getElementById("input-item-amount");
const input_ItemPrice      = document.getElementById("input-item-price");
const input_ItemDescribe   = document.getElementById("input-item-describe");
	
const btn_ItemCreateApply  = document.getElementById("item-create-apply");
const btn_ItemCreateDone   = document.getElementById("item-create-done");

let amountType = null;
let selectedVendorType = null;
let selectedMeasureType = null;
let selectedUnitCategory = null;

const parseAmount = function (amount) {
	switch (amountType) {
		case numberType_float: return parseFloat(amount);
		case numberType_integer: return parseInt(amount);
		default: throw new TypeError("Неопределенный amount type");
	}
};

const parsePrice = function (price) {
	return parseFloat(price);
};

const activateBlock = function(htmlCollection) {
	Array.prototype.forEach.call(htmlCollection, element => {
		element.disabled = false;
		if (element.id) 
			document.querySelector(`label[for="${element.id}"]`).classList.remove("disabled");
	});
};

const deactivateBlock = function (htmlCollection) {
	Array.prototype.forEach.call(htmlCollection, element => {
		element.disabled = true;
		if (element.id)
			document.querySelector(`label[for="${element.id}"]`).classList.add("disabled");
	});
};

/**  сценарии при выборе радио кнопки с определенными id. */
const radioBtnHandler = new Proxy({}, {
	get(t, p) {
		if (p in t) return t[p];
		else throw new Error(`неизвестный тип единицы измерения ${p}`);
	}
});
// - радио кнопки определения типа распостранения -
radioBtnHandler["radio-is-unit"] = function () {
	selectedVendorType = vendorType_unit;
	deactivateBlock(radioBtnSet_TypeMeasure);
	// при штучном товаре единица измерения "штука".
	selectedMeasureType = measureType_unit;
	amountType = numberType_integer;
};
radioBtnHandler["radio-is-weight"] = function () {
	selectedVendorType = vendorType_weighed;
	activateBlock(radioBtnSet_TypeMeasure);
};
radioBtnHandler["radio-is-packed"] = function () {
	selectedVendorType = vendorType_packed;
	activateBlock(radioBtnSet_TypeMeasure);
};

// - радио кнопки установки типа единиц измерения -
radioBtnHandler["radio-measure-milliliter"] = function () {
	selectedMeasureType = measureType_milliliter;
	amountType = numberType_integer;
};
radioBtnHandler["radio-measure-gramm"] = function () {
	selectedMeasureType = measureType_gramm;
	amountType = numberType_integer;
};

mainFormUnitCreate.addEventListener("change", function (e) {
	const nodeName = e.target.nodeName;
	const inputSetName = e.target.name;
	const id = e.target.id;
	if (nodeName == "INPUT" && 
		inputSetName == "radio-type-vendor" || 
		inputSetName == "radio-type-measure") 
	{
		radioBtnHandler[id]();
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
	if (e.target.nodeName === "BUTTON") {
		selectedUnitCategory = e.target.textContent;
	}
});

btn_ItemCreateDone.addEventListener("click", (e) => {
	mainFormUnitCreate.style.display = "none";
	mainFormUnitCreate.parentElement.classList.add('compact');
	mainFormUnitCreate.parentElement.onclick = (e) => {
		if (e.target !== mainFormUnitCreate.parentElement) return;
		mainFormUnitCreate.parentElement.classList.remove('compact');
		mainFormUnitCreate.style.display = "block";
		mainFormUnitCreate.parentElement.onclick = null;
	};
});
