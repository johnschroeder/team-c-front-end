/**
 * Created by js22 on 6/16/15.
 */
var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/:page").post(function(req,res){
    var obj = {toPass:req.body, thisPage:req.params.page};
    console.log(obj);
    res.render("loadSubPage.ejs", obj);
});

module.exports = router;
