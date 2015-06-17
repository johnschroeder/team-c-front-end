function Add() {
    var params = {};
    params["inventoryId"] = getInventoryId();
    //TODO refactor this with navigation object
    window.open("http://localhost:50000/ChangeInventory.html?mode=addRun&" + mapToQueryString(params), "_self");
}

function Pull() {
    // Not implemented
}

function Edit() {
    var params = {};
    params["inventoryId"] = getInventoryId();
    //TODO refactor this with navigation object

    window.open("http://localhost:50000/EditProduct.html?" + mapToQueryString(params), "_self");
}

function getInventoryId() {
    return detailView.getParameterByName("prodid");
}
