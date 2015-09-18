var margin = {top: 0, right: 0, bottom: 0, left: 230},
		width = 800 - margin.right - margin.left,
		height = 400 - margin.top - margin.bottom;

var i = 0,
		duration = 750,
		root;

var tree = d3.layout.tree()
		.size([height, width]);

var diagonal = d3.svg.diagonal()
		.projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("#tree-container").append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("airline.json", function(error, airline) {
	if (error) throw error;

	root = airline;
	root.x0 = height / 2;
	root.y0 = 0;

	function collapse(d) {
		if (d.children) {
			d._children = d.children;
			d._children.forEach(collapse);
			d.children = null;
		}
	}

	root.children.forEach(collapse);
	update(root);
});

d3.select(self.frameElement).style("height", "800px");

function update(source) {

	// Compute the new tree layout.
	var nodes = tree.nodes(root).reverse(),
			links = tree.links(nodes);

	// Normalize for fixed-depth.
	nodes.forEach(function(d) { d.y = d.depth * 180; });

	// Update the nodes…
	var node = svg.selectAll("g.node")
			.data(nodes, function(d) { return d.id || (d.id = ++i); });

	// Enter any new nodes at the parent's previous position.
	var nodeEnter = node.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
			.on("click", click);

	nodeEnter.append("circle")
			.attr("r", 1e-6)
			.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	nodeEnter.append("text")
			.attr("x", function(d) { return d.children || d._children ? -10 : 10; })
			.attr("dy", ".35em")
			.attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
			.text(function(d) {
				d.table = d3.select("body").append("table")
					.style("background-color", "#F7F7F7")
					.style("position", "absolute")
					.style("z-index", "10")
					.style("font-size", "14px")
					.style("color", "#3caec3")
					.style("fill-opacity","0.5")
					.style("display", "none");

					var tbody = d.table.append("tbody");
					var tr = tbody.append("tr")
						.style("border-top", "1px solid #3caec3")
						.style("border-collapse", "collapse");

					tr.append("td")
						.style("height","25px")
						.style("line-height","25px")
						.style("padding", "0px 20px 0px 20px")
						.style("font-weight", "bold")
						.html("COLUMN NAME");

					tr.append("td")
						.style("height","25px")
						.style("line-height","25px")
						.style("padding", "0px 20px 0px 20px")
						.style("font-weight", "bold")
						.html("TYPE");


					d.col.forEach(function(d) {
						var tr = tbody.append("tr")
							.style("border-top", "1px solid #3caec3")
							.style("border-collapse", "collapse");
						tr.append("td")
						.style("height","25px")
						.style("line-height","25px")
						.style("padding", "0px 20px 0px 20px")
						.html(d.colname)

						tr.append("td")
						.style("height","25px")
						.style("line-height","25px")
						.style("padding", "0px 20px 0px 20px")
						.html(d.coltype);
					});

				return d.name; 
			})
		.on('mouseover', function (d) {
			return d.table.style("display", "inline");
		})
		.on("mousemove", function (d) {
			return d.table.style("top", (event.pageY + 30) + "px").style("left", (event.pageX - 50) + "px");
		})
		.on('mouseout', function (d) {
			return d.table.style("display", "none");
		})
			.style("fill-opacity", 1e-6)
			.style("font-size", "12px");

	nodeEnter.append("text")
		.attr("x", "-90")
		.attr("y", "3")
		.style("font-size", "15px")
		.text(function (d) {
			if (d.type != "origin") {

				d.tooltip = d3.select("body")
					.append("div")
					.style("position", "absolute")
					.style("z-index", "10")
					.style("font-size", "12px")
					.style("color", "white")
					.style("display", "none")
					.html(d.jointip);
				var joinType = d.join;

				return joinType + " join";
			}
			else {
				return "";
			}
		})
		.on('mouseover', function (d) {
			return d.tooltip.style("display", "inline");
		})
		.on("mousemove", function (d) {
			return d.tooltip.style("top", (event.pageY + 30) + "px").style("left", (event.pageX - 50) + "px");
		})
		.on('mouseout', function (d) {
			return d.tooltip.style("display", "none");
		});

	// Transition nodes to their new position.
	var nodeUpdate = node.transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	nodeUpdate.select("circle")
			.attr("r", 4.5)
			.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	nodeUpdate.select("text")
			.style("fill-opacity", 1);

	// Transition exiting nodes to the parent's new position.
	var nodeExit = node.exit().transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
			.remove();

	nodeExit.select("circle")
			.attr("r", 1e-6);

	nodeExit.select("text")
			.style("fill-opacity", 1e-6);

	// Update the links…
	var link = svg.selectAll("path.link")
			.data(links, function(d) { return d.target.id; });

	// Enter any new links at the parent's previous position.
	link.enter().insert("path", "g")
			.attr("class", "link")
			.attr("d", function(d) {
				var o = {x: source.x0, y: source.y0};
				return diagonal({source: o, target: o});
			});

	// Transition links to their new position.
	link.transition()
			.duration(duration)
			.attr("d", diagonal);

	// Transition exiting nodes to the parent's new position.
	link.exit().transition()
			.duration(duration)
			.attr("d", function(d) {
				var o = {x: source.x, y: source.y};
				return diagonal({source: o, target: o});
			})
			.remove();

	// Stash the old positions for transition.
	nodes.forEach(function(d) {
		d.x0 = d.x;
		d.y0 = d.y;
	});
}

// Toggle children on click.
function click(d) {
	if (d.children) {
		d._children = d.children;
		d.children = null;
	} else {
		d.children = d._children;
		d._children = null;
	}
	update(d);
}