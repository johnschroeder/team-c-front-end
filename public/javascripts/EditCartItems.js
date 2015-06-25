/**
 * Created by johnschroeder on 6/23/15.
 */

//TODO: make sure the database hit works once stored procedures stop timing out.
//TODO: comment!
var editCartItems = {
    model: {products: [], productIDList: []},
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
                cartItemID: this.cartItems[i].CartItemID,
                runID: this.cartItems[i].RunID,
                location: this.cartItems[i].Location,
                color: this.cartItems[i].Marker,
                initialSize: this.cartItems[i].SizeMapID,
                unitsPerPackage: this.cartItems[i].CountPerBatch,
                quantity: this.cartItems[i].BatchCount,
                dirty: false
            }
            productTable[index].rows.push(row);
        }
        //TODO: Delete these two lines
        console.log("cart items: ");
        console.log(editCartItems.cartItems);
        editCartItems.getSizeByProductID(0);
    },
    getSizeByProductID: function(i) {
        var model = editCartItems.model;

        $.get(window.apiRoute + "/GetSizeByProductID/" + model.productIDList[i], function(res) {
            if (res && res.length) {
                var productTable = editCartItems.model.products;
                var index = model.productIDList[i];
                for(var j = 0; j < JSON.parse(res).length; ++j) {
                    productTable[index].sizes.push(JSON.parse(res)[j]);
                }
                productTable[index].rows.forEach(function (row) {
                    if(row.initialSize) {
                        for (var h = 0; h < productTable[index].sizes.length; ++h) {
                            if (productTable[index].sizes[h].SizeMapID == row.initialSize) {
                                row.currentSize = productTable[index].sizes[h];
                            }
                        }
                    }
                });
                if(i < productTable[model.productIDList[i]].sizes.length) {
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
                .text(product.productName)
                .appendTo(cart.cartItem);
            cart.totalQuantity = $(document.createElement("span"))
                .text(product.totalQuantity)
                .addClass("float_right total_quantity")
                .appendTo(cart.cartItem);
            $(document.createElement("br")).appendTo(cart.cartItem);
            cart.editButton = $(document.createElement("button"))
                .text(product.editing ? "Done" : "Edit")
                .attr("onclick", 'editCartItems.editItem(' + product.productID + ')');
            cart.editButton.appendTo(cart.cartItem);
            cart.optionsContainer = $(document.createElement("div"))
                .appendTo(cart.cartItem);

            cart.itemRows = [];
            cart.editRows = [];

            for(var i = 0; i < product.rows.length; ++i) {
                var row = {};
                var editRow = {};
                row.optionsRow = $(document.createElement("div"))
                    .appendTo(cart.cartItem);
                editRow.optionsRow = $(document.createElement("div"))
                    .hide()
                    .appendTo(cart.cartItem);

                row.size = $(document.createElement("span"))
                    .text(product.rows[i].currentSize.Name)
                    .addClass("float_left size")
                    .appendTo(row.optionsRow);
                editRow.size = $(document.createElement("select"))
                    .addClass("float_left size");
                var sizes = productTable[product.productID].sizes;
                for(var k = 0; k < sizes.length; ++k) {
                    var option = $(document.createElement("option"))
                        .data("size", sizes[k])
                        .attr("name", sizes[k].Name)
                        .text(sizes[k].Name);
                    editRow.size.append(option);
                }
                editRow.size.val(product.rows[i].currentSize.Name);
                editRow.size.appendTo(editRow.optionsRow);
                editRow.size.change({row: product.rows[i], newSize: editRow.size}, function(event) {
                    var size = $(this).find('option:selected').data().size;
                    event.data.row.currentSize = size;
                    event.data.row.initialSize = false;
                    event.data.row.dirty = true;
                    editCartItems.populateList();
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
                    .text(product.rows[i].quantity)
                    .addClass("float_left package_count")
                    .appendTo(row.optionsRow);
                editRow.quantityBox = $(document.createElement("input"))
                    .attr("type", "text")
                    .addClass("float_left num_entry")
                    .val(product.rows[i].quantity)
                    .change({row: product.rows[i]}, function(event) {
                        var newVal = $(this).val();
                        event.data.row.quantity = newVal;
                        event.data.row.dirty = true;
                        editCartItems.populateList();
                    })
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
                    .text(product.rows[i].currentSize.Size * product.rows[i].quantity)
                    .addClass("float_left row_total")
                    .appendTo(row.optionsRow);
                editRow.rowTotal = $(document.createElement("span"))
                    .text(product.rows[i].currentSize.Size * product.rows[i].quantity)
                    .addClass("float_left row_total")
                    .appendTo(editRow.optionsRow);

                row.color = $(document.createElement("span"))
                    .text("Run Color: " + product.rows[i].color)
                    .addClass("float_right run_color")
                    .appendTo(row.optionsRow);
                editRow.color = $(document.createElement("span"))
                    .text("Run Color: " + product.rows[i].color)
                    .addClass("float_right run_color unimplemented")
                    .appendTo(editRow.optionsRow);


                row.location = $(document.createElement("span"))
                    .text("Location: " + product.rows[i].location)
                    .addClass("float_right location")
                    .appendTo(row.optionsRow);
                editRow.location = $(document.createElement("span"))
                    .text("Location: " + product.rows[i].location)
                    .addClass("float_right location unimplemented")
                    .appendTo(editRow.optionsRow);
                $(document.createElement("br")).appendTo(row.optionsRow);

                if(product.editing) {
                    row.optionsRow.hide();
                    editRow.optionsRow.show();
                } else {
                    row.optionsRow.show();
                    editRow.optionsRow.hide();
                }
                cart.itemRows.push(row);
                cart.editRows.push(editRow);
            }
            itemList.append(cart.cartItem);
        });
        inventory_container.append(itemList);
    },

    editItem: function(index) {

        var product = editCartItems.model.products[index];
        product.editing = !product.editing;

        if(!product.editing) {
            editCartItems.submitDirtyItems(product);
        }
        editCartItems.populateList();
    },

    submitDirtyItems: function(product) {
        for(var i = 0; i < product.rows.length; ++i) {
            if (product.rows[i].dirty) {
                var row = product.rows[i];
                var cartID = editCartItems.cartID;
                var cartItemID = row.cartItemID;
                var sizeMapID = row.currentSize.SizeMapID;
                var quantity = row.quantity;
                var runID = row.runID;
                $.get(window.apiRoute + "/Carts/EditCartItem/"
                    + cartID + '/'
                    + cartItemID + '/'
                    + sizeMapID + '/'
                    + quantity + '/'
                    + runID + '/'
                    ,function (res) {
                        if (res && res.length) {
                            console.log("RESULTS: ");
                            console.log(JSON.parse(res));
                        } else {
                            $("#response").text("Error: EditCartItems.init: No response.");
                        }
                    }).fail(function (res) {
                        $("#response").text("Error: EditCartItems.init: Connection error.");
                    });

            }
        }
    }
}
