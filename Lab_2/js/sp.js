function sp(setting){

    var self = this; // for internal d3 functions

    var spString = "#sp" + setting;
    console.log(spString);
    var spDiv = $(spString);

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    var c20c = d3.scale.category20c(); //["#F556DA", "#000000"];
	//var color = ["#2AC0D4", "#000000"];

	var body = d3.select("body"),
		length = 122,
		color = d3.scale.linear().domain([1,length])
		  .interpolate(d3.interpolateHcl)
		  .range([d3.rgb("#FF0000"), d3.rgb('#00FF00')]);


	  for (var i = 0; i < length; i++) {
		body.append('div').attr('style', function (d) {
		  return 'background-color: ' + color(i);
		});
	  }

    //initialize tooltip
    var tooltip = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

	
	// Variables names 
	var xData = "GazePointX";
    var yData = "GazePointY";

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select(spString).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// var clusters = [];
    //Load data
    d3.tsv("data/EyeTrack-raw.tsv", function(error, data) {
        self.data = data;
		
        var yMax = d3.max(data, function(d) { return d.GazePointY});
        var xMax = d3.max(data, function(d) { return d.GazePointX});

        x.domain([0, 1600]);
        y.domain([0, 900]);
		
		dataToCluster = [];
		data.forEach(function(d,i){
			dataToCluster[i] = {
				x : parseInt(d.GazePointX),
				y : parseInt(d.GazePointY),
				value : parseInt(d.RecordingTimestamp)
			};
		})
		

        var clusters = DBscan(dataToCluster, 80, 300000, 55 );

		var newClusters = calcClusters(clusters);
        console.log(clusters);
        console.log(newClusters);
        if (setting == 0)
            draw(clusters);
        else
            drawClusters(newClusters);
    });

    function draw(clusters)
    {
        

            
        // Add the scatter dots.
        // svg.selectAll(".dot")
            // .data(self.data)
            // .enter().append("circle")
            // .attr("class", "dot")
            // //Define the x and y coordinate data values for the dots
            // // Add circles from data
            // .attr("cx", function(d){return x(d[xData]);})
            // .attr("cy", function(d){return  y(900 - d[yData]);})
            // .attr("r", 5)  // Radius
			// .style("fill", function(d){ return c20c(d.Country);})
			// //.style("opacity", function(d) { return d.RecordingTimestamp/300000 ;})
			// .style("opacity", 0.4)
            // //tooltip
            // .on("mousemove", function(d) {
            // d3.selectAll("selectDots")       //kallar på selectDot nedan för att länka ihop sp och pc
            // tooltip.transition()        
                // .duration(100)      
                // .style("opacity", .9);      
            // tooltip.html(d.FixationIndex)  
                // .style("left", (d3.event.pageX) + "px")     
                // .style("top", (d3.event.pageY - 28) + "px");    
            // })
            // .on("mouseout", function(d) {
                // tooltip.transition()        
                // .duration(500)      
                // .style("opacity", 0);   
            // })
            // .on("click",  function(d) {
                // //...   
				// sp1.selectDots(d["Country"]); 
				// //pc1.selectLine(d.country);
                // selFeature(d["Country"]);

            // });

		var density = [];
		clusters.forEach( function(d,i) {
			var points = d.length;
			var xMax = d3.max(d, function(p) {return p.x});
			var xMin = d3.min(d, function(p) {return p.x});
			var yMax = d3.max(d, function(p) {return p.y});
			var yMin = d3.min(d, function(p) {return p.y});

			var a = (xMax-xMin)*(yMax-yMin)/1000;
			density[i] = (points/a);
			density[i] = (points);			
			
		})

		svg.selectAll(".points")
			.data(clusters)
			.enter().append("g")
				.attr("class", "points")
				.style("fill", function(p,i){ return color(density[i]);})
				.style("stroke-opacity",0) 
			.selectAll(".dot")
				.data(function(p) {return p;})
            .enter().append("circle")
            .attr("class", "dot")
            //Define the x and y coordinate data values for the dots
            // Add circles from data
            .attr("cx", function(d){return x(d.x);})
            .attr("cy", function(d){return  y(900 - d.y);})
            .attr("r", 10)  // Radius
			//.style("fill", function(d){ return c20c(d.Country);})
			//.style("opacity", function(d) { return d.RecordingTimestamp/300000 ;})
			.style("opacity", 0.1)
            //tooltip
            .on("mousemove", function(d) {
            d3.selectAll("selectDots")       //kallar på selectDot nedan för att länka ihop sp och pc
            tooltip.transition()        
                .duration(100)      
                .style("opacity", .9);      
            tooltip.html(d.value)  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })
            .on("mouseout", function(d) {
                tooltip.transition()        
                .duration(500)      
                .style("opacity", 0);   
            })
            .on("click",  function(d) {
                //...   
				sp1.selectDots(d["Country"]); 
				//pc1.selectLine(d.country);
                selFeature(d["Country"]);

            });


        // svg.append("text")      // text label for the x axis
            // .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
            // .style("text-anchor", "middle")
            // .text("Household income");


        // svg.append("text")
            // .attr("transform", "rotate(-90)")
            // .attr("y", 0 - margin.left)
            // .attr("x",0 - (height / 2))
            // .attr("dy", "1em")
            // .style("text-anchor", "middle")
            // .text("Personal earnings");


    }

    function drawClusters(clusters)
    {


        svg.selectAll(".dot")
                .data(clusters)
            .enter().append("circle")
            .attr("class", "dot")
            //Define the x and y coordinate data values for the dots
            // Add circles from data
            .attr("cx", function(d){return x(d.cent.x);})
            .attr("cy", function(d){return  y(900 - d.cent.y);})
            .attr("r", function(d) {return d.size/3})  // Radius
            //.style("fill", function(d){ return c20c(d.Country);})
            //.style("opacity", function(d) { return d.RecordingTimestamp/300000 ;})
            .style("opacity", 0.8)
            .style("stroke-opacity",0) 
            //tooltip
            .on("mousemove", function(d) {
            d3.selectAll("selectDots")       //kallar på selectDot nedan för att länka ihop sp och pc
            tooltip.transition()        
                .duration(100)      
                .style("opacity", .9);      
            tooltip.html(d.size)  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })
            .on("mouseout", function(d) {
                tooltip.transition()        
                .duration(500)      
                .style("opacity", 0);   
            })
            .on("click",  function(d) {
                //...   
                sp1.selectDots(d["Country"]); 
                //pc1.selectLine(d.country);
                selFeature(d["Country"]);

            });


    }

    function calcClusters(clusters) {

        var clusterCentroid = [];
        clusters.forEach(function(d,i) {
            var centroid = {
                x : 0,
                y : 0
            }
            d.forEach(function(p) {
                centroid.x += p.x;
                centroid.y += p.y;
            })
            centroid.x = centroid.x/d.length;
            centroid.y = centroid.y/d.length;
            clusterCentroid[i] = {
                cent : centroid,
                size : d.length
            }
        })
        return clusterCentroid;
    }

    //method for selecting the dot from other components
    this.selectDots = function(value){
        //...
		
        //find this dot and select it
		d3.selectAll(".dot")//.each(function (d) {
			.style("fill", function(d){
				if(value.indexOf(d.Country) != -1) 
				return c20c(d.Country);
				else return color[1];

            })
		
    };
	
	    //method for selecting the dot from other components
    this.selectDot = function(value){
        //...
		console.log("hej");
		//pc1.selectLine(value);
		
		
    };
	
	this.fadeDots = function (choosen) {
		d3.selectAll(".dot").each(function(d,i){	
		})
    }
	
	
    //method for selecting features of other components
    function selFeature(value){
        //...

        pc1.selectLine(value); 
    }

}