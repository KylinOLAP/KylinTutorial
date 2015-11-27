var kylinApp = angular.module('kylinApp', ['ngGrid','nvd3ChartDirectives', 'pascalprecht.translate']);

// multi-language support
kylinApp.config(['$translateProvider', function ($translateProvider) {
	$translateProvider.translations('en', {
		'Welcome to Apache Kylin': 'Welcome to Apache Kylin',
		'Extreme OLAP Engine for Big Data': 'Extreme OLAP Engine for Big Data',
		'Quick Tutorial': 'Quick Tutorial',
		'Tables': 'Tables',
		'Interactive': 'Interactive',
		'OLAP on hadoop': 'OLAP on hadoop',
		'Try Me': 'Try Me',
		'executing': 'executing',
		'Response time': 'Response time',
		'Result length': 'Result length',
		'Visualization': 'Visualization',
		'Grid': 'Grid',
		'Graph Type': 'Graph Type',
		'choose': 'choose',
		'Data Model': 'Data Model',
		'Glance over': 'Glance over',
		'Fact Table': 'Fact Table',
		'Lookup Table': 'Lookup Table',
		'Check': 'Check',
		'here': 'here',
		'to learn the related terminology': ' to learn the related terminology',
		'Cube Design': 'Cube Design',
		'Name': 'Name',
		'Table Name': 'Table Name',
		'Type': 'Type',
		'Detail': 'Detail',
		'Expression': 'Expression',
		'Param Type': 'Param Type',
		'Param Value': 'Param Value',
		'Return Type': 'Return Type',
		'Build Workflow': 'Build Workflow',
		'start': 'start',
		'Job Name': 'Job Name',
		'Duration': 'Duration',
		'MapReduce Waiting': 'MapReduce Waiting',
		'step': 'step',
		'Data Size': 'Data Size',
		'end': 'end',
		'Visit kylin.io': 'Visit kylin.io',
		'View Kylin Web': 'View Kylin Web'
	});
 
	$translateProvider.translations('zh', {
		'Welcome to Apache Kylin': '欢迎使用Apache Kylin',
		'Extreme OLAP Engine for Big Data': '支持超大规模数据的OLAP引擎',
		'Quick Tutorial': '快速学习教程',
		'Tables': '表',
		'Interactive': '交互式',
		'OLAP on hadoop': 'OLAP 基于 hadoop',
		'Try Me': '试一试',
		'executing': '运行中',
		'Response time': '响应时间',
		'Result length': '结果数量',
		'Visualization': '视图',
		'Grid': '表格',
		'Graph Type': '图表类型',
		'choose': '请选择',
		'Data Model': '数据模型',
		'Glance over': '浏览',
		'Fact Table': '事实表',
		'Lookup Table': '查找表',
		'Check': '点击',
		'here': '这里',
		'to learn the related terminology': '了解相关专业术语',
		'Cube Design': 'Cube设计',		
		'Name': '名称',
		'Table Name': '表名',
		'Type': '类型',
		'Detail': '详情',
		'Expression': '表达式',
		'Param Type': '参数类型',
		'Param Value': '参数值',
		'Return Type': '返回类型',
		'Build Workflow': '生成工作流',
		'start': '开始',
		'Job Name': 'Job 名',
		'Duration': '持续时间',
		'MapReduce Waiting': 'MapReduce 等待',
		'step': '步骤',
		'Data Size': '数据大小',
		'end': '结束',
		'Visit kylin.io': '访问 kylin.io',
		'View Kylin Web': '访问 Kylin 网页'
	});
 
	$translateProvider.preferredLanguage('en');
}]);

kylinApp.controller('transCtrl', function ($scope, $translate, $http) {
	$scope.lan = 'en';

	$http.get("json/modelterm.json").success(function(response) {
		$scope.dataModel = response.dataModel;
		$scope.factTable = response.factTable;
		$scope.lookupTable = response.lookupTable;
	});

	$http.get("json/dimtype.json").success(function(response) {
		$scope.normal = response.normal;
		$scope.derived = response.derived;
	});

	$http.get("json/steps.json").success(function(response) {
		$scope.pops = response;
	});

	$scope.changeLanguage = function (key) {
		$scope.lan = key;
		$translate.use(key);

		if (key == "en") {
			$http.get("json/modelterm.json").success(function(response) {
				$scope.dataModel = response.dataModel;
				$scope.factTable = response.factTable;
				$scope.lookupTable = response.lookupTable;
			});
			$http.get("json/dimtype.json").success(function(response) {
				$scope.normal = response.normal;
				$scope.derived = response.derived;
			});
			$http.get("json/steps.json").success(function(response) {
				$scope.pops = response;
			});
		} else if (key == "zh") {
			$http.get("json/modelterm_zh.json").success(function(response) {
				$scope.dataModel = response.dataModel;
				$scope.factTable = response.factTable;
				$scope.lookupTable = response.lookupTable;
			});
			$http.get("json/dimtype_zh.json").success(function(response) {
				$scope.normal = response.normal;
				$scope.derived = response.derived;
			});
			$http.get("json/steps_zh.json").success(function(response) {
				$scope.pops = response;
			});
		}
	};
});

kylinApp.controller('gridCtrl', function($scope, $http, $domUtilityService) {
	$scope.myData = [];
	$scope.myCol = [];
	
	$scope.gridOptions = { 
			data: 'myData',
			columnDefs: 'myCol'
		};

	$scope.queryState = false;
	$scope.queryFinish = false;

	$scope.resultGrid = document.getElementById("result-grid");

	$scope.refreshUi = function () {
		$scope.gridOptions.$gridServices.DomUtilityService.RebuildGrid(
			$scope.gridOptions.$gridScope,
			$scope.gridOptions.ngGrid);
	}

	$scope.chartTypes = [
		{name: "Line Chart", value: "line", dimension: {types: ['date'], multiple: false}, metrics: {multiple: false}},
		{
			name: "Bar Chart",
			value: "bar",
			dimension: {types: ['date', 'string'], multiple: false},
			metrics: {multiple: false}
		},
		{
			name: "Pie Chart",
			value: "pie",
			dimension: {types: ['date', 'string'], multiple: false},
			metrics: {multiple: false}
		}
	];

	var Query = {
		createNew: function (sql) {
			var query = {
				originSql: sql,
				sql: sql,
				graph: {
					meta: {
						dimensions: [], //Keys metadata
						metrics: [] //Values metadata
					},
					state: {
						dimensions: [], // User selected dimensions
						metrics: []  // User selected metrics
					},
					type: {}, //Graph type
					show: false
				},
				startTime: new Date()
			};
			return query;
		},

		resetQuery: function (query) {
			query.graph = {
				meta: {
					dimensions: [], //Keys metadata
					metrics: [] //Values metadata
				},
				state: {
					dimensions: [], // User selected dimensions
					metrics: []  // User selected metrics
				},
				type: {}, //Graph type
				show: false
			};
			query.startTime = new Date();
		}
	}
	$scope.curQuery = null;
	$scope.dateTypes = [91, 92, 93];
	$scope.stringTypes = [-1, 1, 12];
	$scope.numberTypes = [-7, -6, -5, 3, 4, 5, 6, 7, 8];

	$scope.buildGraphMetadata = function (query) {
		if (!query.graph.show) {
			return;
		}

		// Build graph metadata
		query.graph.meta.dimensions = [];
		query.graph.meta.metrics = [];
		var datePattern = /_date|_dt/i;
		query.graph.type = $scope.chartTypes[1];
		angular.forEach(query.result.columnMetas, function (meta, index) {
			if (($scope.dateTypes.indexOf(meta.columnType) > -1 || datePattern.test(meta.name))) {
				query.graph.type = $scope.chartTypes[0];
				query.graph.meta.dimensions.push({
					column: meta,
					index: index,
					type: 'date'
				});
				return;
			}
			if ($scope.stringTypes.indexOf(meta.columnType) > -1) {
				query.graph.meta.dimensions.push({
					column: meta,
					index: index,
					type: 'string'
				});
				return;
			}
			if ($scope.numberTypes.indexOf(meta.columnType) > -1) {
				query.graph.meta.metrics.push({
					column: meta,
					index: index
				});
				return;
			}
		});
	}

	$scope.resetGraph = function (query) {
		var dimension = (query.graph.meta.dimensions && query.graph.meta.dimensions.length > 0) ? query.graph.meta.dimensions[0] : null;
		var metrics = (query.graph.meta.metrics && query.graph.meta.metrics.length > 0) ? query.graph.meta.metrics[0] : null;
		query.graph.state = {
			dimensions: dimension,
			metrics: ((query.graph.type.metrics.multiple) ? [metrics] : metrics)
		};
	}

	$scope.mappingToChartype = function (dimension) {
		return $scope.curQuery.graph.type.dimension.types.indexOf(dimension.type) > -1;
	}

	$scope.refreshGraphData = function (query) {
		if (query.graph.show) {
			query.graph.data = $scope.buildGraph(query);
		}
		else {
			query.graph.data = [];
		}
	}

	$scope.buildGraph = function (query) {
		var graphData = null;
		var dimension = query.graph.state.dimensions;

		if (dimension && query.graph.type.dimension.types.indexOf(dimension.type) > -1) {
			var metricsList = [];
			metricsList = metricsList.concat(query.graph.state.metrics);
			angular.forEach(metricsList, function (metrics, index) {
				var aggregatedData = {};
				angular.forEach(query.result.results, function (data, index) {
					aggregatedData[data[dimension.index]] = (!!aggregatedData[data[dimension.index]] ? aggregatedData[data[dimension.index]] : 0)
					+ parseFloat(data[metrics.index].replace(/[^\d\.\-]/g, ""));
				});

				var funtype = capitaliseFirstLetter(query.graph.type.value);
				var newData;
				switch (funtype)
				{
					case "Line": 
						newData = $scope.buildLineGraph(dimension, metrics, aggregatedData);
						break;
					case "Bar":			 
						newData = $scope.buildBarGraph(dimension, metrics, aggregatedData);
						break;
					case "Pie":			 
						newData = $scope.buildPieGraph(dimension, metrics, aggregatedData);
						break;
				}

				//var newData = $scope.buildLineGraph(dimension, metrics, aggregatedData);
				graphData = (!!graphData) ? graphData.concat(newData) : newData;
			});
		}

		return graphData;
	}

	function capitaliseFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	$scope.buildLineGraph = function (dimension, metrics, aggregatedData) {
		var values = [];
		angular.forEach(getSortedKeys(aggregatedData), function (sortedKey, index) {
			values.push([(dimension.type == 'date') ? moment(sortedKey).unix() : sortedKey, aggregatedData[sortedKey]]);
		});

		var newGraph = [
			{
				"key": metrics.column.label,
				"values": values
			}
		];
		$scope.section.style.minHeight="830px";
		return newGraph;
	}

	$scope.buildBarGraph = function (dimension, metrics, aggregatedData) {
		var newGraph = [];
		var empty = [];
		var maxlen = 20;
		var i = 0;
		angular.forEach(getSortedKeys(aggregatedData), function (sortedKey, index) {
			i++;
			newGraph.push({
				key: sortedKey,
				values: [
					[sortedKey, aggregatedData[sortedKey]]
				]
			});
		});
		$scope.section.style.minHeight= "830px";
		if (i > 20) {
			return empty;
		} else {
			return newGraph;
		}
	}

	$scope.buildPieGraph = function (dimension, metrics, aggregatedData) {
		var newGraph = [];
		angular.forEach(getSortedKeys(aggregatedData), function (sortedKey, index) {
			newGraph.push({
				key: sortedKey,
				y: aggregatedData[sortedKey]
			});
		});
		$scope.section.style.minHeight="830px";
		return newGraph;
	}

	function getSortedKeys(results) {
		var sortedKeys = [];
		for (var k in results) {
			if (results.hasOwnProperty(k)) {
				sortedKeys.push(k);
			}
		}
		sortedKeys.sort();

		return sortedKeys;
	}

	$scope.xAxisTickFormatFunction = function () {
		return function (d) {
			return d3.time.format("%Y-%m-%d")(moment.unix(d).toDate());
		}
	};

	$scope.xFunction = function () {
		return function (d) {
			return d.key;
		}
	};

	$scope.yFunction = function () {
		return function (d) {
			return d.y;
		}
	}

	$scope.colorFunction = function() {
		return function(d, i) {
			return '#3caec3'
		};
	}

	$scope.section = document.getElementById("query");


	$scope.submitQuery = function() {
		$scope.queryState = true;
		$scope.queryFinish = false;
		$scope.section.style.minHeight="660px";
		var queryString = document.getElementById("queryarea").value;
		//var _data = {"acceptPartial": "true", "limit": "50000", "offset": "0", "project": "default", "sql": $scope.queryString};
		//var _data = {"acceptPartial": "true", "limit": "50000", "offset": "0", "project": "clsfd_ga_trffc_src", "sql": queryString};
		var _data = {"acceptPartial": "true", "offset": "0", "project": "airline", "sql": queryString};
		
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
			var newQuery = Query.createNew(queryString);
			$scope.curQuery = newQuery;
			$scope.curQuery.result = response;

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
			$scope.queryFinish = true;
			$scope.section.style.height="100vh"
			$scope.section.style.minHeight="800px";
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
	/*$http.get("popup.json").success(function(response) {
		$scope.pops = response.pops;
	});*/

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