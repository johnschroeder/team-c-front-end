var Redirect =
{
    Now: function () {

        navigation.get("/getLogs/" + JSON.stringify({"filter":[]}), function (err, usernameForLogs) {
            if(err){
                console.log(err);
            }
            else {
                navigation.go("Logs.html");
            }
        });

    }
};