/**
 * Created by js22 on 6/16/15.
 */
var express = require("express");
var router = express.Router();
var config = require('konfig')();

router.route("/:lookup").get(function(req,res){
    res.render("Confirm.ejs", {apiRoute: config.app.api, lookup:req.params.lookup});
});

module.exports = router;
