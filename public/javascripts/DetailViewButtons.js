function Add() {
    var params = {};
    window.open("localhost:50000/ChangeInventory.html?mode=addRun&" + mapToQueryString(params), "_self");
}

function Pull() {
    // Not implemented
}

function Edit() {
    var params = {};
    //window.open("localhost:50000/EditProduct.html?" + mapToQueryString(params), "_self");
}
