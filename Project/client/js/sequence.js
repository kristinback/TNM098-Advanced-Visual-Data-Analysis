function sequence(sequence){

	// console.log("sequence");

	// console.log(sequence[1]["personSeq1_ " +1]);

	//loopa igenom sequence och alla object
	var seqData = [];
	sequence.forEach(function(d,j){
		for (var i = 1; i <= 88; i++ ){

			if(i < 10){
				newEntry = {
					person: j+1,
					store: d["personSeq1_ " +i],
					classification: d["personSeq2_ " +i],
					startTime: d["personSeq3_ " +i],
					endTime: d["personSeq4_ " +i]
				}
			}
			else{
				newEntry = {
					person: j+1,
					store: d["personSeq1_" +i],
					classification: d["personSeq2_" +i],
					startTime: d["personSeq3_" +i],
					endTime: d["personSeq4_" +i]
				}
			}
			seqData.push(newEntry);
		}
	});

	var idDiv = $("#sequence");

	// Set the margin, width and height
	var margin = {top: 20, right: 20, bottom: 20, left: 130},
    	width = idDiv.width() - margin.right - margin.left,
        height = idDiv.height() - margin.top - margin.bottom;

    var parseTime = d3.time.format("%-m/%-d/%Y %H:%M:%S").parse; // 1/6/2014 7:35:00

	var y = d3.time.scale().range([0, height]);
	var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1,0.2);
	

	// var varXaxis = "person";
 	// var varYaxis = "time";


    var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<strong>Place:</strong> <span style='color:red'>" + d["store"];
		})

    var g = d3.select("#sequence").append("svg")
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

	
	min = parseTime("1/6/2014 0:00:00");
	max = parseTime("1/20/2014 0:00:00");
	
	y.domain([min, max]);
	//x.domain([min, max]);
	x.domain(seqData.map(function(d){return d["person"];}));
	//,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36
	// console.log(x.domain());
	//console.log(x.range());
	draw(seqData);


	function draw(data) {
		g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.svg.axis().scale(x).orient("bottom"));

		g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.svg.axis().scale(y).orient("left"));
		
		// var maxtime = d3.max(data, function(d) {return x(d.end) - x(d.start);});

		//console.log(sequence[1]["personSeq1_ 1"]);

		scatter.selectAll("bar")
            .data(data)
            .enter().append("rect")
           	.attr("class", "bar")        
	        .attr("fill", function(d){
	        	
	        	switch (d["classification"]){
	        		case "1": return "#a6cee3";	//work
	        		case "2": return "#1f78b4";	//store
	        		case "3": return "#b2df8a";	//home
	        		case "4": return "#33a02c";	//other
	        	}
	        })
	        //.attr("opacity", 0.6)
	        .attr("x", function(d) { return x(d["person"]); })
	        .attr("y", function(d) { return y(parseTime(d["startTime"]));})
	        .attr("width", x.rangeBand())
	        .attr("height", function(d) { return y(parseTime(d["endTime"]))- y(parseTime(d["startTime"])); })
	        .on('mouseover', tip.show)
	      	.on('mouseout', tip.hide);
	}

}