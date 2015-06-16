/**
 * Created by js22 on 6/16/15.
 */
var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/home").post(function(req,res){
    res.render("Home.html", req.body);
});

module.exports = router;
