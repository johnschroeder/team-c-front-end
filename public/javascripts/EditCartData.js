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


function setCurrentValues() {

    var original_name_div = document.getElementById('original_cart_name');
    var name = window.args.cartName;
    original_name_div.innerHTML = "Editing Cart: " + name;

    /* var host = 'http://localhost:50001/Carts/GetMyCartData/' + cartID + '/';
     sendRequest(host, function () {
     if (dispReq.readyState == 4 && dispReq.status == 200) {
     console.log("Success!");
     }
     });
     */


    var newCartName = $(".CartName").val("orignal_cart");
    var newReporter = $(".Reporter").val("orignal_reporter");
    var newAssignee = $(".Assignee").val("original_Assignee");
    $(".Date").val("orignal_date");
}

function myCartID() {
    return window.args.cartID;
}


function sendRequest(host, callback) {
    if (window.XMLHttpRequest) {
        dispReq = new XMLHttpRequest();
    }
    dispReq.open("Get", host, true);
    dispReq.send();
    dispReq.onreadystatechange = callback;
}

function CartDataEdit(cartID) {
    //TODO implement: var prodID = getQueryStringParams().inventoryID; and get the prodID from there

    var newCartName = $(".CartName").val();
    var newReporter = $(".Reporter").val();
    var newAssignee = $(".Assignee").val();
    var newDate = $(".Date").val();
    var host = 'http://localhost:50001/Carts/EditCart/' + cartID + '/' + '"' + newCartName.trim() + '"' + "/" + '"' + newReporter.trim() + '"' + "/" + '"' + newAssignee.trim() + '"' + "/" + '"' + newDate.trim() + '"';
    sendRequest(host, function () {
        if (dispReq.readyState == 4 && dispReq.status == 200) {
            console.log("Success!");
        }
    });

    navigation.go("EditCart.html", {});
}

function CartItemsEdit(cartID, cartName) {
    navigation.go("EditCartItems.html", {cartID: cartID, cartName: cartName});
}