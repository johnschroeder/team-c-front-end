/**
 * Created by Kun on 7/14/2015.
 */

var manageUsers = {

    navigationArgs: {
    },

    init: function(){
        //initialize page. load all users info
        this.LoadUsers();
        this.PopulatePerms();

    },

    PopulatePerms: function(){
        $.get(window.apiRoute + "/getAllPermissions/", function (resp) {
            var perms = $.parseJSON(resp);


            for (var i = 0; i < perms.length; i++) {
                var obj = perms[i];
                var optionname = obj.PermsID;
                var option = new Option(obj.Perms, obj.PermsID);
                $("#sltPermission").append($(option));

            }

        }).fail(function(res) {
            var msg = "Error: LoadUsers: Connection error.";
            $("#response").text(msg);
            return msg;
        });
    },

    LoadUsers: function(){

        $.get(window.apiRoute + "/getAllUsers/", function (resp) {
            var users = $.parseJSON(resp);

            //hold on to first div
            //clear DisplayUsersDiv
            var rowToCopy = $('.InputChild').first();
            var newRow = rowToCopy.clone();
            var rowsContainer = '#DisplayUsersDiv';
            $("#DisplayUsersDiv").empty();
            newRow.appendTo(rowsContainer);


            //populate users
            for (var i = 0; i < users.length; i++) {
                var obj = users[i];
                var tempRow = newRow.clone();
                $($(tempRow).children()[0]).text(obj.Username);
                $($(tempRow).children()[1]).text(obj.FirstName);
                $($(tempRow).children()[2]).text(obj.LastName);
                $($(tempRow).children()[3]).text(obj.Email);
                $($(tempRow).children()[4]).text(obj.Perms);
                $(tempRow).show();
                tempRow.appendTo(rowsContainer);

            }


        }).fail(function(res) {
            var msg = "Error: LoadUsers: Connection error.";
            $("#response").text(msg);
            return msg;
        });
    },

    EditUser: function(editDiv){

        var usernameForEdit=$(editDiv).parent().children()[0];
        navigation.go("EditUser.html",{PreviousPage:"ManageUsers.html",editUser:usernameForEdit});
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


        //call api route to submitnewuser
        //Do following on success


        //this.AppendNewUser(uname,fname,lname,email,perm);
        this.LoadUsers();//re-load all users
        $('#iptUsername').val('');
        $('#iptFirstName').val('');
        $('#iptLastName').val('');
        $('#iptEmail').val('');
        $('select#sltPermission option').removeAttr("selected");
        $("#divNewUser").hide();
    }


    /*
    AppendNewUser: function(uname, fname, lname, email,perm){
        var rowToCopy = $('.InputChild').first();
        var newRow = rowToCopy.clone();
        var rowsContainer = '#DisplayUsersDiv';
        $($(newRow).children()[0]).text(uname);
        $($(newRow).children()[1]).text(fname);
        $($(newRow).children()[2]).text(lname);
        $($(newRow).children()[3]).text(email);
        $($(newRow).children()[4]).text(perm);
        $(newRow).show();
        newRow.appendTo(rowsContainer);
    }
    */



};