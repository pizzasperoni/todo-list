var express 	= require('express');
var pug 		= require('pug');
var tasks 		= require('./modules/task/routes');
var bodyParser 	= require('body-parser');
var session 	= require('express-session');

var app = express();

app.use(session({
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 9*60*1000}, // Expires in 9 mins (check the model to see why)
	secret: "shhh it's a secret"
}));



app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
var views = pug.create({
    defaultLayout: 'principal',
});

*/
app.set('view engine', 'pug');

app.get('/', function (req, res) {
	res.render('./layouts/principal');
});


app.use(function (req, res) {
	res.status(404).render('not_found');
});

app.use(function(err, req, res, next) {
	console.log(err);
	res.status(500).render('error');
});



app.listen(8000, function () {
  console.log("Waiting for requests at port 8000");
});
