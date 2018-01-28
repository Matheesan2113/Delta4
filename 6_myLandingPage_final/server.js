var express = require('express');
var app = express();
// import entire SDK
var AWS = require('aws-sdk');
// import AWS object without services
var AWS = require('aws-sdk/global');
// import individual service
var S3 = require('aws-sdk/clients/s3');

app.use(express.static(__dirname + "/public"));

app.get('/', function (request,response){
response.render('index.ejs');
});

app.get('/login', function(request, response){
response.render('main.ejs');    
});

app.listen(3000,function(){
    console.log("First API running on port 3000");
    console.log(__dirname);
});