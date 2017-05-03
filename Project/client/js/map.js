function map(){

	var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 800])
            .on("zoom", move);

	var idDiv = $("#map");

	// Set the margin, width and height
	var margin = {top: 20, right: 20, bottom: 20, left: 20},
    	width = idDiv.width() - margin.right - margin.left,
        height = idDiv.height() - margin.top - margin.bottom;

    // Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .scale(1)
            .rotate([-24,-36])
            .translate([width / 2, height / 2]);

    /*var projection = d3.geo.albers()
		    .center([0, 36.045503])
		    .rotate([24.837642, 0])
		    .parallels([50, 60])
		    .scale(600)
		    .translate([width / 2, height / 2]);*/

	/*var projection = d3.geo.mercator()
	    .scale(700) // (width - 3) / (2 * Math.PI)
	    .translate([width / 2, height / 2]);*/

	//var projection = d3.geo.conicEqualArea();

    //Creates a new geographic path generator and assing the projection        
    var path = d3.geo.path().projection(projection);

    //Formats the data in a feature collection trougth geoFormat()
    // var geoData = {type: "FeatureCollection", features: geoFormat(data)}; data = gps ? geoFormat function created to format

    //Loads geo data
    d3.json("data/streets.json", function (error, mapData) {
        //var streeets = topojson.feature(mapData, mapData.features).features;
        console.log(mapData);
        draw(mapData.features)
    });

    function draw(streets) {

    	/*g.selectAll("streetLines")
		    .data(streets)
		  .enter().append("path")
		    .attr("class", "streetLines")
		    .attr("d", path);*/

		var line = g.selectAll("circle")
            .data(streets)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function(d) {return projection(d.geometry.coordinates[0])[0];})
            .attr("cy", function(d) {return projection(d.geometry.coordinates[0])[1];})
            .attr("r", 1)
            .style("opacity", 0.1)
            .style("fill", "orange");





    }


    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }
	
}