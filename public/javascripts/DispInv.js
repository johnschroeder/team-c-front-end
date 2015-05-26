function DisplayInventory(){

    document.getElementById("errorMsg").innerHTML = "";

    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        dispReq=new XMLHttpRequest();
    }


    var host = "http://localhost:50001/displayInventory/";
    dispReq.open('Get', host, true);
    dispReq.send();
    var dispTable = document.getElementById("container");
    dispReq.onreadystatechange = function(){
        if(dispReq.readyState == 4 && dispReq.status==200) {
            var DisplayInfo = jQuery.parseJSON(dispReq.responseText);
            var count = DisplayInfo[0].length;
            for(i=0; i < count; i++) {
                var tr =dispTable.insertRow(i+1);
                tr.insertCell(0).innerHTML = DisplayInfo[0][i].ProductID;
                tr.insertCell(1).innerHTML = DisplayInfo[0][i].RunID;
                tr.insertCell(2).innerHTML = DisplayInfo[0][i].Amount;
                var datestr = DisplayInfo[0][i].Date.toString();
                tr.insertCell(3).innerHTML = datestr.substr(0, datestr.indexOf("T"));
                tr.insertCell(4).innerHTML = DisplayInfo[0][i].Name;
                tr.insertCell(5).innerHTML = DisplayInfo[0][i].Customer;
                tr.insertCell(6).innerHTML = DisplayInfo[0][i].Description;
                datestr = DisplayInfo[0][i].DateCreated;
                tr.insertCell(7).innerHTML = datestr.substr(0, datestr.indexOf("T"));
            }

        }

    }

}