function showProductID(){
    //TODO implement getQueryStringParams().inventoryID
    //var selectedID = getQueryStringParams().inventoryID;
    var selectedID = "100";
    var host = "http://localhost:50001/EditProduct/";



sendRequest(host, function() {
    if(dispReq.readyState == 4 && dispReq.status == 200) {
        var selectedProduct = jQuery.parseJSON(dispReq.responseText);
        for(var i = 0; i < selectedProduct.length; i++)
            if(selectedID == selectedProduct[i].ProductID){
                //fill Customer
                $(".customer").text(selectedProduct[i].Customer);
                //fill Item Name
                $(".product-name").text(selectedProduct[i].Name);
                //fill Description
                $(".description").text(selectedProduct[i].Description);
            }
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
