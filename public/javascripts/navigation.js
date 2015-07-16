var navigation = {
    stateTable:{},
    go:function(targetPage, args) {
        $("#main_cont").load('/load/' + targetPage, {args:args, state:this.stateTable[targetPage.toLowerCase().split(".")[0]]});
        jQuery.get(window.apiRoute+"/getUserInfo", function(result){
            jQuery('#loggedIn').toggle(true);
            jQuery('#login').toggle(false);
            jQuery('#usersName').text(function(){return result.FirstName+" "+result.LastName});
        }).fail(function(){
            jQuery('#login').toggle(true);
            jQuery('#loggedIn').toggle(false);
        });
    },
    saveState:function(state) {
        this.stateTable[window.thisPage.toLowerCase().split(".")[0]] = state;
    },
    hit:function(route,callback){
        $.get(window.apiRoute + route, function(err,result){
            console.log("err status:" + err.status);
            if(err.status == 511){
                console.log("Access Denied!");
                navigation.go("Home.html");
            }
            if(err.status == 510){
                navigation.go("loginForm.html");
            }
            console.log("results: " + JSON.parse(result).CartID);
            callback(null,result);

        });

    }
}