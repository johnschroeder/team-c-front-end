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
    }


    document.getElementById("logLabel").innerHTML = log;
    counter++;
}

var DisplayAll =
{
    Now: function () {
        var username = "don"; //  -- This will need to be replaced with a redis call.
        var host = window.apiRoute + "/getLogs/" + username + "/";
        $.get(host, function (logsForUsername) {
            var logsObj = JSON.parse(logsForUsername);
            var logs = logsObj.logs;

            for (var i = 0; i < logs.length; i++) {
                var log = logs[i];
                alert(log);
                DisplayNext(logs[i]);
            }

        });
    },

    Ignore: function () {
        alert("Not Yet Implemented");
    }
};