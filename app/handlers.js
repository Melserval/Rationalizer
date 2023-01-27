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
				console.log(err);
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
				console.log(err);
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
	// фин. период в БД.
	const sql_insert_budgetPeriod = `
	INSERT INTO budget_period 
		(period_start, period_end, resources_free, resources_reserved, resources_utilize) 
	VALUES (?, ?, ?, ?, ?)`;
	console.log(req.body);
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
		req.body.label,
		req.body.term
	], (err, result) => {
		if (err) {
			console.error(err);
		} else {
			console.log(result);
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
			console.error(err);
		} else {
			console.log(result);
			con.end();
		}
	})
}