//<script>
/**
 * Created by elijah on 6/21/15.
 */

var state = window.state;

function populateByCartId() {
    //TODO when function runs we need to make sure that if there is a state.nameSelected that it is put in the selected option on run.
    //TODO when users is able to be gotten dynamically, change "don" to + userid; so it grabs the carts for the user
    var user = 'don';
    navigation.hit("/Carts/GetCartsByUser/" + user,function(res){
        var results = JSON.parse(res);

        var dropSelect = $("#selectDropDown")
            .append($("<option/>")
                .val(-1)
                .text("-- Select a Cart --")
        );

        for (var i = 0; i < results.length; ++i) {
            var option = $("<option/>")
                .val(results[i].CartID)
                .text(results[i].CartName)
                .appendTo(dropSelect);

            if (state && state.nameSelected == results[i].CartName) {
                option.prop("selected", true);
                displayCartInventory();
                $("#qr_button").removeClass("hidden");
            }
        }
    });
}

function displayCartInventory() {
    var cartContainer = $("#inventory-container")
        .empty();

    if ($("#selectDropDown :selected").val() == -1) {
        $("#qr_button").addClass("hidden");
        return;
    }

    state.nameSelected = $("#selectDropDown :selected").text();
    navigation.saveState(state);
    var idSelected = $("#selectDropDown :selected").val();
    $("#qr_button").removeClass("hidden");

    navigation.hit("/Carts/GetCartItems/" + encodeURIComponent(idSelected), function (data) {
        data = JSON.parse(data);
        populateCartContainer(data[0]);
    })/*.fail(function(res) {
        $("#response").text("Error: displayCartInventory: Connection error.");
    })*/;
}

function pullAll() {
    var name = $("#selectDropDown :selected").text();
    var cartName = prompt("Please confirm that -- " + name + " -- is the cart you want to pull by typing in the cart name.");

    if (cartName == name) {
        $("#pullAllButton")
            .text("Ship Cart!")
            .prop("onclick", null)
            .off("click");
    }
}

function doNothing() {
    $("#response").text("Shipment sent!");
}

function gotoEditCarts() {
    if ($("#selectDropDown :selected").val() == -1) return;
    state.nameSelected = $("#selectDropDown :selected").text();
    navigation.saveState(state);
    var idSelected = $("#selectDropDown :selected").val();
    navigation.go('EditCartData.html', {
        cartID: idSelected,
        cartName: state.nameSelected,
        previousPage: "ViewCarts.html"
    });
}

function gotoEditItems() {
    if ($("#selectDropDown :selected").val() == -1) return;
    state.nameSelected = $("#selectDropDown :selected").text();
    navigation.saveState(state);
    var idSelected = $("#selectDropDown :selected").val();
    //navigation.go('EditCartItems.html', {
    //    cartID: idSelected,
    //    cartName: state.nameSelected,
    //    previousPage: "ViewCarts.html"
    //});
}

function populateCartContainer(items) {
    var cartContainer = $("#inventory-container")
        .empty();

    var productIds = [];

    items.forEach(function (item) {
        productIds.push(item.ProductID);
    });

    productIds = productIds.filter(function (e, i, a) {
        return a.indexOf(e) == i;
    });

    productIds.forEach(function (id) {
        var cartEntry = null;

        items.forEach(function (item) {
            if (id == item.ProductID) {
                if (!cartEntry) {
                    cartEntry = createCartEntry(item);
                    cartContainer.append(cartEntry);
                }

                cartEntry.append(createItemEntry(item, cartEntry));
                updateTotal(cartEntry);
            }
        });
    });
}

function createCartEntry(item) {
    var cartItem = $("<div class='cart-entry'/>")
        .attr("name", item.ProductName)
        .data("productId", item.ProductID)
        .append($("<hr/>"))
        .append($("<div class='row'/>")
            .append($("<div class='col-sm-8'/>")
                .append($("<h2 class='item-name'/>")
                    .text(item.ProductName)
                )
            )
            .append($("<div class='col-sm-4'/>")
                .append($("<h2 class='item-total-text text-center'/>")
                    .text("0")
                )
            )
        )
        .append($("<div class='row'/>")
            .append($("<div class='col-sm-6'/>")
                .text("Pulled")
            )
            .append($("<div class='col-sm-6'/>")
                .append($("<div class='pull-right'/>")
                    .append($("<button class='btn btn-default edit-button'/>")
                        .click(function () {
                            cartItem
                                .find(".package-text, .amount-text, .edit-button, .unpull-button")
                                    .addClass("hidden")
                                .end()
                                .find(".package-select, .amount-input, .done-button, .delete-button, .delete-all-button")
                                    .removeClass("hidden")
                                .end();

                            updateEntryPackageTypeOptions(cartItem, item.ProductID)
                        })
                        .text("Edit")
                    )
                    .append($("<button class='btn btn-default hidden done-button'/>")
                        .click(function () {
                            cartItem
                                .find(".package-text, .amount-text, .edit-button, .unpull-button")
                                    .removeClass("hidden")
                                .end()
                                .find(".package-select, .amount-input, .done-button, .delete-button, .delete-all-button")
                                    .addClass("hidden")
                                .end();

                            handleDirtyItems(cartItem);
                        })
                        .text("Done")
                    )
                    .append($("<button class='btn btn-default hidden delete-all-button'/>")
                        .click(function () {
                            // TODO deleteAll()
                        })
                        .text("Delete All")
                    )
                    .append($("<button class='btn btn-default unpull-button'/>")
                        .click(function () {
                            // TODO unpull()
                        })
                        .text("Unpull")
                    )
                )
            )
        )
        .append($("<br/>"))

    return cartItem;
}

function createItemEntry(item, parent) {
    var total = (parseInt(item.UnitsPerPackage) * parseInt(item.NumPackages)) || 0;
    var color = item.Marker || "";
    var location = item.Location || "";

    var cartItemEntry = $("<div class='row form-group item-entry'/>")
        .data("dirty", false)
        .data("data", item)
        .append($("<div class='col-sm-7'/>")
            .append($("<div class='row'/>")
                .append($("<div class='col-sm-5'/>")
                    .append($("<div class='package-text'/>")
                        .attr("name", item.PackageName)
                        .data("size", item.UnitsPerPackage)
                        .text(item.PackageName + " of " + item.UnitsPerPackage)
                    )
                    .append($("<select class='form-control hidden package-select'/>")
                        .change(function () {
                            var selected = cartItemEntry.find(".package-select option:selected");
                            var count = (parseInt(selected.data("size")) * parseInt(cartItemEntry.find(".amount-input").val())) || 0;

                            cartItemEntry
                                .data("dirty", true)
                                .find(".total-text")
                                    .text(count)
                                .end()
                                .find(".package-text")
                                    .attr("name", selected.attr("name"))
                                    .data("size", selected.data("size"))
                                    .text(selected.val());

                            updateTotal(parent);
                        })
                    )
                )
                .append($("<div class='col-sm-1 text-center'/>")
                    .css("font-size", "150%")
                    .text("*")
                )
                .append($("<div class='col-sm-3'/>")
                    .append($("<div class='amount-text'/>")
                        .text(item.NumPackages)
                    )
                    .append($("<input class='form-control hidden amount-input' type='number' min='0'/>")
                        .val(parseInt(item.NumPackages))
                        .change(function () {
                            var selected = cartItemEntry.find(".package-select option:selected");
                            var count = (parseInt(selected.data("size")) * parseInt(cartItemEntry.find(".amount-input").val())) || 0;

                            cartItemEntry
                                .data("dirty", true)
                                .find(".total-text")
                                    .text(count)
                                .end()
                                .find(".amount-text")
                                    .text(cartItemEntry.find(".amount-input").val());

                            updateTotal(parent);
                        })
                    )
                )
                .append($("<div class='col-sm-1 text-center'/>")
                    .text("=")
                )
                .append($("<div class='col-sm-2 total-text'/>")
                    .text(total)
                )
            )
        )
        .append($("<div class='col-sm-2'/>")
            .text("Color: ")
            .append($("<div/>")
                .text(color)
            )
        )
        .append($("<div class='col-sm-2'/>")
            .text("Location: ")
            .append($("<div/>")
                .text(location)
            )
        )
        .append($("<div class='col-sm-1'/>")
            .append($("<button class='btn btn-default hidden delete-button'/>")
                .click(function () {
                    deleteRow(cartItemEntry, parent);
                })
                .text("Delete")
            )
        )

    return cartItemEntry;
}

function updateTotal(cartItem) {
    var total = 0;

    cartItem
        .find(".total-text")
            .each(function () {
                total += parseInt($(this).text()) || 0;
            })
        .end()
        .find(".item-total-text")
            .text(total);
}

function handleDirtyItems(cartItem) {
    handleDirtyItemsRecursively(cartItem.find(".item-entry").first(), cartItem);
}

function handleDirtyItemsRecursively(entry, cartItem) {
    if (!entry.length) return;

    if (!entry.data("dirty")) {
        handleDirtyItemsRecursively(entry.next(), cartItem);
        return;
    }

    if (entry.data("dirty")) {
        var data = entry.data("data");
        var cartID = $("#selectDropDown :selected").val();
        var cartItemID = data.CartItemID;
        var sizeMapID = entry.find(".package-select option:selected").val();
        var quantity = parseInt(entry.find(".amount-input").val());
        var runID = data.RunID;

        $.get(window.apiRoute + "/Carts/EditCartItem/"
            + cartID + '/' + cartItemID + '/'
            + sizeMapID + '/' + quantity + '/' + runID,
            function (res) {
                console.log("Results of submitting changed values: ");
                console.log(JSON.parse(res));
        })
        .then(function() {
            var nextEntry = entry.next();

            while (nextEntry.length && !nextEntry.data("dirty")) {
                nextEntry = nextEntry.next();
            }

            if (!nextEntry.length) {
                refreshCartEntry(cartItem);
                return;
            }

            handleDirtyItemsRecursively(nextEntry, cartItem);
        })
        .fail(function (res) {
                if(res.status == 511){
                    console.log("Access Denied!");
                    alert("Sorry your permission level doesn't allow you to access this page.");
                }
                if(res.status == 510){
                    navigation.go("loginForm.html");
                    alert("You have to log in before you can see this page!");
                }
        });
    }
}

function deleteRow(entry, item) {
    // TODO update dirty items and continue editing
    var data = entry.data("data");
    var cartItemID = data.CartItemID;

    item
        .find(".package-text, .amount-text, .edit-button, .unpull-button")
            .removeClass("hidden")
        .end()
        .find(".package-select, .amount-input, .done-button, .delete-button, .delete-all-button")
            .addClass("hidden")
        .end();

    $.get(window.apiRoute + "/Carts/DeleteItemInCart/" + cartItemID, function (res) {
        console.log(res);
    })
    .then(function() {
        refreshCartEntry(item);
    })
    .fail(function(res) {
            if(res.status == 511){
                console.log("Access Denied!");
                alert("Sorry your permission level doesn't allow you to access this page.");
            }
            if(res.status == 510){
                navigation.go("loginForm.html");
                alert("You have to log in before you can see this page!");
            }    });
}

function refreshCartEntry(cartEntry) {
    cartEntry.find(".item-entry").remove();

    var idSelected = $("#selectDropDown :selected").val();

    navigation.hit("/Carts/GetCartItems/" + idSelected, function (data) {
        data = JSON.parse(data);
        data[0].forEach(function (item) {
            if (cartEntry.data("productId") == item.ProductID) {
                cartEntry.append(createItemEntry(item, cartEntry));
                updateTotal(cartEntry);
            }
        });
    });
}

//Updates the options for the package types of a single entry.
function updateEntryPackageTypeOptions(item, productId) {
    navigation.hit( "/GetSizeByProductID/" + productId, function (data) {
        data = JSON.parse(data);
        item.find(".item-entry").each(function () {
            var select = $(this).find(".package-select").empty();

            data.forEach(function (each) {
                $("<option/>")
                    .attr("name", each.Name)
                    .data("size", each.Size)
                    .data("sizeMapId", each.SizeMapID)
                    .val(each.SizeMapID)
                    .text(each.Name + " of " + each.Size)
                    .appendTo(select);
            });

            // Select the correct package type
            var name = $(this).find(".package-text").attr("name");
            select.find("option[name='" + name + "']").prop("selected", true);
        });
    });
}

var qrCode = function () {
    if ($("#selectDropDown :selected").val() == -1) return;

    navigation.go("ShowQRCode.html", {
        Text: window.location.protocol + "//" + window.location.hostname + "/" + "ViewCarts-" + $("#selectDropDown :selected").val(),
        PreviousPage: "ViewCarts.html"
    });
};

// TODO QR code for add product. Waiting for implementation first. For now, that QR code is made from the pull inventory page.
