const { application } = require('express');
const h = require('./handlers');

module.exports = function (app) {
	app.get('/', h.main);
	app.get('/about', h.about);
	app.get('/api/type/measure', h.api.typeMeasure);
	app.get('/api/type/package', h.api.typePackage);
	app.get('/api/data/product', h.api.product);
	app.get('/api/data/get-orders', h.api.orders);
	app.post('/api/data/add-product', h.api.addProduct);
	app.post('/api/data/add-budgetperiod', h.api.addBudgetPeriod);
	app.get('/api/data/get-budgetperiod', h.api.getBudgetPeriod);
	app.post('/api/data/add-orderlist', h.api.addOrderList);
	app.post('/api/data/add-purshase', h.api.addPurshase);
}