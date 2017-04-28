// var express = require('express')
// var app = express()

// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!')
// })


var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("gps.db");

var express = require("express");
var app = express();
var path = require("path");

app.use(express.static(path.join(__dirname, 'client')));


/******************Example on how to write this *********************/

// app.get("/event", function(req, res){
//   db.all("SELECT * FROM events", function(err, rows){
//   console.log(err);
//     var data = new Array();
//     var eventDuration = 0;
//     var relativeStart = 0;
//     var relativeEnd = 0;
//     var ageAtDiagnosis = 0;
//     var index = 0;
//     var preId = 0;
//     rows.forEach( function(row, indx) {
//       data[indx] = row; index++;
//       relativeStart = getNumberOfDays(row.FirstPsychosis, row.Start);
//       data[indx].relativeStart = relativeStart;
//       if(row.Level != 3){
//         eventDuration = getNumberOfDays(row.Start, row.End);
//         relativeEnd = getNumberOfDays(row.FirstPsychosis, row.End);
//       }
//       else{
//         if(row.EventType != 2){
//         eventDuration = getNumberOfDays(row.Start, row.End);
//         relativeEnd = getNumberOfDays(row.FirstPsychosis, row.End);
//       }
//         else{
//           eventDuration = getNumberOfDays(row.Start, row.Start);
//           relativeEnd = getNumberOfDays(row.FirstPsychosis, row.Start);
//         }
//       }
//       data[indx].eventDuration = eventDuration;
//       data[indx].relativeEnd = relativeEnd;
//     });
//     res.json(data);
//     console.log(index);
//   });
// });



// app.get("/fact", function(req, res){
//   db.all("SELECT * FROM facts", function(err, rows){
//     var data = new Array();
//     var index = 0;
//     var preId = 0;
//     rows.forEach( function(row, indx) {
//       if(preId != row.Id) {
//         data[indx] = row; index++;
//         ageAtDiagnosis = getAge(row.Age, row.FirstPsychosis);
//         data[indx].ageAtDiagnosis = ageAtDiagnosis;
//       }
//     });
//     res.json(data);
//     console.log(index);
//   });
// });


app.listen(3000,function(){
  console.log("Live at Port 3000");
});