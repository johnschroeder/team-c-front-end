var editUser = {
    init: function () {
        navigation.setTitle("User Data: " + window.args.editUser)
        $("#username").text(window.args.editUser);

        var host = window.apiRoute + "/getUser/" + window.args.editUser;

        navigation.get(host, function (err, data) {
            if(data) {
                var userData = $.parseJSON(data);

                var firstName = userData.firstName;
                var lastName = userData.lastName;
                var permsId = userData.permsId;


                $("#FirstName").val(firstName);
                $("#LastName").val(lastName);
                $('select option[value="' + permsId + '"]').attr("selected", true);
            }
        });

    },

    _submitChanges: function (requestDelete, callback) {
        var username = $("#username").text();
        var newFirstName = $("#FirstName").val();
        var newLastName = $("#LastName").val();

        var dropdown = document.getElementById("permission_select");
        var perms = dropdown.options[dropdown.selectedIndex].value;

        //alert("Permissions string is " + perms);

        var host = window.apiRoute + '/editUser/' +
            '"' + username + '"' + '/'
            + '"' + newFirstName + '"' + '/'
            + '"' + newLastName + '"' + '/'
            + perms + '/' + requestDelete;

        alert(host);

        navigation.get(host, function (err, data) {
            if(data) {
                callback(data);
            }
        });
    },

    save: function () {
        if (confirm('Do you really want to make these edits?')) {

            var message = editUser._submitChanges(0, function (message) {
                alert(message);
            });
        }
    },

    delete: function () {
        if (confirm('Do you really want to delete this user?')) {
            var message = editUser._submitChanges(1, function (message) {
                alert(message);
            });
        }
    }
};
