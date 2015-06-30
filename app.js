var express = require('express');
var path = require('path');
var config = require('konfig')();
var app = express();
var apiRoute = config.app.api;
var ejs = require('ejs');
var glob = require('glob');

app.set('view engine', 'ejs');
app.engine('.html', ejs.renderFile);

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(path.join(__dirname, 'public')));
if(config.app.debug){
    app.use(express.static(path.join(__dirname, 'views')));
}

var path = process.cwd()+'/routes';
glob.sync('**/*.js',{'cwd':path}).forEach(
    function(file){
        var ns = '/'+file.replace(/\.js$/,'');
        app.use(ns, require(path + ns));
    }
);



app.get("/", function(req, res){
    res.render("indexHeader.ejs", {apiRoute: apiRoute});
});

app.get("/:lookup", function(req, res){
    res.render("resetPasswordHeader.ejs", {apiRoute: apiRoute, lookup: req.params.lookup});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found '+JSON.stringify(req.url));
    err.status = 404;
    next(err);
});



app.use('*', function(req, res){
    console.log("Error trying to display route: "+req.path);
    res.status(404).send("Nothing Found");
});

app.listen(config.app.port);


console.log('Express server running on port '+config.app.port);

