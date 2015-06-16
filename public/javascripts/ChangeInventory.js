var mode = "";
function init() {
    processParams();
}

function processParams() {
    var params = getQueryStringParams();
    if (params.mode) {
        changeMode(params.mode);
    }

    console.log("HEY STATE: " + $("#state").runId);

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

    if ($("#state").inventoryId) {
        $("#inventoryId").val($("#state").inventoryId);
    }

    if ($("#state").runId) {
        $("#runId").val($("#state").runId);
    }

    if ($("#state").runDate) {
        $("#runDate").val($("#state").runDate);
    }

    if ($("#state").batchAmount) {
        $("#batchAmount").val($("#state").batchAmount);
    }

    if ($("#state").batchLocation) {
        $("#batchLocation").val($("#state").batchLocation);
    }
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
    navigation.saveState({inventoryId:inventoryId,
                        runId:runId,
                        runDate:runDate,
                        batchAmount:batchAmount,
                        batchLocation:batchLocation})
    var host;

    switch (mode) {
        case "addRun":
            host = window.apiRoute+"/changeInventory/addRun/" + inventoryId + "/" + runDate;
            break;
        case "removeRun":
            host = window.apiRoute+"/changeInventory/removeRun/" + runId
            break;
        case "addBatch":
            host = window.apiRoute+"/changeInventory/addBatch/" + runId + "/" + batchAmount + "/" + batchLocation;
            break;
        case "removeBatch":
            host = window.apiRoute+"/changeInventory/removeBatch/" + runId + "/" + batchAmount + "/" + batchLocation;
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
