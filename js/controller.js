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
            url: 'http://10.249.65.55:7070/kylin/api/query',
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

kylinApp.controller('stepCtrl', function($scope, $http) {
    $http.get("step.json").success(function(response) {$scope.steps = response.steps;});
});