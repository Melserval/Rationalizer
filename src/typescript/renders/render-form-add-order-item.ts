

export default class RenterFormAddOrderItem {

	_destination: HTMLElement;
	_applyCallback: CallableFunction;
	_cancelCallback: CallableFunction;

	_nodeElement    = document.createElement("form");
	_p_title        = document.createElement("p");
	_input_quantity = document.createElement("input");
	_input_price    = document.createElement("input");
	_btn_reset      = document.createElement("button");
	_btn_apply      = document.createElement("button");
	_btn_cancel     = document.createElement("button");

	constructor() {
		this._nodeElement.setAttribute("class", "form-add-article-to-order");
		const div_input_set = document.createElement("div");
		div_input_set.setAttribute("class", "input-set");
			const div_input_row1 = document.createElement("div");
		 		const label_price = document.createElement("label");
				label_price.textContent = "сумма";
		 	div_input_row1.append(label_price, this._input_price);

			const div_input_row2 = document.createElement("div");
		 		const label_quantity = document.createElement("label");
				label_quantity.textContent = "количество";
		 	div_input_row2.append(label_quantity, this._input_quantity);
		div_input_set.append(div_input_row1, div_input_row2);

		const div_btn_row1 = document.createElement("div");
		div_btn_row1.setAttribute("class", "btn-set");
		const div_btn_apply_wrapper = document.createElement("div");
			div_btn_apply_wrapper.append(this._btn_apply)
			this._btn_apply.setAttribute("type", "submit");
			this._btn_apply.textContent = "Готово";
			
		const div_btn_reset_wrapper = document.createElement("div");
			div_btn_reset_wrapper.append(this._btn_reset);
			this._btn_reset.setAttribute("type", "reset");
			this._btn_reset.textContent = "Сброс";
		const div_btn_cancel_wrapper = document.createElement("div");
			div_btn_cancel_wrapper.append(this._btn_cancel);
			this._btn_cancel.setAttribute("type", "button");
			this._btn_cancel.textContent = "Отмена";
		div_btn_row1.append(div_btn_cancel_wrapper, div_btn_reset_wrapper, div_btn_apply_wrapper);

		this._nodeElement.append(this._p_title, div_input_set, div_btn_row1);
		// Обработчики
		this._nodeElement.addEventListener("submit", this._handlerFormSubmit.bind(this));
		this._nodeElement.addEventListener("reset", this._handleFormReset.bind(this));
		this._btn_cancel.addEventListener("click", this._handleFormCancel.bind(this));
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

	// TODO: добавить установку координат места появления.
	position(x: number = 0, y: number = 0) {
		
	}

	render(destination: HTMLElement) {
		this._destination = destination;
		this._destination.append(this._nodeElement);
	}

	_handlerFormSubmit(e) {
		e.preventDefault();
		this._applyCallback({
			apply: true,
			price: this._input_price.value, 
			amount: this._input_quantity.value
		});
		this._nodeElement.remove();
	}

	_handleFormCancel(e) {
		this._cancelCallback({
			apply: false
		});
		this._nodeElement.remove();
	}

	_handleFormReset(e) {
		console.log("Form Reset");
	}

	load(title: string, quantity: number, sum: number) {
		this.quantity = quantity;
		this.price = sum;
		this.title = title;
	}

	apply(clbc: CallableFunction) {
		this._applyCallback = clbc;
	}

	cancel(clbc: CallableFunction) {
		this._cancelCallback = clbc;
	}

}
