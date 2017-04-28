


var graph1 = graph();
var map1 = map();
// var barChart1 = barChart();
var expences1;// = expences();

d3.csv("data/cc_data.csv", function(cc_data) {
	cc_data.forEach(function(d) {
		d.price = +d.price;
	})
	expences1 = expences(cc_data);
});