var uuid = require('uuid');
var _ = require('lodash');

var tasksByUser = {};

function Task (id, userId, title, completed) {
	this.id = id || uuid.v4();
	this.userId = userId;
	this.title = title;
	this.completed = completed;
}

Task.prototype.delete = function () {
	if (tasksByUser[this.userId]) {
		delete tasksByUser[this.userId][this.id];
	}
};

Task.create = function (userId, title) {
    // Creo una nueva instancia de tarea, el id sera generado automaticamente
    var task = new Task(null, userId, title, false);

    // Lo guardo en mi "base"
    if (!tasksByUser[userId]) {
        tasksByUser[userId] = {};
    }

    tasksByUser[userId][task.id] = task;
    return task;
};

Task.findOne = function (userId, id) {
	if (tasksByUser[userId] && tasksByUser[userId][id]) {
		return tasksByUser[userId][id];
	}
	return null;
};

Task.cleanAllTasks = function (userId) {
	delete tasksByUser[userId];
};

Task.findAllTasks = function (userId) {
	var tasks = tasksByUser[userId] || {};
	return tasks;
};

Task.findPendingTasks = function (userId) {
	return _.filter(Task.findAllTasks(userId), function (task) {
		return !task.completed;
	});
};

Task.findCompletedTasks = function (userId) {
	return _.filter(Task.findAllTasks(userId), function (task) {
		return task.completed;
	});
};

module.exports = Task;