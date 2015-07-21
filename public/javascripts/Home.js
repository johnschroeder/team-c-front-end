var Redirect =
{
    Now: function () {

        navigation.hit("/getLogs/", function (usernameForLogs) {

            navigation.go("AdminLogs.html");
        });

    }
};