function expences(){

	var idDiv = $("#expences");

	// Set the margin, width and height
	var margin = {top: 20, right: 20, bottom: 20, left: 100},
    	width = idDiv.width() - margin.right - margin.left,
        height = idDiv.height() - margin.top - margin.bottom;

    var parseTime = d3.timeParse("%-m/%-d/%Y %H:%M"); // 1/6/2014 7:35

    var x = d3.scaleTime().rangeRound([0, width]),
	    y = d3.scaleBand().rangeRound([height, 0]).padding(0.1);

	var varXaxis = "timestamp";
    var varYaxis = "location";

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    var g = d3.select("#expences").append("svg")
              .attr("id", "g1_svg")
              .attr("data-margin-right", margin.right)
              .attr("data-margin-left", margin.left)
              .attr("data-margin-top", margin.top)
              .attr("data-margin-bottom", margin.bottom)
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var clip = g.append("defs").append("svg:clipPath")
	            .attr("id", "clip")
	            .append("svg:rect")
	            .attr("width", width )
	            .attr("height", height )
	            .attr("x", 0) 
	            .attr("y", 0); 

    var scatter = g.append("g")
	             .attr("id", "scatterplot")
	             .attr("clip-path", "url(#clip)");

	d3.csv("data/cc_data.csv", function(data) {
		console.log(data);
		
		max = d3.max(data, function(d) { return parseTime(d[varXaxis]); });
		min = d3.min(data, function(d) { return parseTime(d[varXaxis]); });
		y.domain(data.map(function(d) { return d[varYaxis]; }));
		x.domain([min, max]);

		console.log(min);
		console.log(max);

		person_data = updateData(data,["Edvard", "Vann"]);
		draw(person_data);
	});

	function updateData(data, person) {
		// data : raw cc_data, person : [firstname, lastname]
		cc_person = [];
		data.forEach(function(d) {
			if(d.FirstName == person[0] && d.LastName == person[1]) {
				cc_person.push(d);
			}
		})
		y.domain(cc_person.map(function(d) { return d[varYaxis]; }));
		console.log(cc_person)
		return cc_person;
	}

	function draw(data) {
		g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

		g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(y).ticks(10, "%"))
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", "0.71em")
			.attr("text-anchor", "end")
			.text("Frequency");

		var maxPrice = d3.max(data, function(d) {return d["price"];});
		var fraq = 300/y.bandwidth();
		console.log(maxPrice);
		scatter.selectAll(".dot")
			.data(data)
			.enter().append("circle")
			.attr("class", "dot")
			.attr("cx", function(d) { return x(parseTime(d[varXaxis])); })
			.attr("cy", function(d) { return y(d[varYaxis]) + y.bandwidth()/2; }) 
			.attr("r", function(d) { return 2+  d.price/fraq; }) // d.size/fraq ,  d.end - d.begin
			.style("opacity",0.8)
			.style("fill", "blue");
	}

}