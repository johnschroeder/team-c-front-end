/**
 * Created by Trevor on 6/26/2015.
 */
function sendAuth() {

    $(document).ready(function () {
        var user, pass;

        user = $("#username").val();
        pass = $("#password").val();
        var host = window.apiRoute + "/login/";
        $.post('http://localhost:50001/login', {user: user, password: pass},
            function (data) {
                if (data === 'done') {
                    alert("login success");
                }
            }
        );
    });
}