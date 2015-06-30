if(window.lookup){
    jQuery('#complete').show();
}
else{
    jQuery("#start").show();
}

jQuery('#complete').submit(function(){
    jQuery.get(window.apiRoute+"/Login/TestResetIdentifier/"+window.lookup, function(result){
        if(jQuery('#newpw').val() == jQuery('#confirm').val()) {
            var toPass = {
                "email": result,
                "password": jQuery('#newpw').val()
            };
            console.log(toPass);
            jQuery.ajax({
                type: "POST",
                url: window.apiRoute + '/login/completepasswordreset/',
                data: toPass,
                dataType: 'json',
                success: function () {
                    window.alert("User Added");
                }
            });
        }
        else{
            window.alert("Please try again, the passwords did not match");
        }
    });
});

jQuery('#start').submit(function(){
    jQuery.get(window.apiRoute+"/Login/StartPasswordReset/"+jQuery('#email').val());
});