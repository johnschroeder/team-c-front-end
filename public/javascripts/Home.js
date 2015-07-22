var Redirect =
{
    Now: function () {

        navigation.hit("/getLogs/", function (usernameForLogs) {

            navigation.go("Logs.html");
        });

    }
};