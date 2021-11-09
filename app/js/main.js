"use strict";

// === объект управления основной формой создания ассортимента.
const mainFormUnitCreate = new function () {

	this.form = document.getElementById("form-create-item");
	
	this.radioBtnSet_TypePacked   = document.getElementsByName("radio-type-vendor");
	this.radioBtnSet_TypeMeasure  = document.getElementsByName("radio-type-measure");
	this.conteinerBtn_setCategory = document.getElementById("set-category-btn-list");
	
	this.input_ItemName       = document.getElementById("input-item-name");
	this.input_ItemAmount     = document.getElementById("input-item-amount");
	this.input_ItemPrice      = document.getElementById("input-item-price");
	this.input_ItemDescribe   = document.getElementById("input-item-describe");
	
	this.btn_ItemCreateApply  = document.getElementById("item-create-apply");
	this.btn_ItemCreateDone   = document.getElementById("item-create-done");

	this.amountType = null;
	this.selectedVendorType = null;
	this.selectedMeasureType = null;
	this.selectedUnitCategory = null;

	this.parseAmount = function (amount) {
		switch (this.amountType) {
			case numberType_float: return parseFloat(amount);
			case numberType_integer: return parseInt(amount);
			default: throw new TypeError("Неопределенный amount type");
		}
	};
	this.parsePrice = function (price) {
		return parseFloat(price);
	};
	this.activateBlock = function(htmlCollection) {
		Array.prototype.forEach.call(htmlCollection, element => {
			element.disabled = false;
			if (element.id) 
				document.querySelector(`label[for="${element.id}"]`).classList.remove("disabled");
		});
	};
	this.deactivateBlock = function (htmlCollection) {
		Array.prototype.forEach.call(htmlCollection, element => {
			element.disabled = true;
			if (element.id)
				document.querySelector(`label[for="${element.id}"]`).classList.add("disabled");
		});
	};
};

mainFormUnitCreate.form.addEventListener("change", function (e) {
	const self = mainFormUnitCreate;
	const nodeName = e.target?.nodeName;
	const inputSetName = e.target?.name;
	const id = e.target?.id;

	if (nodeName == "INPUT") {

		switch(inputSetName) {
		// --- радио кнопки определения типа распостранения. ---
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
		// --- радио кнопки установки типа единиц измерения ---
			case "radio-type-measure":
				switch(id) {
					case "radio-measure-milliliter":
						self.selectedMeasureType = measureType_milliliter;
						self.amountType = numberType_integer;
						break;
					case "radio-measure-gramm":
						self.selectedMeasureType = measureType_gramm;
						self.amountType = numberType_integer;
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
	try {
		const aunit = new AssortimentUnit(
			self.input_ItemName.value,
			self.parseAmount(self.input_ItemAmount.value),
			self.parsePrice(self.input_ItemPrice.value),
			self.selectedVendorType,
			self.selectedMeasureType,
			self.selectedUnitCategory,
			self.input_ItemDescribe.value
		);
		// TODO: нужно событие для создаваемых в форме объектов.
		dataFromStorage.push(aunit);
		mainAssortimentList.add(aunit);
		localStorage.setItem(
			"dataset", 
			JSON.stringify( dataFromStorage, function(k, v) {
					if (typeof v == 'symbol') {
						if (k == "packageType" || k == "measureType") {
							return Symbol.keyFor(v);
						}
					} 
					return v;
			}));
	} catch (err) {
		console.error(err);
	}
});

mainFormUnitCreate.btn_ItemCreateDone.addEventListener("click", (e) => {
	mainFormUnitCreate.form.style.display = "none";
	mainFormUnitCreate.form.parentElement.classList.add('compact');
	console.log("Закрываю!");
	mainFormUnitCreate.form.parentElement.onclick = (e) => {
		if (e.target !== mainFormUnitCreate.form.parentElement) return;
		console.log("Открываю!");
		mainFormUnitCreate.form.parentElement.classList.remove('compact');
		mainFormUnitCreate.form.style.display = "block";
		mainFormUnitCreate.form.parentElement.onclick = null;
	};

});

mainFormUnitCreate.conteinerBtn_setCategory.addEventListener("click", (e) => {
	const self = mainFormUnitCreate;
	const nodeName = e.target?.nodeName;

	if (nodeName === "BUTTON") {
		self.selectedUnitCategory = e.target.textContent;
	}
});

// === объект управления формой создания списков приобритений.
var formCreateOrderList;

// === создание основного списка ассортимента
const conteinerMainAssortimentList = document.getElementById("main-assortiment-list");
const mainAssortimentList = new AssortimentList("Основной список товаров");

mainAssortimentList.setRender(
	conteinerMainAssortimentList,
	RenderAssortimentUnit, 
	function(view, model) {
		try {
		view.setName = model.name;
		view.setAmount = `${model.amount} ${MeasureType.short(model.measureType)}`;
		view.setPrice = model.price.toFixed(2);
		} catch (err) {
			console.error("Ошипка!!!", err);
			console.dir(model);
			console.dir(MeasureType.short);
		}
	}
);
mainAssortimentList.add(dataSet);
mainAssortimentList.add(dataFromStorage);
mainAssortimentList.show();