const { application } = require('express');
const h = require('./handlers');

module.exports = function (app) {
	// страницы
	app.get('/', h.main);
	app.get('/about', h.about);
	// данные типов
	app.get('/api/type/measure', h.api.typeMeasure);
	app.get('/api/type/package', h.api.typePackage);
	// ассортимент
	app.get('/api/data/product', h.api.product);
	app.post('/api/data/add-product', h.api.addProduct);
	// заказы-покупки
	app.post('/api/data/add-order', h.api.addOrder);
	app.post('/api/data/get-order', h.api.getOrderById);
	app.post('/api/data/add-purshase', h.api.addPurshase);
	app.post('/api/data/get-purshases', h.api.getPurshasesByOrderId);
	// фин-периоды
	app.post('/api/data/add-budget-period', h.api.addBudgetPeriod);
	app.post('/api/data/get-budget-period-last', h.api.getBudgetPeriodLast);
	app.post('/api/data/get-budget-period', h.api.getBudgetPeriodById);
	app.post('/api/data/add-order-period', h.api.associateOrderByPeriod);
	app.post('/api/data/get-orders-by-period', h.api.getOrdersByPeriodId);
}
