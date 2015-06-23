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
                editCartItems.populateList();
            } else {
                $("#response").text("Error: EditCartItems.init: No response.");
            }
        }).fail(function(res) {
            $("#response").text("Error: EditCartItems.init: Connection error.");
        });
    },

    //TODO: any fucking comments
    populateList: function() {
        $("#cart_name").text(this.cartName);
        var inventory_container = $( '.inventory-container' );
        var itemList = $(document.createElement("div"))
            .appendTo(inventory_container);
        console.log("Cart items: " + this.cartItems);

        var productTable = [];
        for(var i = 0; i < this.cartItems.length; ++i) {
            var index = this.cartItems[i].ProductID;
            console.log("index: " + index);

            if(typeof productTable[index] === 'undefined') {
                productTable[index] = [];
                productTable[index].push({
                    name: this.cartItems[i].ProductName,
                    totalQuantity: 0,
                    productID: index
                });
            }
            productTable[index].push(this.cartItems[i]);
            productTable[index][0].totalQuantity += this.cartItems[i].Total;
        }

        console.log(productTable);

        productTable.forEach(function(product) {
            var cartItem = $(document.createElement("div"))
                .appendTo(itemList);
            $(document.createElement("hr")).appendTo(cartItem);
            var productName = $(document.createElement("span"))
                .text(product[0].name)
                .appendTo(cartItem);
            var totalQuantity = $(document.createElement("span"))
                .text(product[0].totalQuantity)
                .addClass("float_right")
                .appendTo(cartItem);
            $(document.createElement("br")).appendTo(cartItem);
            var editButton = $(document.createElement("button"))
                .text("Edit")
                .attr("onclick", 'editCartItems.editItem()');
            editButton.appendTo(cartItem);
            var optionsContainer = $(document.createElement("div"))
                .appendTo(cartItem);
            for(var i = 1; i < product.length; ++i) {
                var size = $(document.createElement("span"))
                    .text(product[i].SizeName)
                    .appendTo(cartItem);
            }
            itemList.append(cartItem);
        })
        inventory_container.append(itemList);
    },

    editItem: function() {alert("it worked");}
}
