/**
 * Created by johnschroeder on 6/23/15.
 */

var editCartItems = {
    cartID: parseInt(window.args.cartID),
    cartName: window.args.cartName,
    init: function() {
        $.get(window.apiRoute + "/Carts/GetCartItems/" + this.cartID, function(res) {
            if (res && res.length) {
                editCartItems.cartItems = JSON.parse(res)[0];
                $("#cart_name").text(editCartItems.cartName);
                editCartItems.populateList();
            } else {
                $("#response").text("Error: EditCartItems.init: No response.");
            }
        }).fail(function(res) {
            $("#response").text("Error: EditCartItems.init: Connection error.");
        });
    },
    populateList: function() {
        var inventory_container = $( '.inventory-container' );
        var itemList = $(document.createElement("div"))
            .appendTo(inventory_container);
        console.log("Cart items: " + this.cartItems);

        for(var i = 0; i < this.cartItems.length; ++i) {
            var name = this.cartItems[i].ProductName.toString();
            var total = this.cartItems[i].Total.toString();

            var cartItem = $(document.createElement("div"))
                .appendTo(itemList);
            $(document.createElement("hr"))
                .appendTo(cartItem);
            var productName = $(document.createElement("span"))
                .text(name)
                .appendTo(cartItem);
            var totalQuantity = $(document.createElement("span"))
                .text(total)
                .addClass("float_right")
                .appendTo(cartItem);
            itemList.append(cartItem);

        }
        inventory_container.append(itemList);
    }
}
