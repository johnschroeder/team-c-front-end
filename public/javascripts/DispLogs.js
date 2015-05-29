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
        if (dispReq.readyState == 4 && dispReq.status == 200) {
            var DisplayInfo = jQuery.parseJSON(dispReq.responseText);
            var count = DisplayInfo.length;
            for (i = 0; i < count; i++) {
                var tr = dispTable.insertRow(i + 1);
                tr.insertCell(0).innerHTML = "<input type='checkbox' name= 'logMark' + i value='logNumber' + i>"
                tr.insertCell(1).innerHTML = DisplayInfo[i].LogID;
                tr.insertCell(2).innerHTML = DisplayInfo[i].productID;
            }

        }

    }

}