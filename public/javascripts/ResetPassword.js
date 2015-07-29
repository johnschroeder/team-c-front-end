if(window.lookup){
    jQuery('#complete').show();
}
else{
    jQuery("#start").show();
}

jQuery('#complete').submit(function(){
    if(jQuery('#newpw').val() == jQuery('#confirm').val()) {
        var toPass = {
            "lookup": window.lookup,
            "password": jQuery('#newpw').val()
        };
        navigation.postJSON(window.apiRoute + '/login/completepasswordreset/', toPass, function(err, response) {
            if(response){
                jQuery("#formContainer").innerHTML("Your password was reset.");
            }
            else{
                jQuery("#formContainer").innerHTML("Something went wrong please contact the site admin.");
                console.log(err);
            }
        })
    }
    else{
        window.alert("Please try again, the passwords did not match");
    }
});

jQuery('#start').submit(function(){
    navigation.postJSON(window.apiRoute+"/Login/StartPasswordReset/", {username:jQuery('#username').val()}, function(err, response) {
        if(response){
            jQuery("#formContainer").innerHTML("Please check your email for a password reset link");
        }
        else{
            jQuery("#formContainer").innerHTML("Something went wrong please contact the site admin.");
            console.log(err);
        }
    })
});