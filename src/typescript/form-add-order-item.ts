// Форма коррекции количества и/или цены выбранного
// ассортимента, при добавлении его в список приобритаемого.
// получает данные из объекта - единицы ассортимента, возвращает объект
// с данными, для создания объекта ассортимента - единицы заказа.

import { IArticleItem } from "./units/i-article-item";


export default class RenterFormAddOrderItem {

	private _quantity = 1;
	private _destination?: HTMLElement;

	private _nodeElement    = document.createElement("form");
	private _p_title        = document.createElement("p");
	private _input_quantity = document.createElement("input");
	private _input_price    = document.createElement("input");
	private _btn_reset      = document.createElement("button");
	private _btn_apply      = document.createElement("button");
	private _btn_cancel     = document.createElement("button");
	private _btn_increase   = document.createElement("button");
	private _btn_reduce     = document.createElement("button");

	/**
	 * @param orderItem объект выбираемого продукта.
	 * @param _applyCallback обработчик выполнения формы.
	 * @param _cancelCallback обработчик отмены формы.
	 */
	constructor(
		private orderItem: IArticleItem,
		private _applyCallback: (quantity: number) => void, 
		private _cancelCallback: (message: string) => void
	) {

		// форма
		this._nodeElement.setAttribute("class", "form-add-article-to-order");
		
		// метка сумма
		const label_price = document.createElement("label");
		label_price.textContent = "сумма";
		
		// метка количества
		const label_quantity = document.createElement("label");
		label_quantity.textContent = "количество";

		// Обертка блока суммы
		const div_wrapper_price_block = document.createElement("div");
		div_wrapper_price_block.append(label_price, this._input_price);
		
		// обертка блока количества
		const div_wrapper_quantity = document.createElement("div");
		div_wrapper_quantity.append(label_quantity, this._input_quantity);
				
		// секция для блоков количества и суммы	
		const div_input_set = document.createElement("div");
		div_input_set.setAttribute("class", "input-set");
		div_input_set.append(div_wrapper_quantity, div_wrapper_price_block);

		// btn apple
		this._btn_apply.setAttribute("type", "submit");
		this._btn_apply.textContent = "Готово";
		// btn reset
		this._btn_reset.setAttribute("type", "reset");
		this._btn_reset.textContent = "Сброс";
		//btn cancel
		this._btn_cancel.setAttribute("type", "button");
		this._btn_cancel.textContent = "Отмена";

		//btn increase
		this._btn_increase.setAttribute("type", "button");
		this._btn_increase.textContent = "+";
		//btn reduce
		this._btn_reduce.setAttribute("type", "button");
		this._btn_reduce.textContent = "-";

		// обертки кнопок
		const div_wrapper_btn_apply = document.createElement("div");
		div_wrapper_btn_apply.append(this._btn_apply)
		
		const div_wrapper_btn_reset = document.createElement("div");
		div_wrapper_btn_reset.append(this._btn_reset);
			
		const div_wrapper_btn_cancel = document.createElement("div");
		div_wrapper_btn_cancel.append(this._btn_cancel);

		const div_wrapper_btn_quantity = document.createElement("div");
		div_wrapper_btn_quantity.setAttribute("class", "quantity-controll");
		div_wrapper_btn_quantity.append(
			this._btn_increase,
			this._btn_reduce
		);

		// секция кнопок настройки количества.
		const div_btn_set_1 = document.createElement("div");
		div_btn_set_1.setAttribute("class", "btn-set");
		div_btn_set_1.append(div_wrapper_btn_quantity);
		
		// секция кнопок сброс, отмена, ок
		const div_btn_set_2 = document.createElement("div");
		div_btn_set_2.setAttribute("class", "btn-set");
		div_btn_set_2.append(
			div_wrapper_btn_apply,
			div_wrapper_btn_reset, 
			div_wrapper_btn_cancel 
		);

		this._nodeElement.append(this._p_title, div_btn_set_1, div_input_set, div_btn_set_2);
		
		// Обработчики
		this._nodeElement.addEventListener("submit", this._handlerFormSubmit.bind(this));
		this._nodeElement.addEventListener("reset", this._handleFormReset.bind(this));
		this._btn_cancel.addEventListener("click", this._handleFormCancel.bind(this));

		this._btn_increase.addEventListener("click", this._handlerQuantityIncrease.bind(this));
		this._btn_reduce.addEventListener("click", this._handlerQuantityReduce.bind(this));

		this._input_price.addEventListener("input", this._handlerPriceInput.bind(this));
		this._input_price.addEventListener("focus", function(e) {this.value = ""});
		this._input_price.addEventListener("blur", ((self) => function(e) {
			if (this.value.trim().length == 0) 
				this.value = self.calcQuantityToTotalPrice(self._quantity).toString();
		})(this));

		this._input_quantity.addEventListener("input", this._handlerQuantityInput.bind(this));
		this._input_quantity.addEventListener("focus", function(e) {this.value = ""});
		this._input_quantity.addEventListener("blur", ((self) => function(e) {
			if (this.value.trim().length == 0)
				this.value = self._quantity.toString();
		})(this));

		// Начальная установка полей формы
		this.quantity = this._quantity;
	}

	set quantity(value: number) {
		this._input_quantity.setAttribute(
			"value", 
			this._input_quantity.value = value.toString()
		);
	}
	set price(value: number) {
		this._input_price.setAttribute(
			"value",
			this._input_price.value = value.toString()
		);
	}
	set title(value: string) {
		this._p_title.textContent = value;
	}

	private calcTotalPriceToQuantity(totalPrice: number): number {
		return (totalPrice < this.orderItem.price) ? 
		       0 : 0^(totalPrice / this.orderItem.price);
	}
	private calcQuantityToTotalPrice(quantity: number): number {
		return this.orderItem.price * quantity;
	}

	render(destination: HTMLElement) {
		this.quantity = this._quantity;
		this.price = this.calcQuantityToTotalPrice(this._quantity);
		this.title = this.orderItem.title;
		this._destination = destination;
		this._destination.append(this._nodeElement);
	}

	// обработчики событий формы
	_handlerFormSubmit(e: SubmitEvent) {
		e.preventDefault();
		this._applyCallback(this._quantity);
		this._nodeElement.remove();
	}

	_handleFormCancel(e: MouseEvent) {
		this._cancelCallback("user cancel input");
		this._nodeElement.remove();
	}

	_handleFormReset(e: Event) {
		this.quantity = this._quantity = 1;
		this.price = this.orderItem.price;
		console.log("Form Reset");
	}

	_handlerQuantityIncrease(e: Event | MouseEvent) {
		console.log("qincr", this._quantity);
		this.quantity = (this._quantity += 1);
		this.price = this.calcQuantityToTotalPrice(this._quantity);
	}

	_handlerQuantityReduce(e: Event | MouseEvent) {
		if (this._quantity > 0) {
			this.quantity = (this._quantity -= 1);
			this.price = this.calcQuantityToTotalPrice(this._quantity);
		}
	}

	_handlerQuantityInput(e: Event) {
		const value =  parseInt(this._input_quantity.value);
		if (isNaN(value) || !isFinite(value)) {
			this.price = 0;
		} else {
			this.quantity = this._quantity = value;
			this.price = this.calcQuantityToTotalPrice(value);
		}
	}

	_handlerPriceInput(e: Event) {
		const value =  parseInt(this._input_price.value);
		if (isNaN(value) || !isFinite(value)) {
			this.quantity = 0;
		} else {
			this.price = value;
			this.quantity = this._quantity = this.calcTotalPriceToQuantity(value);
		}
	}
}
