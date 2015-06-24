/**
 * Created by johnschroeder on 6/23/15.
 */

var editCartItems = {
    cartID: parseInt(window.args.cartID),
    cartName: window.args.cartName,
    carts: [],
    productTable: [],
    sizeTable: [],
    init: function() {
        $.get(window.apiRoute + "/Carts/GetCartItems/" + this.cartID, function(res) {
            if (res && res.length) {
                editCartItems.cartItems = JSON.parse(res)[0];
                editCartItems.buildProductIDList();
            } else {
                $("#response").text("Error: EditCartItems.init: No response.");
            }
        }).fail(function(res) {
            $("#response").text("Error: EditCartItems.init: Connection error.");
        });
    },

    //TODO: any fucking comments
    buildProductIDList: function() {
        $("#cart_name").text(this.cartName);
        console.log("Cart items: " + this.cartItems);

        var k = 0;
        for (var i = 0; i < this.cartItems.length; ++i) {
            var index = this.cartItems[i].ProductID;
            console.log("index: " + index);

            if (typeof editCartItems.productTable[index] === 'undefined') {
                editCartItems.productTable[index] = [];
                editCartItems.sizeTable[k] = [];
                editCartItems.sizeTable[k].push(index);
                editCartItems.productTable[index].push({
                    name: this.cartItems[i].ProductName,
                    totalQuantity: 0,
                    productID: index
                });
            }
            editCartItems.productTable[index].push(this.cartItems[i]);
            editCartItems.productTable[index][0].totalQuantity += this.cartItems[i].Total;
        }
        console.log("size table: " + editCartItems.sizeTable);
        editCartItems.getSizeByProductID(0);
    },
    getSizeByProductID: function(i) {
        console.log("I: " + i);
        console.log("sizeTable.length: " + editCartItems.sizeTable.length);
        $.get(window.apiRoute + "/GetSizeByProductID/" + editCartItems.sizeTable[i], function(res) {
            if (res && res.length) {
                console.log("i in the callback: " + i);
                console.log("res.length: " + res.length);
                for(var j = 0; j < JSON.parse(res).length; ++j)
                {
                    editCartItems.sizeTable[i].push(JSON.parse(res)[j]);
                }
                if(i < editCartItems.sizeTable.length - 1) {
                    editCartItems.getSizeByProductID(i + 1);
                } else {
                    editCartItems.populateList();
                }
            } else {
                $("#response").text("Error: EditCartItems.getSizeByProductID: No response.");
            }
        }).fail(function(res) {
            $("#response").text("Error: EditCartItems.getSizeByProductID: Connection error.");
        });


    },

    populateList: function() {

        console.log(editCartItems.productTable);
        console.log(editCartItems.sizeTable);
        var inventory_container = $('.inventory-container');

        var itemList = $(document.createElement("div"))
            .appendTo(inventory_container);

        var j = 0;
        editCartItems.productTable.forEach(function(product) {

            editCartItems.carts = [];
            editCartItems.carts[j] = {};
            var cart = editCartItems.carts[j];

            cart.cartItem = $(document.createElement("div"))
                .appendTo(itemList);
            $(document.createElement("hr")).appendTo(cart.cartItem);
            cart.productName = $(document.createElement("span"))
                .text(product[0].name)
                .appendTo(cart.cartItem);
            cart.totalQuantity = $(document.createElement("span"))
                .text(product[0].totalQuantity)
                .addClass("float_right total_quantity")
                .appendTo(cart.cartItem);
            $(document.createElement("br")).appendTo(cart.cartItem);
            cart.editButton = $(document.createElement("button"))
                .text("Edit")
                .attr("onclick", 'editCartItems.editItem(' + j + ')');
            cart.editButton.appendTo(cart.cartItem);
            cart.optionsContainer = $(document.createElement("div"))
                .appendTo(cart.cartItem);

            cart.itemRows = [];
            cart.editRows = [];
            for(var i = 1; i < product.length; ++i) {
                var row = {};
                var editRow = {};
                row.optionsRow = $(document.createElement("div"))
                    .appendTo(cart.cartItem);
                editRow.optionsRow = $(document.createElement("div"))
                    .hide()
                    .appendTo(cart.cartItem);

                row.size = $(document.createElement("span"))
                    .text(product[i].SizeName)
                    .addClass("float_left size")
                    .appendTo(row.optionsRow);
                editRow.size = $(document.createElement("select"))
                    .attr("id", "select" + i)
                    .addClass("float_left size");
                var sizes;
                for(var k = 0; k < editCartItems.sizeTable.length; ++k) {
                    if(editCartItems.sizeTable[k][0] == product[0].productID)
                        sizes = editCartItems.sizeTable[k];
                }
                for(var k = 1; k < sizes.length; ++k) {
                    var option = $(document.createElement("option"))
                        .attr("size", sizes[k].Size)
                        .attr("name", sizes[k].Name)
                        .text(sizes[k].Name);
                    editRow.size.append(option);
                }
                editRow.size.val(product[i].SizeName);
                console.log(product[i].SizeName);
                editRow.size.appendTo(editRow.optionsRow);
                editRow.size.change(editRow.rowTotal, function(event) {
                    console.log($("#select1 option:selected").attr("size"));
                    //TODO: use this to set rowTotal

                });

                $(document.createElement("span"))
                    .text("*")
                    .addClass("float_left operator")
                    .appendTo(row.optionsRow);
                $(document.createElement("span"))
                    .text("*")
                    .addClass("float_left operator")
                    .appendTo(editRow.optionsRow);

                row.quantity = $(document.createElement("span"))
                    .text(product[i].BatchCount)
                    .addClass("float_left package_count")
                    .appendTo(row.optionsRow);
                editRow.quantityBox = $(document.createElement("input"))
                    .attr("type", "text")
                    .addClass("float_left num_entry")
                    .val(product[i].BatchCount)
                    .appendTo(editRow.optionsRow);

                $(document.createElement("span"))
                    .text(" = ")
                    .addClass("float_left operator")
                    .appendTo(row.optionsRow);
                $(document.createElement("span"))
                    .text(" = ")
                    .addClass("float_left operator")
                    .appendTo(editRow.optionsRow);

                row.rowTotal = $(document.createElement("span"))
                    .text(product[i].Total)
                    .addClass("float_left row_total")
                    .appendTo(row.optionsRow);
                editRow.rowTotal = $(document.createElement("span"))
                    .text(product[i].Total)
                    .addClass("float_left row_total")
                    .appendTo(editRow.optionsRow);

                row.color = $(document.createElement("span"))
                    .text("Run Color: " + product[i].Marker)
                    .addClass("float_right run_color")
                    .appendTo(row.optionsRow);
                editRow.color = $(document.createElement("span"))
                    .text("Run Color: " + product[i].Marker)
                    .addClass("float_right run_color unimplemented")
                    .appendTo(editRow.optionsRow);


                row.location = $(document.createElement("span"))
                    .text("Location: " + product[i].Location)
                    .addClass("float_right location")
                    .appendTo(row.optionsRow);
                editRow.location = $(document.createElement("span"))
                    .text("Location: " + product[i].Location)
                    .addClass("float_right location unimplemented")
                    .appendTo(editRow.optionsRow);
                $(document.createElement("br")).appendTo(row.optionsRow);
                cart.itemRows.push(row);
                cart.editRows.push(editRow);
            }
            itemList.append(cart.cartItem);
            console.log("in method cart: " + cart);
        })
        inventory_container.append(itemList);
    },

    //updateTotals: function

    editItem: function(index) {
        var cart = this.carts[index];

        if(cart.editButton.text() == "Done") {
            cart.editButton.text("Edit");
            cart.itemRows.forEach(function(row) {
                row.optionsRow.show();
            })
            cart.editRows.forEach(function(editRow){
                editRow.optionsRow.hide();
            })
        } else {
            cart.editButton.text("Done");
            cart.editRows.forEach(function(editRow){
                editRow.optionsRow.show();
            })
            cart.itemRows.forEach(function(row) {
                row.optionsRow.hide();
            })
        }
    }
}
