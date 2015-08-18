if(window.pageKey){
    jQuery('#complete').show();
}
else{
    jQuery("#start").show();
}

var completeReset = function(){
    if(jQuery('#newpw').val() == jQuery('#confirm').val()) {
        console.log(window.pageKey)
        var toPass = {
            "lookup": window.pageKey,
            "password": jQuery('#newpw').val()
        };
        navigation.postJSON(window.apiRoute + '/login/completepasswordreset/', toPass, function(err, response) {
            if(response){
                jQuery("#formContainer").hmtl("Your password was reset.");
            }
            else{
                jQuery("#formContainer").html("Something went wrong please contact the site admin.");
                console.log(err);
            }
        })
    }
    else{
        window.alert("Please try again, the passwords did not match");
    }
};

var startReset = function(){
    navigation.postJSON(window.apiRoute+"/Login/StartPasswordReset/", {username:jQuery('#username').val()}, function(err, response) {
        if(response){
            jQuery("#formContainer").html("Please check your email for a password reset link");
        }
        else{
            jQuery("#formContainer").html("Something went wrong please contact the site admin.");
            console.log(err);
        }
    })
};