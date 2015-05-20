
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

    dispReq.onreadystatechange= function(){
        if(dispReq.readyState == 4 && dispReq.status==200) {
            var DisplayInfo =JSON.parse(dispReq.responseText);
        }
        

    }

}