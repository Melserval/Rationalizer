
// бюджетный период
class BudgetPeriod {
	private _startPeriod: Date;
	private _endPeriod: Date;
	private _budgetAmout: number;
	private _budgetReserved: number;
	private _budgetUtilize: number;

	public readonly id: number;

	constructor(amount: number, start: Date, end?: Date) {
		this.id = Date.now();
		this._budgetAmout = amount;
		this._startPeriod = start;
		this._endPeriod = end || (end = new Date(), end.setMonth(start.getMonth() + 1), end);
		this._budgetReserved = 0;
		this._budgetUtilize = 0;
	}

	// HACK: тестовый аксессор.
	
	/** Списать указанную сумму из резерва или доступных средств. */
	addUtilize(value: number) {
		if (value <= this._budgetReserved) {
			this._budgetReserved -= value;
		} else {
			// NOTE: Реализовать выдачу предупреждений о перерасходе.
			confirm("Невозможно списать больше чем есть!");
		}
	}

	/** Получить сумму израсходованных средств. */
	getUtilize(): number {
		return this._budgetUtilize;
	}

	/** Получить сумму доступных средств. */
	getAmount(): number {
		return this._budgetAmout;
	}

	/** Добавить сумму в резерв. */
	addReserve(value: number) {
		if (value <= this._budgetAmout) {
			this._budgetAmout -= value;
			this._budgetReserved += value;
		} else {
			// NOTE: Реализовать выдачу предупреждений о перерасходе.
			this._budgetReserved += value;
			this._budgetAmout = this._budgetAmout - value;
		}
	}

	/** Получить общую сумму резерва. */
	getReserve(): number {
		return this._budgetReserved;
	}

}

export {BudgetPeriod};