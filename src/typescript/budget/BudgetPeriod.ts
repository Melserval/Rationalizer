import { DBSet } from '../datastorage';

type BudgetPeriodJson = {
	id: string,
	start: string,
	end: string,
	deposit: number,
	reserved: number,
	utilize: number,
	exchange: number
};

type EventCallback = (item: BudgetPeriod) => void;

export const enum EventBudget {
	// изменение финансовых состояний
	"change"
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

	protected _events = new Map<EventBudget, Array<EventCallback>>([
		[EventBudget.change, []]
	]);

	constructor(
			amount: number, 
			reserved: number, 
			utilize: number, 
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
			this.dispatchEvent(EventBudget.change);
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
			this._budgetDeposit = this._budgetDeposit - value;
			this._budgetReserved += value;
		}
		this.dispatchEvent(EventBudget.change);
	}

	/** Получить общую сумму резерва. */
	getReserve(): number {
		return this._budgetReserved;
	}

	dispatchEvent(eventName: EventBudget): void {
		this._events.get(eventName)?.forEach(clbc => clbc(this));
	}

	on(eventName: EventBudget, callback: EventCallback) {
		this._events.get(eventName)?.push(callback);
	}

	off(eventName: EventBudget, callback: EventCallback) {
		if (!this._events.has(eventName)) return;

		const callbacks = this._events.get(eventName);
		for (let i = callbacks.length - 1; i >= 0; i--) {
			if (callbacks[i] === callback) {
				callbacks.splice(i, 1);
			}
		}
	}

	/** Создает объект из данных из таблиц БД */
	static createFromDBSet(dbData: DBSet): BudgetPeriod {
		try {
			const start: Date = new Date(dbData.period_start);
			const end: Date = new Date(dbData.period_end);
			const id: string = dbData.id;
			const amount: number = parseFloat(dbData.resources_deposit);
			const reserved: number = parseFloat(dbData.resources_reserved);
			const utilize: number = parseFloat(dbData.resources_utilize);
			const rateOfExchange = parseFloat(dbData.exchange);

			if (isNaN(amount) || isNaN(reserved) || isNaN(utilize) || isNaN(rateOfExchange)) {
				throw Error("Недопустимое значение для числа");
			}
			return new BudgetPeriod(amount, reserved, utilize, rateOfExchange, start, end, id);
		} catch (err) {
			console.error("Неудалось создать объект периода из данных БД.", err);
		}
	}
}

export {BudgetPeriod, BudgetPeriodJson};