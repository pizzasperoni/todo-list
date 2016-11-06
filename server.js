var express = require('express');
var pug = require('pug');
var tasks = require('.modules/task/routes');
var bodyParser = require('body-parser');
var sesion = require.('express-session');

var app = express();

app.set('view engine', 'pug');

app.get('/', function (req, res) {
	res.render('index', {title: 'Hey ', message: ' Hello there using node and jade for the view engine!'});
});

app.listen(8000, function () {
  console.log("Esperando requests en el puerto 8000");
});
