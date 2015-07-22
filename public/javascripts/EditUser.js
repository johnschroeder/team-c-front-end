/**
 * Created by Trevor on 7/10/2015.
 */
var editUser = {
    init: function () {
        $("#username").text(window.args.editUser);

        var host = "/getUser/" + window.args.editUser;

        navigation.hit(host, function (data) {
            var userData = $.parseJSON(data);

            var firstName = userData.firstName;
            var lastName = userData.lastName;


            $("#FirstName").val(firstName);
            $("#LastName").val(lastName);
        });

    },

    _submitChanges: function (isConfirmed, callback) {
        var username = $("#username").text();
        var newFirstName = $("#FirstName").val();
        var newLastName = $("#LastName").val();

        var dropdown = document.getElementById("permission_select");
        var perms = dropdown.options[dropdown.selectedIndex].value;

        //alert("Permissions string is " + perms);

        var host ='/editUser/' +
            '"' + username + '"' + '/'
            + '"' + newFirstName + '"' + '/'
            + '"' + newLastName + '"' + '/'
            + perms + '/' + isConfirmed;

        //alert(host);

        navigation.hit(host, function (data) {
            callback(data);
        });
    },

    save: function () {
        if (confirm('Do you really want to make these edits?')) {

            var message = editUser._submitChanges(1, function (message) {
                alert(message);
            });
        }
    },

    delete: function () {
        if (confirm('Do you really want to delete this user?')) {
            var message = editUser._submitChanges(0, function (message) {
                alert(message);
            });
        }
    },


    back: function () {
        navigation.go(window.args.previousPage);
    }
};
