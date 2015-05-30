function DisplayLogs() {

    document.getElementById("errorMsg").innerHTML = "";

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        dispReq = new XMLHttpRequest();
    }


    var host = "http://localhost:50001/displayLogs/";
    dispReq.open('Get', host, true);
    dispReq.send();

    var dispTable = document.getElementById("container");
    dispReq.onreadystatechange = function () {
        if (!(dispReq.readyState == 4 && dispReq.status == 200)) {
        } else {
            var DisplayInfo = jQuery.parseJSON(dispReq.responseText);
            var count = DisplayInfo.length;
            for (i = 0; i < count; i++) {
                var di = DisplayInfo[i];
                var tr = dispTable.insertRow(i + 1);
                var value = '' + di.logID;
                var checkbox = document.createElement("input");

                checkbox.type = "checkbox";    // make the element a checkbox
                checkbox.name = "logMark";      // give it a name we can check on the server side
                checkbox.value = value;         // make its value "pair"

                tr.insertCell(0).innerHTML.checkbox;
                switch (di.LogType) {
                    case 0:
                        tr.insertCell(1).innerHTML = di.date + " " + di.amount + " " +
                            di.name + " added to " + di.customerID + " inventory";
                        break;
                    case 1:
                        tr.insertCell(1).innerHTML = di.date + " " + di.customerID + " audited details";
                        break;
                    case 2:
                        tr.insertCell(1).innerHTML = di.UserName + " left a transaction note on " + di.name;
                        break;
                }

            }

        }

    }

}