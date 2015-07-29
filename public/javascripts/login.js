/**
 * Created by Trevor on 6/26/2015.
 */
function sendAuth() {

    $(document).ready(function () {
        var user, pass;

        user = $("#username").val();
        pass = $("#password").val();
        var host = window.apiRoute + "/login/login/";

        navigation.post(host, {user: user, password: pass},
            function (err, data) {
                if(data) {
                    var cookie = data; //req.cookies.auth

                    if (data != "Invalid Credentials!") {
                        navigation.go("Home.html");
                        alert("login success");
                    }

                    if (data == "Invalid Credentials!") {
                        $("#invalidCreds").removeClass("hidden");
                    }
                }
            }
        );
        $("#username").val("");
        $("#password").val("");
    });
}
