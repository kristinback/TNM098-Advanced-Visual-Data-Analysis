var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("gps.db");

var express = require("express");
var app = express();
var path = require("path");

app.use(express.static(path.join(__dirname, 'client')));

//register end point
app.get('/', function (req, res) {
  res.send('Hello root');
  //res.json({ message: 'hooray! welcome to our api!' });   
});


//look in to this link!!!! : http://dalelane.co.uk/blog/?p=3152

//registering endpoint /gps
app.get("/gps", function(req, res){
  
  
  db.all("SELECT * FROM gpsTables", function(err, rows){

    var data = new Array();
    console.log("hej");
    console.log("rows");
  }

    // rows.forEach(function(rows,i){
    //   data = rows[i];
    // });

    // res.json(data);

    //res.json(data);
//vill skicka iväg: res.json(data) för att bilda en json fil som vi kan använda med d3
});



app.listen(3000,function(){
  console.log("Live at Port 3000");
});