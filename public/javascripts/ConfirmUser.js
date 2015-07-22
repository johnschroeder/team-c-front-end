navigation.get(window.apiRoute + '/login/confirmUser/'+window.lookup, function () {
        jQuery('#confirm').text("Thank you for confirming your account!");
    }).fail(function(){jQuery('#confirm').text("An error occured! Please contact your admin!");});