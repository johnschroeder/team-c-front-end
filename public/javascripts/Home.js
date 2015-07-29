var Redirect =
{
    Now: function () {

        navigation.get("/getLogs/", function (err, usernameForLogs) {
            if(err){
                console.log(err);
            }
            else {
                navigation.go("Logs.html");
            }
        });

    }
};