var devCampApp = angular.module('DevCampApp', []);
devCampApp.controller('DevCampCtrl', function ($scope, $filter, $location, devCampStorage) {
	var todos = $scope.todos = devCampStorage.get();
	$scope.userInput = null;
	$scope.completedCount = $filter('filter')(todos, {
		completed: false
	}).length;

	if ($location.path() === '') {
		$location.path('/');
	}

	$scope.location = $location;

	$scope.$watch('location.path()', function (path) {
		$scope.statusFilter = {
			'/active': {
				completed: true
			},
			'/completed': {
				completed: false
			}
		}[path];
	});

	$scope.$watch('remainingCount == 0', function (val) {
		$scope.allChecked = val;
	});
	/**
	 * Add a new TODO to the list with user input from userInput in scope
	 * @returns {void}
	 */
	$scope.addTodo = function () {

		var newTodo = $scope.userInput.trim();
		if (newTodo.length === 0) {
			return;
		}

		$scope.todos.push({
			'completed': true,
			'message': $scope.userInput
		});
		devCampStorage.put(todos);
		$scope.userInput = '';

	};


	/**
	 * Remove definitly a todo from the list
	 * @param {Todo} todo
	 * @returns {void}
	 */
	$scope.removeTodo = function (todo) {

		todos.splice(todos.indexOf(todo), 1);
		devCampStorage.put(todos);

	};

	/**
	 * Remove definitly a todo from the list
	 * @param {Todo} todo
	 * @returns {void}
	 */
	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
		// Clone the original todo to restore it on demand.
		$scope.originalTodo = angular.extend({}, todo);
	};
	$scope.doneEditing = function (todo) {
		$scope.editedTodo = null;
		todo.message = todo.message.trim();

		if (!todo.message) {
			$scope.removeTodo(todo);
		}

		devCampStorage.put(todos);
	};

	$scope.revertEditing = function (todo) {
		todos[todos.indexOf(todo)] = $scope.originalTodo;
		$scope.doneEditing($scope.originalTodo);
	};

	$scope.todoCompleted = function (todo) {

		$scope.completedCount = $filter('filter')(todos, {
			completed: false
		}).length;
		devCampStorage.put(todos);
	};

	$scope.toggleTodoChecked = function () {

		todos.forEach(function (todo) {
			todo.completed = $scope.allTodoChecked;
		});


		$scope.completedCount = $filter('filter')(todos, {
			completed: false
		}).length;
		devCampStorage.put(todos);

	};
	$scope.clearCompleted = function () {
		$scope.todos = todos = todos.filter(function (val) {
			return val.completed;
		});

		$scope.completedCount = $filter('filter')(todos, {
			completed: false
		}).length;
		devCampStorage.put(todos);
	};
});

devCampApp.factory('devCampStorage', function () {
	var STORAGE_ID = 'devCampApp-angularjs-perf';

	return {
		get: function () {
			return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
		},

		put: function (todos) {
			localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
		}
	};
});

devCampApp.directive('todoEscape', function () {
	var ESCAPE_KEY = 27;
	return function (scope, elem, attrs) {
		elem.bind('keydown', function (event) {
			if (event.keyCode === ESCAPE_KEY) {
				scope.$apply(attrs.todoEscape);
			}
		});
	};
});

devCampApp.directive('todoFocus', function ($timeout) {
	return function (scope, elem, attrs) {
		scope.$watch(attrs.todoFocus, function (newVal) {
			if (newVal) {
				$timeout(function () {
					elem[0].focus();
				}, 0, false);
			}
		});
	};
});
