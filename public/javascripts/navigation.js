var navigation = {
    stateTable:{},
    go:function(targetPage, args) {
        if(targetPage == "loginForm.html"){
            $("#main_cont").load('/load/' + targetPage, {args:args, state:this.stateTable[targetPage.toLowerCase().split(".")[0]]});
            jQuery('#login').toggle(true);
            jQuery('#loggedIn').toggle(false)
        }
        else {
            jQuery.get(window.apiRoute + "/getUserInfo", function (result) {
                if(result.isConfirmed == 1) {
                    jQuery('#loggedIn').toggle(true);
                    jQuery('#login').toggle(false);
                    jQuery('#usersName').text(function () {
                        return result.FirstName + " " + result.LastName
                    });
                    jQuery("#AdminBar").removeClass("hidden");
                    jQuery.get(window.apiRoute + "/checkPermissions/" + targetPage + "/" + result.PermsID, function (res) {
                        $("#main_cont").load('/load/' + targetPage, {
                            args: args,
                            state: navigation.stateTable[targetPage.toLowerCase().split(".")[0]]
                        });
                    }).fail(function () {
                        alert("Your permission level doesn't allow you to access this page");
                        navigation.go("Home.html");
                    });
                }
                else{
                    alert("Your account has been created but not yet confirmed. Please check your email and confirm your account.");
                    jQuery('#login').toggle(true);
                    jQuery('#loggedIn').toggle(false);
                }
            }).fail(function () {
                navigation.go("loginForm.html")
                jQuery('#login').toggle(true);
                jQuery('#loggedIn').toggle(false);
            });
        }
    },
    saveState:function(state) {
        this.stateTable[window.thisPage.toLowerCase().split(".")[0]] = state;
    },
    get:function(route, callback){
        this._ajax(route, 'GET', null, null, callback);
    },
    getJSON:function(route, callback){
        this._ajax(route, 'GET', null, 'json', callback);
    },
    postJSON:function(route, callback){
        this._ajax(route, 'POST', null, 'json', callback);
    },
    post:function(route, data, callback){
        this._ajax(route, 'POST', data, null, callback);
    },
    put:function(route, data, callback) {
        this._ajax(route, 'PUT', data, null, callback);
    },
    _ajax: function(route, method, data, dataType, callback){
        params = {};

        if(data != null && typeof data != 'undefined'){
            params.data = data;
        }
        if(route.indexOf(window.apiRoute) < 0){
            route = window.apiRoute+route;
        }
        params.url = route;

        method = method.toUpperCase();
        if(['GET', 'POST', 'PUT'].indexOf(method) < 0){
            method = 'GET';
        }
        params.method = method;

        if(dataType != null && typeof dataType != 'undefined'){
            params.dataType = dataType;
        }

        $.ajax(params)
            .done(function(res){callback(null, res)})
            .fail(function(err){
                if(res.status == 511){
                    console.log("Access Denied!");
                    alert("Sorry your permission level doesn't allow you to access this page.");
                    navigation.go("Home.html");
                }
                else if(res.status == 510){
                    navigation.go("loginForm.html");
                    alert("You have to log in before you can see this page!");
                }
                else{
                    callback(err, null);
                }
            })
    },
    checkImage: function( src, onLoad, onError ) {

        var img = new Image();

        img.onload = onLoad;
        img.onerror = onError;
        img.src = src;

    },
    makeImageURL: function( productID ) {
        return 'http://images.thisisimp.com.s3.amazonaws.com/'+productID+'.jpeg';
    }
};
