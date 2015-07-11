/**
 * Created by Trevor on 7/10/2015.
 */
var editUser = {
    init: function () {
        $("#username").text(window.args.editUser);

        var host = window.apiRoute + "/getUser/" + window.args.editUser;

        $.get(host, function (data) {
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
        var perms = 601;

        var host = window.apiRoute + '/editUser/' +
            '"' + username + '"' + '/'
            + '"' + newFirstName + '"' + '/'
            + '"' + newLastName + '"' + '/'
            + perms + '/' + isConfirmed;

        $.get(host, function (data) {
            callback(data);
        });
    },

    save: function () {
        var message = editUser._submitChanges("true", function (message) {
            alert(message);
        });
    },

    delete: function () {
        var message = editUser._submitChanges("false", function (message) {
            alert(message);
        });
    },

    back: function () {
        navigation.go(window.args.previousPage);
    }
};
