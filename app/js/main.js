"use strict";

// === объект управления основной формой создания ассортимента.
const mainFormUnitCreate = new class {

	form = document.getElementById("form-create-item");
	
	radioBtnSet_TypePacked   = document.getElementsByName("radio-type-vendor");
	radioBtnSet_TypeMeasure  = document.getElementsByName("radio-type-measure");
	conteinerBtn_setCategory = document.getElementById("set-category-btn-list");
	
	input_ItemName       = document.getElementById("input-item-name");
	input_ItemAmount     = document.getElementById("input-item-amount");
	input_ItemPrice      = document.getElementById("input-item-price");
	input_ItemDescribe   = document.getElementById("input-item-describe");
	
	btn_ItemCreateApply  = document.getElementById("item-create-apply");
	btn_ItemCreateDone   = document.getElementById("item-create-done");

	selectedVendorType = null;
	selectedMeasureType = null;
	selectedUnitCategory = null;

	activateBlock(htmlCollection) {
		Array.prototype.forEach.call(htmlCollection, element => {
			element.disabled = false;
			if (element.id) 
				document.querySelector(`label[for="${element.id}"]`).classList.remove("disabled");
		});
	}
	deactivateBlock(htmlCollection) {
		Array.prototype.forEach.call(htmlCollection, element => {
			element.disabled = true;
			if (element.id)
				document.querySelector(`label[for="${element.id}"]`).classList.add("disabled");
		});
	}

	constructor() { }
};

mainFormUnitCreate.form.addEventListener("change", function (e) {
	const self = mainFormUnitCreate;
	const nodeName = e.target?.nodeName;
	const inputSetName = e.target?.name;
	const id = e.target?.id;

	if (nodeName == "INPUT") {

		switch(inputSetName) {
		// радио кнопки определения типа распостранения.
			case "radio-type-vendor":
				switch(id) {
					case "radio-is-unit":
						self.selectedVendorType = vendorType_unit;
						self.deactivateBlock(self.radioBtnSet_TypeMeasure);
						// при штучном товаре единица измерения "штука".
						self.selectedMeasureType = measureType_unit;
						break;
					case "radio-is-weight":
						self.selectedVendorType = vendorType_weighed;
						self.activateBlock(self.radioBtnSet_TypeMeasure);
						break;
					case "radio-is-packed":
						self.selectedVendorType = vendorType_packed;
						self.activateBlock(self.radioBtnSet_TypeMeasure);
						break;
					default:
						throw new Error("неизвестный тип распостранения");
						break;
				}
				break;
		// радио кнопки установки типа единиц измерения
			case "radio-type-measure":
				switch(id) {
					case "radio-measure-milliliter":
						self.selectedMeasureType = measureType_milliliter;
						break;
					case "radio-measure-gramm":
						self.selectedMeasureType = measureType_gramm;
						break;
					default:
						throw new Error("неизвестный тип единицы измерения");
				}
				break;
			default: 
				break;
		}
	}
	console.log(e.target);
});

mainFormUnitCreate.btn_ItemCreateApply.addEventListener("click", (e) => {
	const self = mainFormUnitCreate;
	const aunit = new AssortimentUnit(
		self.selectedVendorType,
		self.selectedMeasureType,
		self.input_ItemName.value,
		self.input_ItemAmount.value,
		self.input_ItemPrice.value,
		self.selectedUnitCategory,
		self.input_ItemDescribe.value
	);
	console.log(aunit);
});

mainFormUnitCreate.btn_ItemCreateDone.addEventListener("click", (e) => {
	mainFormUnitCreate.form.style.height = "0px";
});

mainFormUnitCreate.conteinerBtn_setCategory.addEventListener("click", (e) => {
	const self = mainFormUnitCreate;
	const nodeName = e.target?.nodeName;

	if (nodeName === "BUTTON") {
		self.selectedUnitCategory = e.target.textContent;
	}
});