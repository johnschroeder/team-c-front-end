navigation.get(window.apiRoute + '/login/confirmUser/'+window.lookup, function (err, res) {
    if(err){
        jQuery('#confirm').text("An error occured! Please contact your admin!");
    }
    else
    {
        navigation.postJSON(window.apiRoute+"/Login/StartPasswordReset/", {username:res.username}, function(err, response) {
            if(response){
                jQuery("#formContainer").innerHTML("Please check your email for a link to set your password");
            }
            else{
                jQuery("#formContainer").innerHTML("Something went wrong please contact the site admin.");
                console.log(err);
            }
        })
    }
});