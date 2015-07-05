/**
 * Created by Trevor on 7/3/2015.
 */
/**
 * Add another row to the pull menu through cloning
 */

var counter = 0; // I know, I know
function DisplayNext(log) {

    var rowToCopy = $('.InputChild').first(); //Grab the first InputChild row to duplicate
    var rowsContainer = '#InputDiv';

    var clonedRow = rowToCopy.clone();

    if (counter != 0) {
        clonedRow.appendTo(rowsContainer);
        alert(counter);
    }


    document.getElementById("logLabel").innerHTML = log;
    counter++;
}

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
            //alert("Logs length " + logs.length);

            for (var i = 0; i < logs.length; i++) {
                var log = logs[i].value;
                alert(log);
                DisplayNext(logs[i].value);
            }

        });
    },

};