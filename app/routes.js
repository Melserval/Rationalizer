const h = require('./handlers');

module.exports = function (app) {
	app.get('/', h.main)
	app.get('/about', h.about)
}