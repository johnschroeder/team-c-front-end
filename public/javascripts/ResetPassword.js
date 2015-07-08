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
        jQuery.ajax({
            type: "POST",
            url: window.apiRoute + '/login/completepasswordreset/',
            data: toPass,
            dataType: 'json',
            success: function(){ window.alert("Your password was reset.")},
            error: function(){window.alert("Something went wrong please contact the site admin.")}
        })
    }
    else{
        window.alert("Please try again, the passwords did not match");
    }
});

jQuery('#start').submit(function(){
    jQuery.ajax({
        type: "POST",
        url: window.apiRoute+"/Login/StartPasswordReset/",
        data: {email:jQuery('#email').val()},
        dataType: 'json',
        success: function(){ window.alert("Please check your email for a password reset link")},
        error: function(){window.alert("Something went wrong please contact the site admin.")}
    })
});