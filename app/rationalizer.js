const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8000;
const app = express();
const hbs = handlebars.create({
	defaultLayout: 'main',
	extname: 'hbs'
});

app.disable('x-powered-by');
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// пользовательские маршруты
require('./routes')(app);

// служебные маршруты
app.use(function(req, res) {
	res.status(404);
	res.send(`404 - Not Found - ${req.url}`);
});
app.use(function(err, req, res, next) {
	console.error(err.message);
	res.status(500);
	res.send("500 - Internal Server Error.");
});
app.listen(PORT, console.info.bind(null, `запущен на http://localhost:${PORT}`));
