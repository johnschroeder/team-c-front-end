function sendRequest(host, callback) {
    if (window.XMLHttpRequest) {
        dispReq = new XMLHttpRequest();
    }
    dispReq.open("Get", host, true);
    dispReq.send();
    dispReq.onreadystatechange = callback
}



function setCurrentValues() {

    var original_name_div = document.getElementById('original_cart_name');
    var name = window.args.cartName;
    original_name_div.innerHTML = "Editing Cart: " + name;
    var host = "http://localhost:50001/Carts/GetAllCarts/"
    var carts;
    var cartIndex = 0;

    var original_cart = "original_cart";
    var original_reporter = "original_reporter";
    var original_assignee = "original_assignee";
    var original_date = "original_date";


    $.get(host, function (data, status) {
        carts = jQuery.parseJSON(data);
        for (var i = 0; i < carts.length; i++) {
            if (carts[i].CartID == window.args.cartID) {
                cartIndex = i;
            }
        }

        original_cart = carts[cartIndex].CartName;
        original_reporter = carts[cartIndex].Reporter;
        original_assignee = carts[cartIndex].Assignee;
        original_date = carts[cartIndex].DateToDelete;

        var newCartName = $(".CartName").val(original_cart);
        var newReporter = $(".Reporter").val(original_reporter);
        var newAssignee = $(".Assignee").val(original_assignee);
        var newDate = $(".Date").val(original_date.split("T")[0]);
    });


}

function myCartID() {
    return window.args.cartID;
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