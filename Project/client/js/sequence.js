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
	var idDiv1 = $("#legend1");

	// Set the margin, width and height
	var margin = {top: 20, right: 20, bottom: 20, left: 60},
    	width = idDiv.width() - margin.right - margin.left,
        height = idDiv.height() - margin.top - margin.bottom;
    // Set the margin, width and height
    var margin1 = {top: 5, right: 5, bottom: 5, left: 5},
        width1 = idDiv1.width() - margin1.right - margin1.left,
        height1 = idDiv1.height() - margin1.top - margin1.bottom;

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
	        		case "1": return "#d62728";	//work
	        		case "2": return "#17becf";	//store
	        		case "3": return "#6b6ecf";	//home
	        		case "4": return "#e377c2";	//other
	        	}
	        })
	        //.attr("opacity", 0.6)
	        .attr("x", function(d) { return x(d["person"]); })
	        .attr("y", function(d) { return y(parseTime(d["startTime"]));})
	        .attr("width", x.rangeBand())
	        .attr("height", function(d) { return y(parseTime(d["endTime"]))- y(parseTime(d["startTime"])); })
	        .on('mouseover', tip.show)
	      	.on('mouseout', tip.hide)
	      	.on("click", function(d){
				d3.select(this).style("stroke", "black")
				seq1.selectSeq(d["person"]);
				selFeature(d["person"]);
	      	});



	    /*****Color Legend******/
	var svgContainer = d3.select("#legend1").append("svg")
	        .attr("width", width1)
	        .attr("height", height1);

	        svgContainer.append("circle")
	            .attr("cx", 20)
	            .attr("cy", 12)
	            .attr("r", 10)
	            .style("fill", "#6b6ecf")
	            .style("opacity", 0.9);


	        svgContainer.append("circle")
	            .attr("cx", 120)
	            .attr("cy", 12)
	            .attr("r", 10)
	            .style("fill", "#d62728")
	            .style("opacity", 0.9);

	        svgContainer.append("circle")
	            .attr("cx", 220)
	            .attr("cy", 12)
	            .attr("r", 10)
	            .style("fill", "#17becf")
	            .style("opacity", 0.9);

	        svgContainer.append("circle")
	            .attr("cx", 320)
	            .attr("cy", 12)
	            .attr("r", 10)
	            .style("fill", "#e377c2")
	            .style("opacity", 0.9);

		    svgContainer.append("circle")
		    	.attr("cx", 600)
		        .attr("cy", 12)
		        .attr("r", 10)
		        .style("fill", "green")
		        .style("opacity", 0.6);

		 	svgContainer.append("circle")
		    	.attr("cx", 820)
		        .attr("cy", 12)
		        .attr("r", 10)
		        .style("fill", "orange")
		        .style("opacity", 0.6);

	/***** END Color Legend******/

	}
//**************Brushing**************//

	this.selectSeq = function(value){
		

	};

	//method for selecting features of other components
    function selFeature(value){
        expences1.selectDots(value);
    }




}