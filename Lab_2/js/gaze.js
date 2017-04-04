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
        length = 100,
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
        .y(function(d) { return y(900 - d.y); });

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

        var clusters = DBscan(dataToCluster, 90, 300000, 45 );

        var reducedData = [];

        clusters.forEach(function(d) {
            d.forEach(function(p) {
                reducedData.push(p);
            })
        })

        reducedData.sort(function(a,b){return a.value - b.value});
        console.log(reducedData);

        draw(reducedData);
    });

    function draw(clusters)
    {

      svg.append("path")
            .datum(clusters)
            .attr("d", line)
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("fill", "none");
            

    }
}