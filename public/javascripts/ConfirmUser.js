navigation.get(window.apiRoute + '/login/confirmUser/'+window.lookup, function (err, res) {
    if(err){
        jQuery('#confirm').text("An error occured! Please contact your admin!");
    }
    else
    {
        jQuery('#confirm').text("Thank you for confirming your account!");
    }
});