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

api.typeMeasure = (req, res) => {
	mysql.createConnection(config.mysql).query(
		"SELECT * FROM type_measure", function(err, result, fields) {
			if (err) {
				console.log(err);
			} else {
				res.status(200);
				res.json(result);
			}
		}
	);
};

api.typePackage = (req, res) => {
	mysql.createConnection(config.mysql).query(
		"SELECT * FROM type_package", function(err, result, fields) {
			if (err) {
				console.log(err);
			} else {
				res.status(200);
				res.json(result);
			}
		}
	);
};

api.product = (req, res) => {
	mysql.createConnection(config.mysql).query(
		"SELECT * FROM product", function(err, result, fields) {
			if (err) {
				console.error(err);
			} else {
				res.status(200);
				res.json(result);
			}
		}
	);
};

api.addProduct = (req, res) => {
	const sql = `
	INSERT INTO product 
		(title, amount, price, description, package_id, measure_id)
	VALUES (?, ?, ?, ?, 
					(SELECT id FROM type_package WHERE type_name=?), 
					(SELECT id FROM type_measure WHERE type_name=?)
				 )`;

	mysql.createConnection(config.mysql).query(sql, [
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
			}
		}
	);
};