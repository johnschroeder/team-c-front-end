var express = require("express");
var router = express.Router();


router.route("/").post(function(req,res){
    res.render("Home.html", req.body);
});


module.exports = router;