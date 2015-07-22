var navigation = {
    stateTable:{},
    go:function(targetPage, args) {
        if(targetPage == "loginForm.html"){
            $("#main_cont").load('/load/' + targetPage, {args:args, state:this.stateTable[targetPage.toLowerCase().split(".")[0]]});
        }
        jQuery.get(window.apiRoute+"/getUserInfo", function(result){
            jQuery('#loggedIn').toggle(true);
            jQuery('#login').toggle(false);
            jQuery('#usersName').text(function(){return result.FirstName+" "+result.LastName});
            jQuery.get(window.apiRoute+ "/checkPermissions/" + targetPage + "/" + result.PermsID,function(res){
                if(res !== "Success"){
                    navigation.go("Home.html");

                }
                else {
                    $("#main_cont").load('/load/' + targetPage, {
                        args: args,
                        state: navigation.stateTable[targetPage.toLowerCase().split(".")[0]]
                    });
                }
            });
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
