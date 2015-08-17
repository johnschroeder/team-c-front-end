/**
 * Created by Kun on 7/14/2015.
 */

var manageUsers = {

    navigationArgs: {
    },

    init: function(){
        navigation.setTitle("Manage Users");
        //initialize page. load all users info
        this.LoadUsers();
        this.PopulatePerms();
    },

    PopulatePerms: function(){
        navigation.get(window.apiRoute + "/getAllPermissions/", function (err, resp) {
            if(err){
                var msg = "Error: LoadUsers: Connection error.";
                $("#response").text(msg);
                return msg;
            }
            else {
                var perms = $.parseJSON(resp);


                for (var i = 0; i < perms.length; i++) {
                    var obj = perms[i];
                    var optionname = obj.PermsID;
                    var option = new Option(obj.Perms, obj.PermsID);
                    $("#sltPermission").append($(option));

                }
            }
        })
    },

    LoadUsers: function() {
        LoadUsers("default");
    },

    LoadUsers: function(filterType){
        var route;
        switch (filterType) {
            case "First Name":
                route = "getAllUsersFilterFirstName";
                break;
            case "Last Name":
                route = "getAllUsersFilterLastName";
                break;
            default:
                route = "getAllUsers";
                break;
        }

        navigation.get(window.apiRoute + "/" + route + "/", function (err, resp) {
            if(err){
                var msg = "Error: LoadUsers: Connection error.";
                $("#response").text(msg);
                return msg;
            }
            else {
                var users = $.parseJSON(resp);

                //hold on to first div
                //clear DisplayUsersDiv
                var rowToCopy = $('.InputChild').first();
                var newRow = rowToCopy.clone();
                var rowsContainer = '#DisplayUsersDiv';
                $("#DisplayUsersDiv").empty();
                newRow.appendTo(rowsContainer);

                function permsName(perms) {
                    switch (perms) {
                        case 0:
                            return 'Customer';
                        case 1:
                            return 'Account Manager';
                        case 2:
                            return 'Employee';
                        case 3:
                            return 'Admin';
                        default:
                            return "Level: " + perms;
                    }
                }

                //populate users
                for (var i = 0; i < users.length; i++) {
                    var obj = users[i];
                    var tempRow = newRow.clone();
                    $($(tempRow).children()[0]).text(obj.Username);
                    $($(tempRow).children()[1]).text(obj.FirstName);
                    $($(tempRow).children()[2]).text(obj.LastName);
                    $($(tempRow).children()[3]).text(obj.Email);
                    $($(tempRow).children()[4]).text(permsName(obj.Perms));
                    $(tempRow).show();
                    tempRow.appendTo(rowsContainer);
                }
            }
        })
    },

    EditUser: function(editDiv){
        var usernameForEdit= $(editDiv).parent().children()[0].innerHTML;
        navigation.go("EditUser.html",{editUser:usernameForEdit});
    },

    CreateUser: function(){
        $("#divNewUser").show();
    },

    SubmitNewUser: function(){

        var uname = $('#iptUsername').val();
        var fname = $('#iptFirstName').val();
        var lname = $('#iptLastName').val();
        var email = $('#iptEmail').val();
        var perm = $('#sltPermission').text();
        var permID = $('#sltPermission').val();

        if(uname=="")
        {
            alert("username is a required field.");
            return;
        }
        if(fname=="")
        {
            alert("First name is a required field.");
            return;
        }
        if(lname=="")
        {
            alert("Last name is a required field.");
            return;
        }
        if(email=="")
        {
            alert("Email is a required field.");
            return;
        }
        if(perm=="")
        {
            alert("Permission is a required field.");
            //return;
        }

        var toPass = {
            "username":uname,
            "password":"0000",
            "email":email,
            "firstName":fname,
            "lastName":lname,
            "permID":permID
        };



       // var createUserArgs = JSON.stringify(toPass);
        //alert(createUserArgs);
        navigation.post(window.apiRoute+'/Login/createUser/', toPass, function(err, res){
                if(err) {
                    window.alert("Error: "+error);
                    this.LoadUsers();
                }
                else{
                    window.alert("User "+uname+" is created. Email confirmation is required to complete registration.");
                    this.LoadUsers();//re-load all users
                    $('#iptUsername').val('');
                    $('#iptFirstName').val('');
                    $('#iptLastName').val('');
                    $('#iptEmail').val('');
                    $('select#sltPermission option').removeAttr("selected");
                    $("#divNewUser").hide();
                }
        });


    }


};
