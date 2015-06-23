function showProductID(selectedID) {
    //TODO use john's breadcrumb loader to load a new page here populated with the data.
    console.log(selectedID);
    var host = "http://localhost:50001/EditProduct/" + selectedID + "/";

    sendRequest(host, function () {
        if (dispReq.readyState == 4 && dispReq.status == 200) {
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

function getID() {

    var cartIDDiv = document.getElementById('cart_id');
    var id = 'replace me'; // window.args.cartID;
    cartIDDiv.innerHTML = id;
}

function myCartID() {
    return '2';
}

function sendRequest(host, callback) {
    if (window.XMLHttpRequest) {
        dispReq = new XMLHttpRequest();
    }
    dispReq.open("Get", host, true);
    dispReq.send();
    dispReq.onreadystatechange = callback;
}

function CartEdit(cartID) {
    //TODO implement: var prodID = getQueryStringParams().inventoryID; and get the prodID from there

    var newCartName = $(".CartName").val();
    var newReporter = $(".Reporter").val();
    var newAssignee = $(".Assignee").val();
    var newDate = $(".Date").val();
    var host = 'http://localhost:50001/Carts/EditCart/' + cartID + '/' + '"' + newCartName + '"' + "/" + '"' + newReporter + '"' + "/" + '"' + newAssignee + '"' + "/" + '"' + newDate + '"';
    alert(host);

    sendRequest(host, function () {
        if (dispReq.readyState == 4 && dispReq.status == 200) {
            console.log("Success!");
        }
    });
}

function CartItemsEdit(selectedID) {
    alert("Navigates to John's page");
}