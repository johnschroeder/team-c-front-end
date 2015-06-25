/**
 * Created by johnschroeder on 6/23/15.
 */

var editCartItems = {
    model: {products: {}, productIDList: []},
    cartID: parseInt(window.args.cartID),
    cartName: window.args.cartName,
    carts: [],
    productTable: [],
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

        for (var i = 0; i < this.cartItems.length; ++i) {
            var index = this.cartItems[i].ProductID;
            var model = editCartItems.model;
            var productTable = editCartItems.model.products;
            if (typeof editCartItems.productTable[index] === 'undefined') {
                productTable[index] = {};
                productTable[index].productID = index;
                model.productIDList.push(index);
                productTable[index].productName = this.cartItems[i].ProductName;
                productTable[index].editing = false;
                productTable[index].rows = [];
                productTable[index].sizes = [];

                editCartItems.productTable[index] = [];
                editCartItems.productTable[index].push({
                    name: this.cartItems[i].ProductName,
                    totalQuantity: 0,
                    productID: index
                });
            }
            editCartItems.productTable[index].push(this.cartItems[i]);
            editCartItems.productTable[index][0].totalQuantity += this.cartItems[i].Total;

            var row = {
                location: this.cartItems[i].location,
                color: this.cartItems[i].color,
                initialSize: this.cartItems[i].SizeMapID,
                packageQuantity: this.cartItems[i].BatchCount,
                dirty: false
            }
            productTable[index].rows.push(row);
        }
        editCartItems.getSizeByProductID(0);
    },
    getSizeByProductID: function(i) {
        var model = editCartItems.model;
        var productTable = editCartItems.model.products;

        $.get(window.apiRoute + "/GetSizeByProductID/" + model.productIDList[i], function(res) {
            if (res && res.length) {
                var productTable = editCartItems.model.products;
                var index = model.productIDList[i];
                for(var j = 0; j < JSON.parse(res).length; ++j)
                {
                    productTable[index].sizes.push(JSON.parse(res)[j]);
                }
                productTable[index].rows.forEach(function(row) {
                    for(var h = 0; h < productTable[index].sizes.length; ++h) {
                        if(productTable[index].sizes[h].SizeMapID == row.initialSize) {
                            row.currentSize = productTable[index].sizes[h];
                        }
                    }
                });

                if(i < productTable[model.productIDList[i]].sizes.length - 1) {
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
        var productTable = editCartItems.model.products;

        console.log("model @ 104: ");
        console.log(editCartItems.model);

        var inventory_container = $('.inventory-container');
        inventory_container.empty();

        var itemList = $(document.createElement("div"))
            .appendTo(inventory_container);

        var j = 0;
        productTable.forEach(function(product) {

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
                var szs = productTable[product[0].productID].sizes;
                //TODO: This is broken because size isn't good.  use model
                for(var k = 1; k < szs.length; ++k) {
                    var option = $(document.createElement("option"))
                        .attr("size", szs[k].Size)
                        .attr("name", szs[k].Name)
                        .text(szs[k].Name);
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
        editCartItems.populateList();
    }
}
