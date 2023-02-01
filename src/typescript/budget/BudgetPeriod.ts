
type BudgetPeriodJson = {
	id: string,
	start: string,
	end: string,
	deposit: number,
	reserved: number,
	utilize: number,
	exchange: number
};


// бюджетный период
class BudgetPeriod {
	private _startPeriod: Date;
	private _endPeriod: Date;
	private _budgetDeposit: number;
	private _budgetReserved: number;
	private _budgetUtilize: number;
	private _exchangeRate: number;

	public readonly id: string;

	constructor(
			amount: number=0, 
			reserved: number=0, 
			utilize: number=0, 
			rateOfExchange: number=1, 
			start: Date=new Date(), 
			end?: Date, 
			id?: string
	) {
		this.id = id || Date.now().toString(36);
		this._startPeriod = start;
		this._endPeriod = end || (end = new Date(), end.setMonth(start.getMonth() + 1), end);
		this._budgetDeposit = amount;
		this._budgetReserved = reserved;
		this._budgetUtilize = utilize;
		this._exchangeRate = rateOfExchange;
	}

	toJSON(): BudgetPeriodJson {
		const sp = this._startPeriod;
		const ep = this._endPeriod;
		return {
			id: this.id,
			start: `${sp.getFullYear()}-${sp.getMonth()+1}-${sp.getDate()}`,
			end: `${ep.getFullYear()}-${ep.getMonth()+1}-${ep.getDate()}`,
			deposit: this.getAmount(),
			reserved: this.getReserve(),
			utilize: this.getUtilize(),
			exchange: this._exchangeRate
		};
	}
	
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
		return this._budgetDeposit;
	}

	/** Добавить сумму в резерв. */
	addReserve(value: number) {
		if (value <= this._budgetDeposit) {
			this._budgetDeposit -= value;
			this._budgetReserved += value;
		} else {
			// NOTE: Реализовать выдачу предупреждений о перерасходе.
			this._budgetReserved += value;
			this._budgetDeposit = this._budgetDeposit - value;
		}
	}

	/** Получить общую сумму резерва. */
	getReserve(): number {
		return this._budgetReserved;
	}

}

export {BudgetPeriod, BudgetPeriodJson};