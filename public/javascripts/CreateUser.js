jQuery('#createUser').submit(function(){
    var toPass = {
        "username":jQuery('#username').val(),
        "password":jQuery('#password').val(),
        "email":jQuery('#email').val(),
        "firstName":jQuery('#first').val(),
        "lastName":jQuery('#last').val()
    };
    navigation.postJSON(window.apiRoute+'/login/createUser/', toPass, function(err, res){
        if(err){
            jQuery("#mainContainer").innerHTML("An error occured, check the console for error message.");
            console.log(err);
        }
        if(res) {
            jQuery("#mainContainer").innerHTML("Please have user check their email for an account creation confirmation.");
        }
    });
});
