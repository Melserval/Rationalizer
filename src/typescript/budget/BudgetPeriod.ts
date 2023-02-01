
type BudgetPeriodJson = {
	id: string,
	start: string,
	end: string,
	amount: number,
	reserved: number,
	utilize: number
};


// бюджетный период
class BudgetPeriod {
	private _startPeriod: Date;
	private _endPeriod: Date;
	private _budgetAmout: number;
	private _budgetReserved: number;
	private _budgetUtilize: number;

	public readonly id: string;

	constructor(start: Date, amount: number=0, reserved: number=0, utilize: number=0, id?: string, end?: Date) {
		this.id = id || Date.now().toString(36);
		this._startPeriod = start;
		this._endPeriod = end || (end = new Date(), end.setMonth(start.getMonth() + 1), end);
		this._budgetAmout = amount;
		this._budgetReserved = reserved;
		this._budgetUtilize = utilize;
	}

	toJSON(): BudgetPeriodJson {
		const sp = this._startPeriod;
		const ep = this._endPeriod;
		return {
			id: this.id,
			start: `${sp.getFullYear()}-${sp.getMonth()+1}-${sp.getDate()}`,
			end: `${ep.getFullYear()}-${ep.getMonth()+1}-${ep.getDate()}`,
			amount: this.getAmount(),
			reserved: this.getReserve(),
			utilize: this.getUtilize()
		};
	}

	static fromJSON(item: BudgetPeriodJson): BudgetPeriod {
		const end = item.end ? new Date(item.end): undefined; 
		return new this( new Date(item.start), item.amount, item.reserved, item.utilize, item.id, end);
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

export {BudgetPeriod, BudgetPeriodJson};