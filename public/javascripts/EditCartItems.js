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
    //productTable: [],
    init: function() {
        $.get(window.apiRoute + "/Carts/GetCartItems/" + this.cartID, function(res) {
            if (res && res.length) {
                editCartItems.cartItems = JSON.parse(res)[0];
                editCartItems.buildProductIDList();
                console.log(editCartItems);
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
            if (typeof productTable[index] === 'undefined') {
                productTable[index] = {};
                productTable[index].productID = index;
                model.productIDList.push(index);
                productTable[index].productName = this.cartItems[i].ProductName;
                productTable[index].editing = false;
                productTable[index].rows = [];
                productTable[index].sizes = [];
                productTable[index].totalQuantity = 0;

                /*editCartItems.productTable[index] = [];
                editCartItems.productTable[index].push({
                    name: this.cartItems[i].ProductName,
                    totalQuantity: 0,
                    productID: index
                });*/
            }
            //editCartItems.productTable[index].push(this.cartItems[i]);
            //editCartItems.productTable[index][0].totalQuantity += this.cartItems[i].Total;


            var row = {
                cartItemID: this.cartItems[i].CartItemID,
                location: this.cartItems[i].Location,
                runID: this.cartItems[i].RunID,
                color: this.cartItems[i].Marker,
                initialSize: this.cartItems[i].SizeMapID,
                unitsPerPackage: this.cartItems[i].UnitsPerPackage,
                numberOfPackages: this.cartItems[i].NumPackages,
                dirty: false
            }
            productTable[index].totalQuantity += row.unitsPerPackage * row.numberOfPackages;
            productTable[index].rows.push(row);
        }
        editCartItems.getSizeByProductID(0);
    },
    getSizeByProductID: function(i) {
        var model = editCartItems.model;
        console.log("product id list at" + i);
        console.log(model.productIDList[i]);
        console.log("model.productIDList.length");
        console.log(model.productIDList.length);
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

                if(i < model.productIDList.length - 1) {
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

        var productList = $('.inventory-container');
        productList.empty();


        productTable.forEach(function(product) {

            var superRow = {};
            superRow.format = $(document.createElement("div"))
                .addClass("row")
                .attr('id',"superRow" + product.productID.toString())
                .appendTo(productList);
            $(document.createElement("hr")).appendTo(superRow.format);
            superRow.nameRow = $(document.createElement("div"))
                .addClass("row")
                .appendTo(superRow.format);
            superRow.nameDiv = $(document.createElement("div"))
                .addClass("col-xs-6")
                .appendTo(superRow.nameRow);
            superRow.productName = $(document.createElement("div"))
                .text(product.productName)
                .appendTo(superRow.nameDiv);
            superRow.deleteProductButtonDiv = $(document.createElement("div"))
                .addClass("col-xs-4")
                .appendTo(superRow.nameRow);
            superRow.deleteButton = $(document.createElement("button"))
                .text("Delete product")
                .attr("onclick", 'editCartItems.deleteProduct(' + product.productID + ')');
            if(product.editing) {
                superRow.deleteButton.show();
            } else {
                superRow.deleteButton.hide();
            }
            superRow.deleteButton.appendTo(superRow.deleteProductButtonDiv);
            superRow.quantityDiv = $(document.createElement("div"))
                .addClass("col-xs-2")
                .appendTo(superRow.nameRow);
            superRow.totalQuantity = $(document.createElement("div"))
                .text(product.totalQuantity)
                .appendTo(superRow.quantityDiv);
            superRow.buttonRow = $(document.createElement("div"))
                .addClass("row")
                .appendTo(superRow.format);
            superRow.editButtonDiv = $(document.createElement("div"))
                .addClass("col-xs-10")
                .appendTo(superRow.buttonRow);
            superRow.editButton = $(document.createElement("button"))
                .text(product.editing ? "Done" : "Edit")
                .attr("onclick", 'editCartItems.editItem(' + product.productID + ')');
            superRow.editButton.appendTo(superRow.editButtonDiv);

            superRow.itemRows = [];
            superRow.editRows = [];

            for(var i = 0; i < product.rows.length; ++i) {
                var row = {};
                var editRow = {};
                row.optionsRow = $(document.createElement("div"))
                    .addClass("row")
                    .appendTo(superRow.format);
                editRow.optionsRow = $(document.createElement("div"))
                    .addClass("row")
                    .hide()
                    .appendTo(superRow.format);

                row.left = $(document.createElement("div"))
                    .addClass("row col-xs-10")
                    .appendTo(row.optionsRow);
                row.right = $(document.createElement("div"))
                    .addClass("row col-xs-10")
                    .appendTo(row.optionsRow);

                editRow.left = $(document.createElement("div"))
                    .addClass("row col-xs-10")
                    .appendTo(editRow.optionsRow);
                editRow.right = $(document.createElement("div"))
                    .addClass("row col-xs-10")
                    .appendTo(editRow.optionsRow);

                row.size = $(document.createElement("span"))
                    .text(product.rows[i].currentSize.Name)
                    .addClass("col-xs-3")
                    .appendTo(row.left);
                editRow.size = $(document.createElement("select"))
                    .addClass("col-xs-3");
                var sizes = productTable[product.productID].sizes;
                for(var k = 0; k < sizes.length; ++k) {
                    var option = $(document.createElement("option"))
                        .data("size", sizes[k])
                        .attr("name", sizes[k].Name)
                        .text(sizes[k].Name);
                    editRow.size.append(option);
                }
                editRow.size.val(product.rows[i].currentSize.Name);
                editRow.size.appendTo(editRow.left);
                editRow.size.change({row: product.rows[i], newSize: editRow.size}, function(event) {
                    var size = $(this).find('option:selected').data().size;
                    event.data.row.currentSize = size;
                    event.data.row.initialSize = false;
                    event.data.row.dirty = true;
                    event.data.row.unitsPerPackage = size.Size;
                    editCartItems.populateList();
                });

                $(document.createElement("span"))
                    .text("*")
                    .addClass("col-xs-1")
                    .appendTo(row.left);
                $(document.createElement("span"))
                    .text("*")
                    .addClass("col-xs-1")
                    .appendTo(editRow.left);

                row.numberOfPackages = $(document.createElement("span"))
                    .text(product.rows[i].numberOfPackages)
                    .addClass("col-xs-2")
                    .appendTo(row.left);
                editRow.quantityBox = $(document.createElement("input"))
                    .attr("type", "text")
                    .addClass("col-xs-2")
                    .val(product.rows[i].numberOfPackages)
                    .change({row: product.rows[i]}, function(event) {
                        var newVal = $(this).val();
                        event.data.row.numberOfPackages = newVal;
                        event.data.row.dirty = true;
                        editCartItems.populateList();
                    })
                    .appendTo(editRow.left);

                $(document.createElement("span"))
                    .text(" = ")
                    .addClass("col-xs-1")
                    .appendTo(row.left);
                $(document.createElement("span"))
                    .text(" = ")
                    .addClass("col-xs-1")
                    .appendTo(editRow.left);

                row.rowTotal = $(document.createElement("span"))
                    .text(product.rows[i].currentSize.Size * product.rows[i].numberOfPackages)
                    .addClass("col-xs-3")
                    .appendTo(row.left);
                editRow.rowTotal = $(document.createElement("span"))
                    .text(product.rows[i].currentSize.Size * product.rows[i].numberOfPackages)
                    .addClass("col-xs-3")
                    .appendTo(editRow.left);



                row.color = $(document.createElement("span"))
                    .text("Run Color: " + product.rows[i].color)
                    .addClass("col-xs-5")
                    .appendTo(row.right);
                editRow.color = $(document.createElement("span"))
                    .text("Run Color: " + product.rows[i].color)
                    .addClass("col-xs-5 unimplemented")
                    .appendTo(editRow.right);


                row.location = $(document.createElement("span"))
                    .text("Location: " + product.rows[i].location)
                    .addClass("col-xs-5")
                    .appendTo(row.right);
                editRow.location = $(document.createElement("span"))
                    .text("Location: " + product.rows[i].location)
                    .addClass("col-xs-5 unimplemented")
                    .appendTo(editRow.right);
                $(document.createElement("hr"))
                    .addClass("col-xs-12")
                    .appendTo(row.optionsRow);
                $(document.createElement("hr"))
                    .addClass("col-xs-12")
                    .appendTo(editRow.optionsRow);
                editRow.deleteButton = $(document.createElement("button"))
                    .text("Delete")
                    .addClass("col-xs-2")
                    .attr("onclick", 'editCartItems.deleteRow(' + product.productID + ',' + i + ')')
                    .appendTo(editRow.right);
                if(product.editing) {
                    superRow.deleteButton.show();
                } else {
                    superRow.deleteButton.hide();
                }
                if(product.editing) {
                    row.optionsRow.hide();
                    editRow.optionsRow.show();
                } else {
                    row.optionsRow.show();
                    editRow.optionsRow.hide();
                }
                superRow.itemRows.push(row);
                superRow.editRows.push(editRow);
            }
            productList.append(superRow.cartItem);
        });
        //inventory_container.append(productList);
    },

    deleteRow: function(productIndex, rowIndex) {
        $.get(window.apiRoute + "/Carts/DeleteItemInCart/" +
            editCartItems.model.products[productIndex].rows[rowIndex].cartItemID
            , function(res) {
                if (res && res.length) {
                    console.log("Successfully deleted item product from cart.");
                    editCartItems.model.products[productIndex].rows.splice(rowIndex, 1);
                    editCartItems.populateList();
                } else {
                    $("#response").text("Error: EditCartItems.deleteProduct db response: " + JSON.parse(res));
                }
            }
        )
    },

    editItem: function(index) {

        var productTable = editCartItems.model.products;
        var product = editCartItems.model.products[index];
        product.editing = !product.editing;

        if(!product.editing) {
            productTable[index].totalQuantity = 0;
            productTable[index].rows.forEach(function(row){
                productTable[index].totalQuantity += row.numberOfPackages * row.unitsPerPackage;
                console.log(productTable[index].totalQuantity);
            });
            editCartItems.submitDirtyItems(product);
        }
        editCartItems.populateList();
    },

    deleteProduct: function(index) {
        var productTable = editCartItems.model.products;
        productTable[index].rows.forEach(function(row) {
            $.get(window.apiRoute + "/Carts/DeleteItemInCart/" + row.cartItemID,
                function(res) {
                    if (res && res.length) {
                        console.log("Successfully deleted item product from cart.");
                        delete productTable[index];
                        editCartItems.populateList();
                    } else {
                        $("#response").text("Error: EditCartItems.deleteProduct db response: " + JSON.parse(res));
                    }

                }).fail(function(res) {
                    $("#response").text("Error: EditCartItems.deleteProduct db connection");

                })
        });
    },

    submitDirtyItems: function(product) {
        for(var i = 0; i < product.rows.length; ++i) {
            if (product.rows[i].dirty) {
                var row = product.rows[i];
                var cartID = editCartItems.cartID;
                var cartItemID = row.cartItemID;
                var sizeMapID = row.currentSize.SizeMapID;
                var quantity = row.numberOfPackages;
                var runID = row.runID;
                $.get(window.apiRoute + "/Carts/EditCartItem/"
                    + cartID + '/'
                    + cartItemID + '/'
                    + sizeMapID + '/'
                    + quantity + '/'
                    + runID + '/'
                    ,function (res) {
                        if (res && res.length) {
                            console.log("Results of submitting changed values: ");
                            console.log(JSON.parse(res));
                        } else {
                            $("#response").text("Error: EditCartItems db response: " + JSON.parse(res));
                        }
                    }).fail(function (res) {
                        $("#response").text("Error: EditCartItems submission: " + JSON.parse(res));
                    });

            }
        }
    }
}
