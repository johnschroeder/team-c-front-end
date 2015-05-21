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

    var host = "http://localhost:50001/displayInventory/";
    dispReq.open('Get', host, true);
    dispReq.send();
    var dispTable = document.getElementById("container");
    dispReq.onreadystatechange = function(){
        if(dispReq.readyState == 4 && dispReq.status==200) {
            var DisplayInfo = JSON.parse(dispReq.responseText);
            var count = DisplayInfo.length;
            for(i= 0; i < count; i++) {
                var tr =dispTable.insertRow(i);
                tr.insertCell(0).innerHTML = DisplayInfo[i];
                tr.append("<td>" + json[i].RunID + "</td>");
                tr.append("<td>" + json[i].Amount + "</td>");
                tr.append("<td>" + json[i].Date + "</td>");
                tr.append("<td>" + json[i].Name + "</td>");
                tr.append("<td>" + json[i].Customer + "</td>");
                tr.append("<td>" + json[i].Description + "</td>");
                tr.append("<td>" + json[i].DateCreated + "</td>");
                $('table').append(tr);
                $(table).append("<tr>" + DisplayInfo[i] + "</tr>");
            }

        }

    }

}