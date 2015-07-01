jQuery.ajax({
    type: "POST",
    url: window.apiRoute + '/login/confirmUser/',
    data: {
        lookup:window.lookup
    },
    dataType: 'json',
    success: function () {
        window.alert("User Added");
    }
});