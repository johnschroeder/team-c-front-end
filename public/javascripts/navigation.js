var navigation = {
    stateTable:{},
    go:function(targetPage, args) {
        jQuery.get(window.apiRoute+"/getUserInfo", function(result){
            jQuery('#loggedIn').toggle(true);
            jQuery('#login').toggle(false);
            jQuery('#usersName').text(function(){return result.FirstName+" "+result.LastName});
        }).then(function(result){
            jQuery.get(window.apiRoute+ "/checkPermissions/" + targetPage + "/" + result.PermsID,function(res){
                console.log(res);

                if(res !== "Success"){
                    console.log("denied");
                    $("#main_cont").load('/load/' + "Home.html");
                }
                else{
                    console.log("went through");
                    $("#main_cont").load('/load/' + targetPage, {args:args, state:this.stateTable[targetPage.toLowerCase().split(".")[0]]});
                    console.log(res);
                }

            })
        }).fail(function(){
            jQuery('#login').toggle(true);
            jQuery('#loggedIn').toggle(false);
        });
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
                alert("Sorry your permission level doesn't allow you to access this page.");
                navigation.go("Home.html");
            }
            if(res.status == 510){
                navigation.go("loginForm.html");
                alert("You have to log in before you can see this page!");
            }
        })

    }
}
