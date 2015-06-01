function DisplayLogs(afterdate) {

    document.getElementById("errorMsg").innerHTML = "";

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        dispReq = new XMLHttpRequest();
    }

    var after = '00-00-0000';
    var host = "http://localhost:50001/displayLogs/" + afterdate + "/";
    dispReq.open('Get', host, true);
    dispReq.send();

    var dispTable = document.getElementById("container");
    var tableRows = dispTable.getElementsByTagName('tr');
    var rowCount = tableRows.length;
    // Removes the old static table so a new one can be added.
    for (var x = rowCount - 1; x >= 0; x--) {
        document.getElementById("container").deleteRow(x);
    }

    var row = dispTable.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = "SELECT";
    cell2.innerHTML = "Log Message";

    dispReq.onreadystatechange = function () {
        if (!(dispReq.readyState == 4 && dispReq.status == 200)) {
        } else {
            var DisplayInfo = jQuery.parseJSON(dispReq.responseText);
            var count = DisplayInfo.length;
            for (i = 0; i < count; i++) {
                var di = DisplayInfo[i];
                var tr = dispTable.insertRow(i + 1);
                var value = '' + di.logID;

                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.name = "logMark";
                checkbox.value = value;
                checkbox.id = "id";

                var label = document.createElement('label')
                label.htmlFor = "id";
                var logMessage = "";

                switch (di.LogType) {
                    case 0:
                        logMessage = di.date + " " + di.amount + " " +
                            di.name + " added to " + di.customerID + " inventory";
                        break;
                    case 1:
                        logMessage = di.date + " " + di.customerID + " audited details";
                        break;
                    case 2:
                        logMessage = di.UserName + " left a transaction note on " + di.name;
                        break;
                }

                label.appendChild(document.createTextNode(logMessage));

                row = dispTable.insertRow(i + 1);

                cell1 = row.insertCell(0);
                cell2 = row.insertCell(1);

                cell1.appendChild(checkbox);
                cell2.appendChild(label);

            }

        }

    }

}