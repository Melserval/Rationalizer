const config = require('./config');
const mysql = require('mysql2');


// страница подбора ассортимента.
exports.main = (req, res) => {
	res.status(200).render('assortiment');
}

// страница о программе.
exports.about = (req, res) => {
	res.status(200).render('about');
}

// --- обработчики API --- \\
 const api = exports.api = { };

//.................... ассортимент ................... \\

// DB: загрузка типов единиц измерения.
api.typeMeasure = (req, res) => {
	const con = mysql.createConnection(config.mysql);
	con.query(
		"SELECT * FROM type_measure", function(err, result, fields) {
			if (err) {
				console.error(err);
			} else {
				res.status(200);
				res.json(result);
				con.end();
			}
		}
	);
};
// DB: загрузка типов (видов) упаковки (распостранения).
api.typePackage = (req, res) => {
	const sql_select_type = `
		SELECT * FROM type_package
	`;
	const con = mysql.createConnection(config.mysql);
	con.query(sql_select_type,
		(err, result, fields) => {
			if (err) {
				console.error(err);
			} else {
				res.status(200);
				res.json(result);
				con.end();
			}
		}
	);
};
// DB: загрузка списка ассортимента.
api.product = (req, res) => {
	const con = mysql.createConnection(config.mysql);
	con.query(
		"SELECT * FROM product", function(err, result, fields) {
			if (err) {
				console.error(err);
			} else {
				res.status(200);
				res.json(result);
				con.end();
			}
		}
	);
};
// DB: запись запись новой единицы ассортимента.
api.addProduct = (req, res) => {
	const sql_insert_new_product = `
	INSERT INTO product 
		(id, title, amount, price, description, package_id, measure_id)
	VALUES (?,?, ?, ?, ?, 
		(SELECT id FROM type_package WHERE type_name=?), 
		(SELECT id FROM type_measure WHERE type_name=?)
	)`;
	const con = mysql.createConnection(config.mysql);

	con.query(sql_insert_new_product, [
			req.body.id,
			req.body.title,
			req.body.amount,
			req.body.price,
			req.body.describe,
			req.body.vendorType,
			req.body.measureType
		],
		function (err, results) {
			if (err) {
				console.error(err);
			} else {
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end(results.insertId.toString());
				con.end();
			}
		}
	);
};

//................. финансовые периоды ................ \\

// DB: запись нового фин. периода.
api.addBudgetPeriod = (req, res) => {
	const sql_insert_budgetPeriod = `
	INSERT INTO budget_period 
		(id, period_start, period_end, resources_deposit, resources_reserved, resources_utilize, exchange)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	`;
	const con = mysql.createConnection(config.mysql);

	con.query(sql_insert_budgetPeriod, [
		req.body.id,
		req.body.start,
		req.body.end,
		req.body.deposit,
		req.body.reserved,
		req.body.utilize,
		req.body.exchange
	], (err, result) => {
		if (err) {
			console.error(err);
		} else {
			res.json(result);
			con.end();
		}
	});
};
// DB: загрузка фин. периода - самый новый.
api.getBudgetPeriodLast = (req, res) => {
	const con = mysql.createConnection(config.mysql);

	con.query("SELECT * FROM budget_period ORDER BY period_start DESC LIMIT 1", 
		(err, result, fields) => {
			if (err) {
				console.error(err);
			} else {
				res.json(result);
				con.end();
			}
		});
};
// DB: загрузка фин периода - по id.
api.getBudgetPeriodById = (req, res) => {
	const con = mysql.createConnection(config.mysql);

	con.query("SELECT * FROM budget_period WHERE id = ?", [
		req.body.periodId
	], (err, result, fields) => {
			if (err) {
				console.error(err);
			} else {
				res.json(result);
				con.end();
			}
	});
};
// DB: запись связи указанного заказа с указанным периодом.
api.associateOrderByPeriod = (req, res) => {
	// HACK: тут нужна ТРАНЗАКЦИЯ для проверки внешних ключей!
	const sql_set_order_by_period = `
	INSERT INTO orders_of_budget (order_id, period_id)
	VALUES (?, ?)
	`;
	const con = mysql.createConnection(config.mysql);

	con.query(sql_set_order_by_period, [
		req.body.orderId, req.body.periodId
	], (err, result) => {
		if (err) {
			console.error(err);
		} else {
			res.json(result);
			con.end();
		}
	});
};
// DB: загрузка связанных с указанным периодом заказов.
api.getOrdersByPeriodId = (req, res) => {
	const con = mysql.createConnection(config.mysql);

	const sql_get_orders_by_period = `
		SELECT 
			orders.id, orders.created, orders.term, orders.label
		FROM 
			order_list AS orders
		JOIN 
			orders_of_budget AS period
		ON 
			orders.id = period.order_id
		WHERE 
			period.period_id = ?
	`;
	con.query(sql_get_orders_by_period, [
		req.body.periodId
	], (err, orders) => {
		if (err) {
			console.error(err);
		} else {
			res.json(orders);
			con.end()
		}
	});
};

//............ закупки: заказазы и их элементы ............\\

// DB: запись нового заказа.
api.addOrder = (req, res) => {	
	const sql_add_order = `
	INSERT INTO order_list (id, created, term, label)
	VALUES (?, ?, ?, ?)
	`;
	const con = mysql.createConnection(config.mysql);

	con.query(sql_add_order, [
		req.body.id,
		req.body.created,
		req.body.term,
		req.body.label
	], (err, result) => {
		if (err) {
			console.error(err);
		} else {
			res.json(result);
			con.end();
		}
	})
};
// DB: получение заказа по id.
api.getOrderById = (req, res) => {
	const sql_get_order = `
		SELECT * FROM order_list WHERE id = ?
	`;
	const con = mysql.createConnection(config.mysql);

	con.query(sql_get_order, [
		req.body.orderId
	], (err, result) => {
		if (err) {
			console.error(err);
		} else {
			res.json(result);
			con.end();
		}
	});
};
// DB: запись единицы покупки.
api.addPurshase = (req, res) => {
	const sql_add_purshase = `
	INSERT INTO purshase (order_id, product_id, quantity)
	VALUES (?, ?, ?)
	`;
	const con = mysql.createConnection(config.mysql);
	
	con.query(sql_add_purshase, [
		req.body.orderId,
		req.body.productId,
		req.body.quantity
	], (err, result) => {
		if (err) {
			console.error("add purshase", err);
		} else {
			con.end();
		}
	})
};
// DB: получение списка покупок в заказе по id заказа.
// если id несколько - вернет несколько наборов покупок.
api.getPurshasesByOrderId = (req, res) => {
	const sql =  Array.isArray(req.body.orderId) ?
	` SELECT * FROM purshase WHERE order_id IN (?) `:
	` SELECT * FROM purshase WHERE order_id = ? `;
	const con = mysql.createConnection(config.mysql);
	con.query(sql,[
		req.body.orderId
	], (err, result) => {
		if (err) {
			console.error(err);
		} else {
			res.json(result);
			con.end();
		}
	});
};
