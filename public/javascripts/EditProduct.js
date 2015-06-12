function showProductID(selectedID){
    //TODO use john's breadcrumb loader to load a new page here populated with the data.
    console.log(selectedID);
    var host = "http://localhost:50001/EditProduct/" +selectedID +"/";

    sendRequest(host, function() {
        if(dispReq.readyState == 4 && dispReq.status == 200) {
            var selectedProduct = jQuery.parseJSON(dispReq.responseText);
            $(".selectedID").text(selectedProduct[0].ProductID);
            //fill Customer
            $(".customer").text(selectedProduct[0].Customer);
            //fill Item Name
            $(".product-name").text(selectedProduct[0].Name);
            //fill Description
            $(".description").text(selectedProduct[0].Description);
        }
    });
}


function sendRequest(host, callback) {
    if (window.XMLHttpRequest) {
        dispReq = new XMLHttpRequest();
    }
    dispReq.open("Get", host, true);
    dispReq.send();
    dispReq.onreadystatechange = callback;
}

function reSubmit(selectedID){
    //TODO implement: var prodID = getQueryStringParams().inventoryID; and get the prodID from there
    var prodID = selectedID;
    var newCustName = $(".customer").val();
    var newProdName  = $(".product-name").val();
    var newDescript  = $(".description").val();
    var host = "http://localhost:50001/reSubmit/" + prodID + "/" + newCustName +"/" + newProdName + "/" + newDescript;

    sendRequest(host, function() {
        if (dispReq.readyState == 4 && dispReq.status == 200) {
            console.log("Success!");
        }
    });
}








