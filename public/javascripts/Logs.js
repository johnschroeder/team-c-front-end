var counter = 0;
function DisplayNext(log) {

    var rowToCopy = $('.InputChild').first();
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