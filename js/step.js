var stepApp = angular.module('stepApp', []);
stepApp.controller('stepCtrl', function($scope, $http) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});

stepApp.controller('gridCtrl', function($scope, $http, $domUtilityService) {
	$scope.myData = [];
	$scope.myCol = [];

    $scope.members = [{name: "Moroni", age: 50},
                      {name: "Tiancum", age: 43},
                      {name: "Jacob", age: 27},
                      {name: "Nephi", age: 29},
                      {name: "Enos", age: 34}];

    $scope.mem = [{name2: "Moroni", age2: 50},
                  {name2: "Enos", age2: 34}];
    
    $scope.gridOptions = { 
    		data: 'myData',
    		columnDefs: 'myCol'
    	};

    $scope.show = function() {
    	alert("qq");
    	$scope.resultGrid.style.display="block";
    	$scope.myData = $scope.members;
    	alert("ff");
    }

    $scope.show2 = function() {
    	alert("qq");
    	$scope.resultGrid.style.display="block";
    	$scope.myData = $scope.mem;
    	alert("ff");
    }

    $scope.ss="sds";

    $scope.change = function() {
    	//alert("qq");
    	$scope.ss = "ddd";
    	//alert("ff");
    }

    $scope.queryState = false;

    $scope.resultGrid = document.getElementById("result-grid");
    //$scope.queryString = document.getElementById("queryarea").value;

    $scope.refreshUi = function () {
    	$scope.gridOptions.$gridServices.DomUtilityService.RebuildGrid(
    		$scope.gridOptions.$gridScope,
    		$scope.gridOptions.ngGrid);
      //$scope.ui.fullScreen = !$scope.ui.fullScreen;
      /*$timeout(function () {
        if ($scope.gridOptions) {
          $domUtilityService.RebuildGrid($scope.gridOptions.$gridScope, $scope.gridOptions.ngGrid);
        }
      });*/
    }


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
            url: 'http://10.9.145.178:7070/kylin/api/query',
			data: JSON.stringify(_data),
			//headers: {'Authorization': "Basic bHVuY2hlbjpDaGx3MDExNA==", 'Content-Type': 'application/json;charset=utf-8'}
            headers: {'Authorization': "Basic QURNSU46S1lMSU4=", 'Content-Type': 'application/json;charset=utf-8'}
		}


		$http(req).success(
			function(response){
    		//alert("succ");
    		//alert(response);
    		//$scope.myData = $scope.members;
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
			//$scope.resultGrid.style.height="300px";
			$scope.myData = data;
			$scope.myCol = columnDefs;
			//$scope.refreshUi();
			$scope.queryState = false;
			$scope.resultGrid.style.display="block";
    	}).error(function(data, status) {
    		//alert(status);
    		alert(data.exception);
    		//console.error('Repos error', status, data);
    	});

		/*$http.get("http://www.w3schools.com/angular/customers.php")
		.success(function (response) {
			alert(response);
			$scope.myData = $scope.members;
		});*/
    	
    	/*$.ajaxSetup({
    		headers: { 'Authorization': "Basic bHVuY2hlbjpDaGx3MDExNA==", 'Content-Type': 'application/json;charset=utf-8' } // use your own authorization code here
    	});
    	var _data = {"acceptPartial": "true", "limit": "50000", "offset": "0", "project": "default", "sql": "select minute_start, sum(vict) as vicount from seo_sessions_fact_nous group by minute_start order by minute_start desc"};
		$scope.request = $.ajax({
    		url: "http://kylin-stream.corp.ebay.com/kylin/api/query",
    		type: "POST",
    		data:JSON.stringify(_data)
		});
		$scope.request.done(function( msg ) {
			$scope.myData = $scope.members;
			
			//grid.style.height="400px";

			var data = [];
			angular.forEach(msg.results, function (row, index) {
				var oneRow = {};
				angular.forEach(msg.columnMetas, function (meta, metaIndex) {
					oneRow[meta.name] = row[metaIndex];
				});
				data.push(oneRow);
			});

			var columnDefs = [];
			angular.forEach(msg.columnMetas, function (meta, metaIndex) {
				columnDefs.push({field: meta.name, width: 120});
			});
			//$scope.show();

			
		});
		$scope.request.fail(function( jqXHR, textStatus ) {
    		alert( "Request failed: " + textStatus );
		});*/
    }
});