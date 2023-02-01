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

// обработчики обращений к API
const api = exports.api = { };

// загрузка типов единиц измерения.
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

// загрузка типов (видов) упаковки (распостранения).
api.typePackage = (req, res) => {
	const con = mysql.createConnection(config.mysql);
	con.query(
		"SELECT * FROM type_package", function(err, result, fields) {
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

// загрузка списка продуктов.
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

// загрузка списка заказов
api.orders = (req, res) => {
	const con = mysql.createConnection(config.mysql);
	let innerQuery = 0;
	let orderList = [];
	con.query(
		"SELECT id, created, quantity, total, term, label FROM order_list",
		(err, orderlistResult, fields) => {
			if (err) {
				console.error(err);
			} else {
				orderlistResult.forEach((item, i) => {
					con.query(
						"SELECT order_id, product_id, quantity, purshase_price FROM purshase WHERE order_id = ?", 
						[item.id],
						(err, purshaseResult, fields) => {
							if (err) {
								console.error(err);
							} else {
								innerQuery++;
								orderList.push({ order: item, items: purshaseResult });
								if (innerQuery == orderlistResult.length) {
									con.end();
									res.json(orderList);
								}
							}
						}
					)
				});
			}
		} 
	);
};

// запись нового продукта в БД.
api.addProduct = (req, res) => {

	const con = mysql.createConnection(config.mysql);
	const sql = `
	INSERT INTO product 
		(id, title, amount, price, description, package_id, measure_id)
	VALUES (?,?, ?, ?, ?, 
		(SELECT id FROM type_package WHERE type_name=?), 
		(SELECT id FROM type_measure WHERE type_name=?)
	)`;

	con.query(sql, [
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

// запись нового финпериода в БД.
api.addBudgetPeriod = (req, res) => {
	const con = mysql.createConnection(config.mysql);

	const sql_insert_budgetPeriod = `
	INSERT INTO budget_period 
		(id, period_start, period_end, resources_deposit, resources_reserved, resources_utilize, exchange)
	VALUES (?, ?, ?, ?, ?, ?, ?)`;

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
				con.end();
			}
		} 
	)
};

api.getBudgetPeriod = (req, res) => {
	const con = mysql.createConnection(config.mysql);

	const sql_select_budgetPeriod = `
		SELECT * FROM budget_period ORDER BY period_start DESC LIMIT 1
	`;
	con.query(sql_select_budgetPeriod, (err, result, fields) => {
		if (err) {
			console.error(err);
		} else {
			res.json(result);
			con.end();
		}
	});
};

// запись нового списка приобритений.
api.addOrderList = (req, res) => {
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
			con.end();
		}
	})
};

// запись покупки .
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
