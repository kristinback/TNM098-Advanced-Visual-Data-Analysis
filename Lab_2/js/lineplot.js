function lineplot(){
    
    var self = this; // for internal d3 functions

    var spDiv = $("#line");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    
    // Variables names 
    var xData = "GazePointX";
    var yData = "GazePointY";

    var line = d3.line()
        .x(function(d) { return x(d.GazePointX); })
        .y(function(d) { return y(900 - d.GazePointY); });

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

        var clusters = DBscan(dataToCluster, 90, 300000, 45 );

        draw(clusters);
    });

    function draw(clusters)
    {
/*        g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);*/

        svg.append("path")
            .datum(self.data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);

    }
}