var mode = "";

function init() {
    processParams();
}

function processParams() {
    var params = getParams();
    if (params.mode) {
        changeMode(params.mode);
    }

    if (params.inventoryId) {
        $("#inventoryId").val(parseInt(params.inventoryId));
    }

    if (params.runId) {
        $("#runId").val(parseInt(params.runId));
    }

    if (params.runDate) {
        $("#runDate").val(params.runDate);
    }

    if (params.batchAmount) {
        $("#batchAmount").val(parseInt(params.batchAmount));
    }

    if (params.batchLocation) {
        $("#batchLocation").val(params.batchLocation);
    }
}

function getParams() {
    var params = {};
    location.search.substr(1).split("&").forEach(function(each) {
        if (each !== "") {
            var pair = each.split("=");
            params[pair[0]] = pair[1];
        }
    });

    return params;
}

function changeMode(newMode) {
    hideAllFields();

    mode = newMode;

    switch (mode) {
        case "addRun":
            $("#modeHeading").text("Add Run");
            $("#inventoryIdField").show();
            $("#runDateField").show();
            break;
        case "removeRun":
            $("#modeHeading").text("Remove Run");
            $("#runIdField").show();		
            break;
        case "addBatch":
            $("#modeHeading").text("Add Batch");
            $("#runIdField").show();
            $("#batchAmountField").show();
            $("#batchLocationField").show();
            break;
        case "removeBatch":
            $("#modeHeading").text("Remove Batch");
            $("#runIdField").show();
            $("#batchAmountField").show();
            $("#batchLocationField").show();		
            break;
        default:
            $("#input").hide();
            return;
            break;
    }

    $("#input").show();
}

function hideAllFields() {
    $("#inventoryIdField").hide();
    $("#runIdField").hide();
    $("#runDateField").hide();
    $("#batchAmountField").hide();
    $("#batchLocationField").hide();
}

function submit() {
    var inventoryId = parseInt($("#inventoryId").val());
    var runId = parseInt($("#runId").val());
    var runDate = $("#runDate").val();
    var batchAmount = parseInt($("#batchAmount").val());
    var batchLocation = $("#batchLocation").val();

    var host;

    switch (mode) {
        case "addRun":
            host = "http://localhost:50001/addRun/" + inventoryId + "/" + runDate;
            break;
        case "removeRun":
            host = "http://localhost:50001/removeRun/" + runId		
            break;
        case "addBatch":
            host = "http://localhost:50001/addBatch/" + runId + "/" + batchAmount + "/" + batchLocation;
            break;
        case "removeBatch":
            host = "http://localhost:50001/removeBatch/" + runId + "/" + batchAmount + "/" + batchLocation;
            break;
        default:
            $("#response").text("Error");
            return;
            break;
    }

    sendRequest(host, function() {
        if(dispReq.readyState == 4 && dispReq.status == 200) {
            $("#response").text("Success")
        } else {
            $("#response").text("Failed")
        }
    });
}

function sendRequest(host, callback) {
    if (window.XMLHttpRequest) {
        dispReq = new XMLHttpRequest();
    }
    dispReq.open("Get", host, true);
    dispReq.send();
    dispReq.onreadystatechange = callback
}
