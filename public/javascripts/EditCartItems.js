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
                .addClass("float_right total_quantity")
                .appendTo(cartItem);
            $(document.createElement("br")).appendTo(cartItem);
            var editButton = $(document.createElement("button"))
                .text("Edit")
                .attr("onclick", 'editCartItems.editItem()');
            editButton.appendTo(cartItem);
            var optionsContainer = $(document.createElement("div"))
                .appendTo(cartItem);


            for(var i = 1; i < product.length; ++i) {


                var optionsRow = $(document.createElement("div"))
                    .appendTo(cartItem);


                var size = $(document.createElement("span"))
                    .text(product[i].SizeName)
                    .addClass("float_left size")
                    .appendTo(optionsRow);
                //var quantityBox = $(document.createElement("input"))
                //    .attr("type", "text")
                //    .addClass("num_entry");
                //quantityBox.val(product[i].BatchCount);
                //quantityBox.appendTo(optionsRow);
                $(document.createElement("span"))
                    .text("*")
                    .addClass("float_left operator")
                    .appendTo(optionsRow);
                var quantity = $(document.createElement("span"))
                    .text(product[i].BatchCount)
                    .addClass("float_left package_count")
                    .appendTo(optionsRow);

                $(document.createElement("span"))
                    .text(" = ")
                    .addClass("float_left operator")
                    .appendTo(optionsRow);
                var rowTotal = $(document.createElement("span"))
                    .text(product[i].Total)
                    .addClass("float_left row_total")
                    .appendTo(optionsRow);
                var color = $(document.createElement("span"))
                    .text("Run Color: " + product[i].Marker)
                    .addClass("float_right run_color")
                    .appendTo(optionsRow);
                var location = $(document.createElement("span"))
                    .text("Location: " + product[i].Location)
                    .addClass("float_right location")
                    .appendTo(optionsRow);
                $(document.createElement("br")).appendTo(optionsRow);

            }
            itemList.append(cartItem);
        })
        inventory_container.append(itemList);
    },

    editItem: function() {alert("it worked");}
}
