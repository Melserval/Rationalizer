const { application } = require('express');
const h = require('./handlers');

module.exports = function (app) {
	app.get('/', h.main);
	app.get('/about', h.about);
	app.get('/api/type/measure', h.api.typeMeasure);
	app.get('/api/type/package', h.api.typePackage);
	app.get('/api/data/product', h.api.product);
	app.post('/api/data/addproduct', h.api.addProduct);
}