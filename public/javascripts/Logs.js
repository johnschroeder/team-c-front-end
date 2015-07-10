var firstLog = true;
function DisplayNext(log) {

    if (firstLog) {
        document.getElementById("logLabel").innerHTML = log;

        firstLog = false;
    }
    else {
        var rowToCopy = $('.InputChild').first();
        var rowsContainer = '#InputDiv';

        var clonedRow = rowToCopy.clone();
        clonedRow.appendTo(rowsContainer);
        document.getElementById("logLabel").innerHTML = log;
    }

}

var DisplayAll =
{
    Now: function () {
        var host = window.apiRoute + "/getLogs/";


        $.get(host, function (logsForUsername) {
                var logsObj = JSON.parse(logsForUsername);
                var logs = logsObj.logs;


            for (var i = 0; i < logs.length; i++) {

                    var log = logs[i];
                    DisplayNext(log);
                }

            });
    },

    Ignore: function () {
        alert("Not Yet Implemented");
    }
};