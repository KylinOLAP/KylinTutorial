var kylinApp = angular.module('kylinApp', ['ngGrid']);
kylinApp.controller('gridCtrl', function($scope, $http, $domUtilityService) {
	$scope.myData = [];
	$scope.myCol = [];
	
	$scope.gridOptions = { 
			data: 'myData',
			columnDefs: 'myCol'
		};

	$scope.queryState = false;

	$scope.resultGrid = document.getElementById("result-grid");

	$scope.refreshUi = function () {
		$scope.gridOptions.$gridServices.DomUtilityService.RebuildGrid(
			$scope.gridOptions.$gridScope,
			$scope.gridOptions.ngGrid);
	}

	$scope.section = document.getElementById("query");


	$scope.submitQuery = function() {
		$scope.resultGrid.style.display="none";
		$scope.queryState = true;
		
		var queryString = document.getElementById("queryarea").value;
		//var _data = {"acceptPartial": "true", "limit": "50000", "offset": "0", "project": "default", "sql": $scope.queryString};
		//var _data = {"acceptPartial": "true", "limit": "50000", "offset": "0", "project": "clsfd_ga_trffc_src", "sql": queryString};
		var _data = {"acceptPartial": "true", "limit": "50000", "offset": "0", "project": "airline", "sql": queryString};
		
		var req = {
			method: 'POST',
			//url: 'http://kylin-stream.corp.ebay.com/kylin/api/query',
			//url: 'http://kylin-qa.corp.ebay.com/kylin/api/query',
			//url: 'http://10.9.145.178:7070/kylin/api/query',
			//url: 'http://10.249.65.55:7070/kylin/api/query',
			url: 'http://66.211.189.71/kylin/api/query',
			data: JSON.stringify(_data),
			//headers: {'Authorization': "Basic bHVuY2hlbjpDaGx3MDExNA==", 'Content-Type': 'application/json;charset=utf-8'}
			headers: {'Authorization': "Basic QURNSU46S1lMSU4=", 'Content-Type': 'application/json;charset=utf-8'}
		}

		$http(req).success(
			function(response){
			$scope.restime = response.duration;
			var data = [];
			angular.forEach(response.results, function (row, index) {
				var oneRow = {};
				angular.forEach(response.columnMetas, function (meta, metaIndex) {
					oneRow[meta.name] = row[metaIndex];
				});
				data.push(oneRow);
			});

			var columnDefs = [];
			angular.forEach(response.columnMetas, function (meta, metaIndex) {
				columnDefs.push({field: meta.name, width: 120});
			});
			$scope.myData = data;
			$scope.myCol = columnDefs;
			//$scope.refreshUi();
			$scope.queryState = false;
			$scope.section.style.height="100vh"
			$scope.resultGrid.style.display="block";

		}).error(function(data, status) {
			//alert(status);
			alert(data.exception);
			$scope.queryState = false;
			//console.error('Repos error', status, data);
		});
	}
});

kylinApp.controller('tableCtrl', function($scope, $http) {
	var req = {
		method: 'GET',
		url: 'http://66.211.189.71/kylin/api/tables_and_columns?project=airline',
		headers: {'Authorization': "Basic QURNSU46S1lMSU4=", 'Content-Type': 'application/json;charset=utf-8'}
	}
	$http(req).success(
		function(response) {
			$scope.tables = response;
			//alert("success");
		}).error(function(data, status) {
			alert(data.exception);
		}
	);

	$scope.trimType = function (typeName) {
	  if (typeName.match(/VARCHAR/i)) {
		typeName = "VARCHAR";
	  } else if (typeName.match(/DECIMAL/i)) {
		typeName = "DECIMAL";
	  }
	  return typeName.trim().toLowerCase();
	}
});

kylinApp.controller('cubeCtrl', function($scope, $http) {
	var req = {
		method: 'GET',
		url: 'http://66.211.189.71/kylin/api/cube_desc/kylin_airline_sample',
		headers: {'Authorization': "Basic QURNSU46S1lMSU4=", 'Content-Type': 'application/json;charset=utf-8'}
	}
	$http(req).success(
		function(response) {
			$scope.cubes = response;
			//alert("success");
		}).error(function(data, status) {
			alert(data.exception);
		}
	);

	$scope.getDimType = function (dim) {
		var types = [];

		if (dim.derived && dim.derived.length) {
			types.push('derived');
		}
		if (dim.hierarchy && dim.column.length) {
			types.push('hierarchy');
		}
		if (!types.length) {
			types.push('normal');
		}
		return types;
	};
});

kylinApp.controller('stepCtrl', function($scope, $http) {
	$http.get("popup.json").success(function(response) {
		$scope.pops = response.pops;
	});

	var req = {
		method: 'GET',
		url: 'http://66.211.189.71/kylin/api/jobs?projectName=airline',
		//url: 'http://10.249.65.55:7070/kylin/api/jobs?projectName=airline',
		headers: {'Authorization': "Basic QURNSU46S1lMSU4=", 'Content-Type': 'application/json;charset=utf-8'}
	}
	$http(req).success(
		function(response) {
			$scope.steps = response[0].steps;
			$scope.num = $scope.steps.length;
			for (var i = 0; i < $scope.num; i++) {
				$scope.steps[i].order = i;
			}
			$scope.rownum = Math.ceil(($scope.num + 1) / 5);
			$scope.vacantnum = 0;
			if(5 * $scope.rownum - 2 >= $scope.num) {
				$scope.vacantnum = 5 * $scope.rownum - 2 - $scope.num;
			}
			$scope.jobName = response[0].related_cube;
			$scope.duration = response[0].duration;
			$scope.mrWaiting = response[0].mr_waiting;
		}).error(function(data, status) {
			alert(data.exception);
		}
	);

	$scope.dataSize = function (data) {
		var size;
		if (data / 1024 / 1024 / 1024 / 1024 >= 1) {
			size = (data / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB';
		} else if (data / 1024 / 1024 / 1024 >= 1) {
			size = (data / 1024 / 1024 / 1024).toFixed(2) + ' GB';
		} else if (data / 1024 / 1024 >= 1) {
			size = (data / 1024 / 1024).toFixed(2) + ' MB';
		} else {
			size = (data / 1024).toFixed(2) + ' KB';
		}
		return size;
	};

	$scope.wowdelay = function (input) {
		var time;
		time = 0.2 + input * 0.2;
		return time;
	};

	$scope.showPop = false;

	$scope.hoverIn = function () {
		this.showPop = true;
	}

	$scope.hoverOut = function() {
		this.showPop = false;
	};
});