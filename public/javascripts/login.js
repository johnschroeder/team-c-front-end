/**
 * Created by Trevor on 6/26/2015.
 */


var login = {
    posting: false,
    init: function() {
        navigation.setTitle("Welcome to Login!");
        var self = this;

        $("#username, #password").keypress(function(e) {
            if (e.which == 13) {
                self.sendAuth();
            }
        });
    },

    sendAuth: function() {
        var self = this;

        $(document).ready(function () {
            if (self.posting) return;

            self.posting = true;
            $("#invalidCreds").addClass("hidden");

            var user = $("#username").val();
            var pass = $("#password").val();
            var host = window.apiRoute + "/login/login/";

            navigation.post(host, {user: user, password: pass},
                function (err, data) {
                    if(data) {
                        var cookie = data; //req.cookies.auth

                        if (data == "Invalid Credentials!") {
                            $("#invalidCreds").removeClass("hidden");
                            self.posting = false;
                        } else {
                            navigation.get("/getUserInfo", function(err,user) {
                                if(err){
                                    console.log(err);
                                }

                                if (user.PermsID == 604) {
                                    $("#AdminBar").removeClass("hidden");
                                    $("#AdminLogs").removeClass("hidden");
                                    $("#ManageUsers").removeClass("hidden");
                                }
                            });

                            navigation.go("Home.html");
                        }
                    }
                }
            );

            $("#username").val("");
            $("#password").val("");
        });
    }
};
