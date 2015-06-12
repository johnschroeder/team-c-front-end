var express = require('express');
var path = require('path');
var config = require('konfig')();
var app = express();
var apiRoute = config.app.api;
var ejs = require('ejs');

app.set('view engine', 'ejs');


app.get("/", function(req, res){
    res.render("indexHeader.ejs", {apiRoute: apiRoute});
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found '+JSON.stringify(req.url));
    err.status = 404;
    next(err);
});


app.listen(config.app.port);


console.log('Express server running on port '+config.app.port);

