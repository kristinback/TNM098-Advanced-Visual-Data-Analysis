function expences(cc_data){

	var idDiv = $("#expences");

	// Set the margin, width and height
	var margin = {top: 20, right: 20, bottom: 20, left: 100},
    	width = idDiv.width() - margin.right - margin.left,
        height = idDiv.height() - margin.top - margin.bottom;

    var parseTime = d3.time.format("%-m/%-d/%Y %H:%M").parse; // 1/6/2014 7:35

    /*var x = d3.scaleTime().rangeRound([0, width]),
	    y = d3.scaleBand().rangeRound([height, 0]).padding(0.1);*/

	var y = d3.scale.ordinal()
	    .rangeRoundBands([height, 0], 0.1, 0.2);

	var x = d3.time.scale()
	    .range([0, width]);

	var varXaxis = "timestamp";
    var varYaxis = "location";

    /*var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);*/

    var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			var res = d.timestamp.split(" ");
			return "<strong>Money spent:</strong> <span style='color:red'>" + d.price + " $</span> <br> at " + res[1];
		})

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
    
    g.call(tip);

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

	//console.log(cc_data);
	
	max = d3.max(cc_data, function(d) { return parseTime(d[varXaxis]); });
	min = d3.min(cc_data, function(d) { return parseTime(d[varXaxis]); });
	y.domain(cc_data.map(function(d) { return d[varYaxis]; }));
	//x.domain([min, max]);
	x.domain([d3.time.day.floor(min),d3.time.day.ceil(max)]);

	//console.log(min);
	//console.log(max);


	// time, backround
	//console.log();
	var start = x.domain()[0];
	var end = x.domain()[1];
	var now = start;
	var state = "start";
	var background = [];
	while(now < end) {
		stamp = {
				start : now,
			}
		if (state == "start") { // 00:00 - 06:00 night
			stamp.state = "night";
			state = "night";
			now = d3.time.hour.offset(now,6); // equal steps: 4
		}
		else if (state == "night") { // 06:00 - 12:00 fm 
			state = "fm";
			stamp.state = "fm";
			now = d3.time.hour.offset(now,6); // equal steps: 8
		}
		else if (state == "fm") { // 12:00 - 22:00
			state = "em";
			stamp.state = "em";
			now = d3.time.hour.offset(now,10); // equal steps: 8
		}
		else { // is em, 22:00 - 06:00
			state = "night";
			stamp.state = "night";
			now = d3.time.hour.offset(now,8);
		}
		stamp.end = now;
		background.push(stamp)
		//console.log(now);
	}
	//console.log(background)


	//person_data = updateData(cc_data,["Albina", "Hafon"]);
	//person_data = updateData(cc_data,["Edvard", "Vann"]);
	var person_data = updateData(cc_data,["Stenig", "Fusil"]);
	//person_data = updateData(cc_data,["Minke", "Mies"]);
	draw(person_data, background);

	function updateData(data, person) {
		// data : raw cc_data, person : [firstname, lastname]
		cc_person = [];
		data.forEach(function(d) {
			if(d.FirstName == person[0] && d.LastName == person[1]) {
				cc_person.push(d);
			}
		})
		y.domain(cc_person.map(function(d) { return d[varYaxis]; }));
		//console.log(cc_person)
		return cc_person;
	}

	function draw(data, background) {
		g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.svg.axis().scale(x).orient("bottom"));

		g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.svg.axis().scale(y).orient("left"));


		var top = y.domain()[y.domain().length - 1];
		var bottom = y.domain()[0];
		scatter.selectAll("bar")
            .data(background)
            .enter().append("rect")
            .attr('class', 'bar')
            .attr("fill", function(d) {
            	if (d.state == "night") { return "black"; }
            	else if (d.state == "fm") { return "pink"; }
            	else if (d.state == "em") { return "orange"; }
            })
            .attr("opacity", 0.2)
            .attr("x", function(d) { return x(d.start); })
            .attr("y", function(d) { return y(top) - y.rangeBand()/2; }) // y.domain()[y.domain().length - 1]
            .attr("width", function(d) { return x(d.end) - x(d.start); })
            .attr("height", function(d) { return  y(bottom) - y(top) + 2*y.rangeBand(); });

		var maxPrice = d3.max(data, function(d) {return d["price"];});
		var fraq = maxPrice/y.rangeBand();

		scatter.selectAll(".dotSize")
			.data(data)
			.enter().append("circle")
			.attr("class", "dotSize")
			.attr("cx", function(d) { return x(parseTime(d[varXaxis])); })
			.attr("cy", function(d) { return y(d[varYaxis]) + y.rangeBand()/2 }) // + y.bandwidth()/2; 
			.attr("r", function(d) { return 3 + d.price/(2*fraq); }) // d.size/fraq ,  d.end - d.begin
			.style("opacity",0.6)
			.style("fill", "blue")
			.on('mouseover', tip.show)
      		.on('mouseout', tip.hide);

		scatter.selectAll(".dotCenter")
			.data(data)
			.enter().append("circle")
			.attr("class", "dotCenter")
			.attr("cx", function(d) { return x(parseTime(d[varXaxis])); })
			.attr("cy", function(d) { return y(d[varYaxis]) + y.rangeBand()/2 }) // + y.bandwidth()/2; 
			.attr("r", 1); // d.size/fraq ,  d.end - d.begin
	}

}