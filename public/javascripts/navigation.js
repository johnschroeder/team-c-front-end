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
                console.log(result.isConfirmed);
                if(result.isConfirmed == 1) {
                    jQuery('#loggedIn').toggle(true);
                    jQuery('#login').toggle(false);
                    jQuery('#usersName').text(function () {
                        return result.FirstName + " " + result.LastName
                    });
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
    hit:function(route,callback){
        $.get(window.apiRoute + route, function(res){
                callback(res);
        }).fail(function(res){
            if(res.status == 511){
                console.log("Access Denied!");
                alert("Sorry your permission level doesn't allow you to access" + route);
               //navigation.go("Home.html");
            }
            if(res.status == 510){
                navigation.go("loginForm.html");
                alert("You have to log in before you can see this page!");
            }
        })

    }
}
