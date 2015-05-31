
var mode = "";

function changeMode(newMode) {
    mode = newMode;

    hideAllFields();

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
        case "addSubBatch":
            $("#modeHeading").text("Add SubBatch");
            $("#runIdField").show();
            $("#subbatchAmountField").show();
            $("#subbatchLocationField").show();
            break;
        case "removeSubBatch":
            $("#modeHeading").text("Remove SubBatch");
            $("#runIdField").show();
            $("#subbatchAmountField").show();
            $("#subbatchLocationField").show();
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
    $("#subbatchAmountField").hide();
    $("#subbatchLocationField").hide();
}

function submit() {
    var inventoryId = parseInt($("#inventoryId").val());
    var runId = parseInt($("#runId").val());
    var runDate = $("#runDate").val();
    var batchAmount = parseInt($("#batchAmount").val());
    var batchLocation = $("#batchLocation").val();
    var subbatchAmout = parseInt($("#subbatchAmount").val());
    var subbatchLocation = $("#subbatchLocation").val();

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
        case "addSubBatch":
            host = "http://localhost:50001/addBatch/" + runId + "/" + subbatchAmount + "/" + batchLocation;
            break;
        case "removeSubBatch":
            host = "http://localhost:50001/removeBatch/" + runId + "/" + subbatchAmount + "/" + batchLocation;
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
