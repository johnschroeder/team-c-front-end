var Redirect =
{
    Now: function () {
        alert("opened");
        navigation.hit("/getLogs/", function (usernameForLogs) {
            alert("returned");
            navigation.go("Logs.html");
            alert("Should have redirected");
        });

    }
};