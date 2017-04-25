function gaze(setting){

    var self = this; // for internal d3 functions

    var spString = "#gaze" + setting;
    var spDiv = $(spString);
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    
    // Variables names 
    var xData = "GazePointX";
    var yData = "GazePointY";

    var body = d3.select("body"),
        length = 10,
        color = d3.scale.linear().domain([1,length])
          .interpolate(d3.interpolateHcl)
          .range([d3.rgb("#FF0000"), d3.rgb('#00FF00')]);


      for (var i = 0; i < length; i++) {
        body.append('div').attr('style', function (d) {
          return 'background-color: ' + color(i);
        });
      }

    var line = d3.svg.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(900 - d.y); })
        .interpolate("cardinal"); // cardinal

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
                value : parseInt(d.RecordingTimestamp) // FixationIndex
            };
        })

        var clusters = DBscan(dataToCluster, 80, 300000, 55 );
        var center = calcClusters(clusters);

        var reducedData = [];

        clusters.forEach(function(d,i) {
            d.forEach(function(p) {
                p.x = center[i].cent.x;
                p.y = center[i].cent.y;
                p.clusterID = i;
                reducedData.push(p);
            })
        })

        reducedData.sort(function(a,b){return a.value - b.value});
        console.log(reducedData);
        var lastCluster;
        var tempLast;
        var something = reducedData.filter(function(d,i) {
            if (i > 0 && i < reducedData.length) {
                lastCluster = tempLast;
                tempLast = d.clusterID;
                if (lastCluster == d.clusterID) {
                    center[lastCluster].totalTime += (d.value - reducedData[i-1].value);
                }
                else{
                    center[lastCluster].totalTime += 90;
                }
                return (lastCluster != d.clusterID);
            }
            tempLast = d.clusterID;
            return true;

        })

        console.log(center);


        draw(something, center);
    });

    function draw(drawData, clusters)
    {

        /*svg.append("linearGradient")
            .attr("id", "temperature-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", y(500))
            .attr("x2", 0).attr("y2", y(800))
        .selectAll("stop")
            .data([
                {offset: "0%", color: "steelblue"},
                {offset: "50%", color: "gray"},
                {offset: "100%", color: "red"}
            ])
        .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });*/

        /*svg.append("path")
            .datum(drawData)
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke", "#temperature-gradient")
            .attr("stroke-linejoin", "round")
            //.attr("stroke-opacity", 0.6)
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("fill", "none");*/

        var segmentColor = d3.scale.category10();//["#2AC0D4", "#000000"];
        var segments = 10;
        var jump = 300000/segments; // time 300000, index 750
        for (var i = 0; i < segments; i++) {
            svg.append("path")
                //.datum(drawData)
                .attr("d", line(drawData.filter(function(d) {
                    return (d.value > i*jump && d.value < (i+1)*jump);
                })))
                .attr("stroke", color(i))
                .attr("stroke-linejoin", "round")
                //.attr("stroke-opacity", 0.6)
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("fill", "none"); 
        };

        svg.selectAll(".dot")
            .data(clusters)
            .enter().append("circle")
            .attr("class", "dot")
            //Define the x and y coordinate data values for the dots
            // Add circles from data
            .attr("cx", function(d){return x(d.cent.x);})
            .attr("cy", function(d){return  y(900 - d.cent.y);})

            .attr("r", function(d) {return (d.totalTime+50*d.size)/1000})  // Radius
            .style("fill", function(d,i){ return segmentColor(3);})     //välj segmentColor(i) annars

            //.style("opacity", function(d) { return d.RecordingTimestamp/300000 ;})
            .style("opacity", 0.8)
            .style("stroke-opacity",0);
            
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
                size : d.length,
                totalTime : 0
            }
        })
        return clusterCentroid;
    }
}