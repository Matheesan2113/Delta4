var express = require('express');
var app = express();

app.use(express.static(__dirname + "/public"));

app.get('/', function (request,response){
response.render('index.ejs');
});
app.listen(3000,function(){
    console.log("First API running on port 3000");
    console.log(__dirname);
});