function clearLogs(buttonPressed) {

    document.getElementById("errorMsg").innerHTML = "";

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        dispReq = new XMLHttpRequest();
    }

    var inputs = document.getElementsByTagName("input"); //or document.forms[0].elements;

    var checkedString;
    if (buttonPressed == 1) {
        var cbs = []; //will contain all checkboxes
        var checked = []; //will contain all checked checkboxes
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox") {
                cbs.push(inputs[i]);
                if (inputs[i].checked) {
                    checked.push(inputs[i].value);
                }
            }
        }
        checkedString = checked.join("p"); // p is an arbitrary character, it could be 'q'
    }

    var elmtTable = document.getElementById('container');
    var tableRows = elmtTable.getElementsByTagName('tr');
    var rowCount = tableRows.length;


    if (buttonPressed != 2) {
        // This code was only used for debugging
        // var row =  document.getElementById('container').insertRow(0).insertCell(0).innerHTML = checked[0];

        // document.getElementById('container').insertRow(0).insertCell(0).innerHTML = "Please wait - This may take a minute.";


        if (buttonPressed == 1) {
            checkString = 0;
        }
        var host = "http://localhost:50001/clearLogs/" + buttonPressed + "/" + checkedString + "/";


        dispReq.open('Get', host, true); // async turned off to ensure removal of the html table
        dispReq.send();
    }
    DisplayLogs('0000-00-00');

}

