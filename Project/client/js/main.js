var graph1 = graph();
//var map1 = map();
var barChart1; // = barChart();
var expences1;// = expences();

var testmap = map2();

d3.csv("data/cc_data.csv", function(cc_data) {

	// parse price to int and initiate the plot for expences
	cc_data.forEach(function(d) {
		d.price = +d.price;
	})
	expences1 = expences(cc_data);

	// calculate time spent between all ppl, initate the plot for time spent together
	var time_data = [];
    var parseTime = d3.time.format("%-m/%-d/%Y %H:%M").parse; // 1/6/2014 7:35
	cc_data.forEach(function(d) { // fake data
		data_point = {
			FirstName : d.FirstName,
			LastName : d.LastName,
			timestamp : d.timestamp,
			time : d.price,
			person : d.location,
			start : parseTime(d.timestamp),
			end : d3.time.hour.offset(parseTime(d.timestamp),Math.floor(Math.random()*25)+1)
		}
		time_data.push(data_point);
	})
	barChart1 = barChart(time_data);
});
