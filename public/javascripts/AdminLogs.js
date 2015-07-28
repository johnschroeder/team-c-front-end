var counter = 0;
function DisplayNext(log) {

    var rowToCopy = $('.InputChild').first();
    var rowsContainer = '#InputDiv';

    var clonedRow = rowToCopy.clone();
    if (counter == 0)
    {
        $('.InputChild').first().remove();
    }
    clonedRow.find('label').prop('id', 'log' + counter);
    clonedRow.find('label').text(log);

    counter++;

    clonedRow.appendTo(rowsContainer);

}

var DisplayAll =
{
    Now: function () {
        counter = 0;

        navigation.hit("/getAllLogs/", function (logsForUsername) {
                var logsObj = JSON.parse(logsForUsername);
                var logs = logsObj.logs;

            for (var i = logs.length -1; i >= 0; i--) {

                var log = logs[i];
                DisplayNext(log);
            }

            });
    }
};