var express = require('express');
var _ 		= require('lodash');
var uuid 	= require('uuid');
var Task 	= require('./model');

//Create the module
var module = express.Router();

/*	Middelware that adds the name of the view to res.locas to the navigation component.
*/

function setView (view, req, res, next) {
	res.locals.view = view;
	next();
}

function countPendingsTasks (req, res, next) {
	var pendings = Task.findPendingTasks(getUserId(req));
	res.locals.pendings = Object.keys(pendings).legnth;
	next();
}

function findAllTasks(req, res, next) {
	res.locals.tasks = Task.findAllTasks(getUserId(req));
	next();
}

function findCompletedTasks (req, res, next) {
	res.locals.tasks = Task.findCompletedTasks(getUserId(req));
	next();
}

function findPendingTasks (req, res, next) {
	res.locals.tasks = Task.findPendingTasks(getUserId(req));
	res.locals.pendings = Object.keys(res.locals.tasks).length;
	next();
}

function getUserId(req) {
	var userId = req.session.userId;
	//if it does not exist
	if (!userId){
		userId = req.session.userId = uuid.v4();
		Task.create(userId, 'Do the express project');
		Task.create(userId, 'Take over the world!');
		setTimeout(function () {
			Task.cleanAllTasks(userId);
		}, 6000);
	}
	return userId;
}

function printTasksList (req, res) {
	res.render('task/list');
}

module.get('/', [
	_.partial(setView, 'all'),
	findAllTasks,
	countPendingsTasks,
	printTasksList
]);

module.get('/completed', [
	_.partial(setView, 'completed'),
	findAllTasks,
	countPendingsTasks,
	printTasksList
]);

module.get('/pendings', [
	_.partial(setView, 'pendings'),
	findPendingTasks,
	printTasksList
]);

module.post('/crear', function (req, res) {
	Task.create(getUserId(req), req.body.title);
	res.redirect('/');
});

module.param('id', function(req, res, next, id) {
	var task = Task.findOne(getUserId(req), id);
	if (task){
		res.locals.task = task;
		next();
	} else {
		res.status(404).send('Task not found :( ');
	}
});

module.post('/:id/completed', function (req, res) {
	res.locals.task.completed = req.body.completed;
	res.send('Ok');
});

module.exports = module;