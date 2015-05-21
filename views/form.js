function SubmitForm()
{
    document.getElementById("errorMsg").innerHTML = "";
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        submitReq=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        submitReq=new ActiveXObject("Microsoft.XMLHTTP");
    }

    var jobID = document.getElementById("joNum").value.concat("/");
    var Description = document.getElementById("description").value.concat("/");
    var employeeName = document.getElementById("user").value.concat("/");
    var host = "http://localhost:50001/submitForm/";
    var requStr = host.concat(jobID).concat(Description).concat(employeeName);

    submitReq.open('GET', requStr, true);
    submitReq.send();

    submitReq.onreadystatechange = function() {
        if ( submitReq.readyState == 4) {
            if(submitReq.responseText.localeCompare('Success!')===0)
                document.getElementById("initialForm").innerHTML=submitReq.responseText;
            else
                document.getElementById("errorMsg").innerHTML=submitReq.responseText;
        }
    }
}
