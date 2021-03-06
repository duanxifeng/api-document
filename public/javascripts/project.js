/*global angular, _*/
(function(window, angular) {
	'use strict';
	angular.module('projectsApp', [])
	.config(['$interpolateProvider', function($interpolateProvider) {
	  $interpolateProvider.startSymbol('//');
	  $interpolateProvider.endSymbol('//');
	}])
	.controller('mainCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout){
		$http.get('/project').success(function(resp){
			$scope.projects = resp;
			$scope.edit = function(_id, name){
				$scope.pro = _id?{_id: _id, name: name}:{};
				$timeout(function(){
					document.getElementById('projectName').focus();
				},0);
			};
			$scope.save = function(){
				if($scope.pro._id){
					$http.put('/project/'+$scope.pro._id, $scope.pro).success(function(resp){
						if(resp){
							_.each($scope.projects, function(item){
								if(item._id===$scope.pro._id){
									item.name = $scope.pro.name;
									return false;
								}
							});
							$scope.pro = null;
						} else {
							$scope.hint('新增项目失败!\n'+resp);
						}
					});
				} else {
					$http.post('/project', $scope.pro).success(function(resp){
						if(resp){
							$scope.projects = $scope.projects||[];
							$scope.projects.push(resp);
							$scope.pro = null;
						} else {
							$scope.hint('新增项目失败!\n'+resp);
						}
					});
				}
			};
			$scope.cancel = function(){
				$scope.pro = null;
			};
			$scope.remove = function(_id){
				//delete为关键字，避免在IE下报错
				$http['delete']('/project/'+_id).success(function(resp){
					if(resp){
						for(var i=$scope.projects.length-1;i>=0;i--){
							if(_id===$scope.projects[i]._id) {
								$scope.projects.splice(i, 1);
								break;
							}
						}
					} else {
						$scope.hint('删除失败');
					}
				});
			};
			$scope.keydown = function($event){
				if(13===$event.keyCode) $scope.save();
			};
			$scope.hint = function(text){
				$scope.message = text;
				$timeout(function(){
					$scope.message = '';
				}, 5000);
			};
		});
	}]);
	angular.bootstrap(document, ['projectsApp']);
})(window, angular);