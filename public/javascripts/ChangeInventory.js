function init() {
    $("#addRun").show();
    $("#addBatch").hide();
}

function showAddRun() {
    $("#addRun").show();
    $("#addBatch").hide();
}

function showAddBatch() {
    $("#addRun").hide();
    $("#addBatch").show();
}

function submitAddRun() {
    var inventoryId = parseInt($("#inventoryId").val());
    var runId = parseInt($("#runId").val());
    var runDate = $("#runDate").val();

    if (window.XMLHttpRequest) {
        dispReq = new XMLHttpRequest();
    }

    var host = "http://localhost:50001/addRun/" + inventoryId + "/" + runId + "/" + runDate;
    dispReq.open("Get", host, true);
    dispReq.send();
    dispReq.onreadystatechange = function() {
        if(dispReq.readyState == 4 && dispReq.status == 200) {
            $("#addRunResponse").text("Success")
        } else {
            $("#addRunResponse").text("Failed")
        }
    }
}

function submitAddBatch() {
    var inventoryId = parseInt($("#inventoryId").val());
    var batchRunId = parseInt($("#batchRunId").val());
    var batchAmount = parseInt($("#batchAmount").val());
    var batchLocation = $("#batchLocation").val();

    if (window.XMLHttpRequest) {
        dispReq = new XMLHttpRequest();
    }

    var host = "http://localhost:50001/addBatch/" + inventoryId + "/" + batchRunId + "/" + batchAmount + "/" + batchLocation;
    dispReq.open("Get", host, true);
    dispReq.send();
    dispReq.onreadystatechange = function() {
        if(dispReq.readyState == 4 && dispReq.status == 200) {
            $("#addBatchResponse").text("Success")
        } else {
            $("#addBatchResponse").text("Failed")
        }
    }
}