/**
 * Created by Trevor on 7/3/2015.
 */
/**
 * Add another row to the pull menu through cloning
 */

var DisplayAll =
{
    Now: function () {
        var username = "don";
        var host = window.apiRoute + "/getLogs/" + username + "/";
        //alert(host);
        $.get(host, function (logsForUsername) {
            alert(logsForUsername);
            var logs = JSON.parse(logsForUsername);
            //alert(logs);
            alert("Logs length " + logs.length);

            for (var i = 0; i < logs.length; i++) {
                var log = logs[i].value;
                alert(log);
                //this.DisplayNext(logs[i].value);
            }

        });
    },
    DisplayNext: function (logText) {

        var rowToCopy = $('.InputChild').first(); //Grab the first InputChild row to duplicate
        var rowsContainer = '#InputDiv';
        // rowToCopy.text(logText);

        rowToCopy.clone().appendTo(rowsContainer);
    }
};