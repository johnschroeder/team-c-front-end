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
                        navigation.get("/getUserInfo", function(err,user) {
                            if(err){
                                console.log(err);
                            }
                            if (user.PermsID == 604) {
                                $("#AdminBar").removeClass("hidden");
                                $("#AdminLogs").removeClass("hidden");
                                $("#AddUsers").removeClass("hidden");
                                $("#DeleteUsers").removeClass("hidden");
                                $("#ViewUsers").removeClass("hidden");
                            }
                        });
                        navigation.go("Home.html");
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
