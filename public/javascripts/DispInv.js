function DisplayInventory(){

    document.getElementById("errorMsg").innerHTML = "";

    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        dispReq=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        dispReq=new ActiveXObject("Microsoft.XMLHTTP");
    }

    var host = "localhost:50001/displayInventory/";
    dispReq.open('Get', host, true);
    dispReq.send();
    var dispTable = document.getElementById("container");
    dispReq.onreadystatechange = function(){
        if(dispReq.readyState == 4 && dispReq.status==200) {
            var DisplayInfo = jQuery.parseJSON(dispReq.responseText);
            var count = DisplayInfo.length;
            for(i= 0; i < count; i++) {
                var tr =dispTable.insertRow(i);
                tr.insertCell(0).innerHTML = DisplayInfo[i].ProductID;
                tr.insertCell(1).innerHTML = DisplayInfo[i].RunID;
                tr.insertCell(2).innerHTML = DisplayInfo[i].Amount;
                tr.insertCell(3).innerHTML = DisplayInfo[i].Date;
                tr.insertCell(4).innerHTML = DisplayInfo[i].Name;
                tr.insertCell(5).innerHTML = DisplayInfo[i].Customer;
                tr.insertCell(6).innerHTML = DisplayInfo[i].Description;
                tr.insertCell(7).innerHTML = DisplayInfo[i].DateCreated;
            }

        }

    }

}