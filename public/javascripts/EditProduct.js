function showProductID(selectedID){
    //TODO implement getQueryStringParams().inventoryID
    //var selectedID = getQueryStringParams().inventoryID;
   // var selectedID = "100";
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

function reSubmit(){
    //var prodID = $(".selectedID").val();
    var newCustName = $(".customer").val();
    var newProdName  = $(".product-name").val();
    var newDescript  = $(".description").val();
    var prodID =100;
    var host = "http://localhost:50001/reSubmit/" + prodID + "/" + newCustName +"/" + newProdName + "/" + newDescript;

    sendRequest(host, function() {
        if (dispReq.readyState == 4 && dispReq.status == 200) {
            console.log("Success!");
        }
    });
}








