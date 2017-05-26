function expences(cc_data, loy_data, car_ass){

	var idDiv = $("#expences");
	var idDiv1 = $("#legend1");

	// Set the margin, width and height
	var margin = {top: 20, right: 80, bottom: 130, left: 60},
    	width = idDiv.width() - margin.right - margin.left,
        height = idDiv.height() - margin.top - margin.bottom;

        	// Set the margin, width and height
	var margin1 = {top: 5, right: 5, bottom: 5, left: 5},
    	width1 = idDiv1.width() - margin1.right - margin1.left,
        height1 = idDiv1.height() - margin1.top - margin1.bottom;

    var parseTime = d3.time.format("%-m/%-d/%Y %H:%M").parse; // 1/6/2014 7:35
    var parseTime2 = d3.time.format("%-m/%-d/%Y").parse; // 1/6/2014 7:35
 
    /*var x = d3.scaleTime().rangeRound([0, width]),
	    y = d3.scaleBand().rangeRound([height, 0]).padding(0.1);*/

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], 0.1, 0.2);//

	var y = d3.time.scale()
	    .range([0, height]);

	var varXaxis = "timestamp";
    var varYaxis = "location";

    var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			var res = d.timestamp.split(" ");
			return "<strong>Money spent:</strong> <span style='color:red'>" + d.price + " $</span> <br> at " + res[1];
		})
	var tip2 = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			var res = d.timestamp.split(" ");
			return "<strong>Money spent:</strong> <span style='color:red'>" + d.price + " $</span> <br> at " + res[0];
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
    g.call(tip2);

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
	x.domain(cc_data.map(function(d) { return d[varYaxis]; }));
	//x.domain([min, max]);
	y.domain([d3.time.day.floor(min),d3.time.day.ceil(max)]);
	

	//console.log(y.domain())
	//console.log(min);
	//console.log(max);


	// time, backround
	//console.log();
	var start = y.domain()[0];
	var end = y.domain()[1];
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


	//person_data = updateData(cc_data,["Albina", "Hafon"]);
	//person_data = updateData(cc_data,["Edvard", "Vann"]);
	var person_data = updateData(cc_data,["Edvard", "Vann"]);
	var loy_trans = updateData(loy_data, ["Edvard", "Vann"]);
	//person_data = updateData(cc_data,["Minke", "Mies"]);
	draw(person_data,loy_trans, background);

	function updateData(data, person) {
		// data : raw cc_data, person : [firstname, lastname]
		cc_person = [];
		data.forEach(function(d) {
			if(d.FirstName == person[0] && d.LastName == person[1]) {
				cc_person.push(d);
			}
		})
		x.domain(cc_person.map(function(d) { return d[varYaxis]; }));
		return cc_person;
	}

//*************** Background bars for which time of day it is ****************//
	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.svg.axis().scale(y).orient("left"));


	var top = x.domain()[x.domain().length - 1];
	var bottom = x.domain()[0];
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
        .attr("y", function(d) { return y(d.start); })
        .attr("x", function(d) { return (x(bottom) - x.rangeBand()/2); }) 
        .attr("height", function(d) { return y(d.end) - y(d.start); })
        .attr("width", function(d) { return  (x(top) - x(bottom) + 2*x.rangeBand()); });




	function draw(creditCard, loyaltyCard, background) {
		d3.selectAll(".dotSize2").remove();
		d3.selectAll(".dotSize1").remove();
		d3.selectAll(".dotCenter1").remove();
		d3.selectAll("g.axis--h").remove();
		d3.selectAll("g.axis--x").remove();
		

		g.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.svg.axis().scale(x).orient("bottom"))
			.selectAll("text")
			    .attr("transform", function(d) {
			        return "rotate(45)translate(" + this.getBBox().width/2 + "," +
			            this.getBBox().height/2 + ")";
			    });


			//x(bottom) - x(top) + 2*x.rangeBand();


		var maxPrice1 = d3.max(creditCard, function(d) {return d["price"];});
		var fraq1 = maxPrice1/x.rangeBand();

		var maxPrice2 = d3.max(loyaltyCard, function(d) {return d["price"];});
		var fraq2 = maxPrice2/x.rangeBand();
      	//for loyalty card
      	scatter.selectAll(".dotSize2")
      		.data(loyaltyCard)
      		.enter().append("circle")
      		.attr("class", "dotSize2")
			.attr("cy", function(d) { return y(d3.time.hour.offset(parseTime2(d[varXaxis]),12)); })
			.attr("cx", function(d) { return x(d[varYaxis]) + x.rangeBand()/2; }) // + y.bandwidth()/2; 
			.attr("r", function(d) { return 3 + d.price/(2*fraq2); }) // d.size/fraq ,  d.end - d.begin
			.style("opacity",0.6)
			.style("fill", "orange")
			.on('mouseover', tip2.show)
      		.on('mouseout', tip2.hide);

		//for credit card
		scatter.selectAll(".dotSize1")
			.data(creditCard)
			.enter().append("circle")
			.attr("class", "dotSize1")
			.attr("cy", function(d) { return y(parseTime(d[varXaxis])); })
			.attr("cx", function(d) { return x(d[varYaxis]) + x.rangeBand()/2 }) // + y.bandwidth()/2; 
			.attr("r", function(d) { return 3 + d.price/(2*fraq1); }) // d.size/fraq ,  d.end - d.begin
			.style("opacity",0.6)
			.style("fill", "green")
			.on('mouseover',tip.show)
      		.on('mouseout', tip.hide)
      		.on("click", function(d){
      			expences1.selectDots(d["location"]);
      			selFeature(d["location"]);
      		});

      	//center point for credit card
		scatter.selectAll(".dotCenter1")
			.data(creditCard)
			.enter().append("circle")
			.attr("class", "dotCenter1")
			.attr("cy", function(d) { return y(parseTime(d[varXaxis])); })
			.attr("cx", function(d) { return x(d[varYaxis]) + x.rangeBand()/2 }) // + y.bandwidth()/2; 
			.attr("r", 1); // d.size/fraq ,  d.end - d.begin
	}

	this.selectDots = function(value){

		//gå igenom car-assignments och jämför carId med value, hämta sedan för och efternamn
		//name ska vara array med för och efternamn	
		var name = [];
		car_ass.forEach(function(d,i){
			if(parseInt(car_ass[i]["CarID"]) == value){
				name[0] = car_ass[i]["FirstName"];
				name[1] = car_ass[i]["LastName"];
			}
		});
		console.log(name);

		loy_trans = updateData(loy_data, name);
		person_data = updateData(cc_data, name);
		draw(person_data, loy_trans, background);
		
	}

	function selFeature(value){
		seq1.selectSeq(value);
	}



}