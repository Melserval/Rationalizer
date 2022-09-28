// Форма коррекции количества и/или цены выбранного
// ассортимента, при добавлении его в список приобритаемого.
// получает данные из объекта - единицы ассортимента, возвращает объект
// с данными, для создания объекта ассортимента - единицы заказа.

type ApplyResult = {
	quantity: string
};

type CancelResult = {
	apply: boolean;
};

export default class RenterFormAddOrderItem {

	private _baseQuantity = 1;
	private _quantity: number;
	private _destination?: HTMLElement;
	private _applyCallback: (arg: ApplyResult) => void;
	private _cancelCallback: (arg: CancelResult) => void;

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
	 * 
	 * @param applyClbc обработчик выполнения формы.
	 * @param canceldClbc обработчик отмены формы.
	 */
	constructor(
		applyClbc: (arg: ApplyResult) => void, 
		canceldClbc: (arg: CancelResult) => void
	) {
		this._quantity = this._baseQuantity;

		this._applyCallback = applyClbc;
		this._cancelCallback = canceldClbc;

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

		// секция кнопок увеличить, уменьшить количество.
		const div_btn_quantity_control_set = document.createElement("div");
		div_btn_quantity_control_set.setAttribute("class", "btn-set quantity-controll");
		div_btn_quantity_control_set.append(
			this._btn_increase,
			this._btn_reduce
		);
		
		// секция кнопок сброс, отмена, ок
		const div_btn_set = document.createElement("div");
		div_btn_set.setAttribute("class", "btn-set");
		div_btn_set.append(
			div_wrapper_btn_reset, 
			div_wrapper_btn_cancel, 
			div_wrapper_btn_apply
		);

		this._nodeElement.append(this._p_title, div_btn_quantity_control_set, div_input_set, div_btn_set);
		
		// Обработчики
		this._nodeElement.addEventListener("submit", this._handlerFormSubmit.bind(this));
		this._nodeElement.addEventListener("reset", this._handleFormReset.bind(this));
		this._btn_cancel.addEventListener("click", this._handleFormCancel.bind(this));

		this._btn_increase.addEventListener("click", this._handlerQuantityIncrease.bind(this));
		this._btn_reduce.addEventListener("click", this._handlerQuantityReduce.bind(this));

		// Начальная установка полей формы
		this.quantity = this._baseQuantity;
	}

	set quantity(value: number) {
		this._input_quantity.setAttribute("value", value.toString());
	}
	set price(value: number) {
		this._input_price.setAttribute("value", value.toString());
	}
	set title(value: string) {
		this._p_title.textContent = value;
	}

	render(destination: HTMLElement) {
		this._destination = destination;
		this._destination.append(this._nodeElement);
	}

	// обработчики событий формы
	_handlerFormSubmit(e: SubmitEvent) {
		e.preventDefault();
		this._applyCallback({quantity: this._input_quantity.value});
		this._nodeElement.remove();
	}

	_handleFormCancel(e: MouseEvent) {
		this._cancelCallback({
			apply: false
		});
		this._nodeElement.remove();
	}

	_handleFormReset(e: Event) {
		this.quantity = this._quantity = this._baseQuantity;
		console.log("Form Reset");
	}

	_handlerQuantityIncrease(e: Event | MouseEvent) {
		this.quantity = (this._quantity += 1);
	}

	_handlerQuantityReduce(e: Event | MouseEvent) {
		if (this._quantity > 0) {
			this.quantity = (this._quantity -= 1);
		}
	}
}
