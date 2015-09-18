function submitQuery() {
	$.ajaxSetup({
		headers: { 'Authorization': "Basic bHVuY2hlbjpDaGx3MDExNA==", 'Content-Type': 'application/json;charset=utf-8' } // use your own authorization code here
	});

	var _data = {"acceptPartial": "true", "limit": "50000", "offset": "0", "project": "default", "sql": "select minute_start, sum(vict) as vicount from seo_sessions_fact_nous group by minute_start order by minute_start desc"};
	var request = $.ajax({
		url: "http://kylin-stream.corp.ebay.com/kylin/api/query",
		type: "POST",
		data:JSON.stringify(_data)
	});
	request.done(function( msg ) {
		var tablediv = document.getElementById("result-table-div");
		//alert(tablediv.class);
		var table = document.getElementById("result-table");
		table.style.display="block";
		table.style.height="400px";
		var rownum = msg.results[0].length;
		for(var i=0;i<msg.results.length;i++) {
			var tr = table.insertRow(0);//添加一行
			for(var j=0;j<rownum;j++) {
				var td = tr.insertCell(0);//添加一列 
				td.innerHTML = msg.results[i][j];//为单元格写入文本内容 
			}
		} 
	});
	request.fail(function( jqXHR, textStatus ) {
		alert( "Request failed: " + textStatus );
	});
}