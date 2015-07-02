jQuery('#createUser').submit(function(){
    var toPass = {
        "username":jQuery('#username').val(),
        "password":jQuery('#password').val(),
        "email":jQuery('#email').val(),
        "firstName":jQuery('#first').val(),
        "lastName":jQuery('#last').val()
    };
    console.log(toPass);
    jQuery.ajax({
        type: "POST",
        url: window.apiRoute+'/login/createUser/',
        data: toPass,
        dataType: 'json',
        success: function(){
            window.alert("User Added");
        }
    });
});