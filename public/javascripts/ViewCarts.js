//<script>
/**
 * Created by elijah on 6/21/15.
 */

var state = window.state;

function populateByCartId() {
    //TODO when function runs we need to make sure that if there is a state.nameSelected that it is put in the selected option on run.
    //TODO when users is able to be gotten dynamically, change "don" to + userid; so it grabs the carts for the user
    var user = 'don';
    $.get(window.apiRoute + "/Carts/GetCartsByUser/" + user, function(res) {
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
            }
        }
    }).fail(function (res) {
        $("#response").text("Error: populateByCartId: Connection error.");
    });
}

function displayCartInventory() {
    var cartContainer = $("#inventory-container")
        .empty();

    if ($("#selectDropDown :selected").val() == -1) return;

    //console.log("Selected: " + $("#selectDropDown :selected").text());

    state.nameSelected = $("#selectDropDown :selected").text();
    navigation.saveState(state);
    var idSelected = $("#selectDropDown :selected").val();

    $.get(window.apiRoute + "/Carts/GetCartItems/" + idSelected, function(res) {
        var items = JSON.parse(res)[0];
        populateCartContainer(items);
    }).fail(function(res) {
        $("#response").text("Error: displayCartInventory: Connection error.");
    });
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
    navigation.go('EditCartItems.html', {
        cartID: idSelected,
        cartName: state.nameSelected,
        previousPage: "ViewCarts.html"
    });
}

function populateCartContainer(items) {
    var cartContainer = $("#inventory-container")
        .empty();

    var cartEntry = null;

    for (var i = 0; i < items.length; ++i) {
        if (!cartEntry || cartEntry.find(".item-name").text() != items[i].ProductName) {
            cartEntry = createCartEntry(items[i], cartContainer);
            cartContainer.append(cartEntry);
        }

        var itemEntry = createItemEntry(items[i], cartEntry);
        cartEntry.append(itemEntry);

        updateTotal(cartEntry);
    }
}

function createCartEntry(item) {
    var cartItem = $("<div/>");

    cartItem
        .addClass("cart-entry")
        .attr("name", item.ProductName)
        .data("productId", item.ProductID)
        .append($("<hr/>"))
        .append($("<div/>")
            .addClass("row")
            .append($("<div/>")
                .addClass("col-sm-8")
                .append($("<h2/>")
                    .addClass("item-name")
                    .text(item.ProductName)
            )
        )
            .append($("<div/>")
                .addClass("col-sm-4")
                .append($("<h2/>")
                    .addClass("item-total-text text-center")
                    .text("0")
            )
        )
    )
        .append($("<div/>")
            .addClass("row")
            .append($("<div/>")
                .addClass("col-sm-6")
                .text("Pulled")
        )
            .append($("<div/>")
                .addClass("col-sm-6")
                .append($("<div/>")
                    .addClass("pull-right")
                    .append($("<button/>")
                        .addClass("btn btn-default hidden edit-button")
                        .click(function () {
                            cartItem
                                .find(".package-text, .amount-text, .edit-button, .unpull-button")
                                .each(function () {
                                    $(this).addClass("hidden");
                                })
                                .end()
                                .find(".package-select, .amount-input, .done-button, .delete-button")
                                .each(function () {
                                    $(this).removeClass("hidden");
                                })
                                .end()

                            updateEntryPackageTypeOptions(cartItem.find(".item-input"), item.ProductID)
                        })
                        .text("Edit")
                )
                    .append($("<button/>")
                        .addClass("btn btn-default hidden done-button")
                        .click(function () {
                            cartItem
                                .find(".package-text, .amount-text, .edit-button, .unpull-button")
                                .each(function () {
                                    $(this).removeClass("hidden");
                                })
                                .end()
                                .find(".package-select, .amount-input, .done-button, .delete-button")
                                .each(function () {
                                    $(this).addClass("hidden");
                                })
                                .end()

                            handleDirtyItems(cartItem);
                        })
                        .text("Done")
                )
                    .append($("<button/>")
                        .addClass("btn btn-default hidden delete-button")
                        .click(function () {
                        })
                        .text("Delete")
                )
                    .append($("<button/>")
                        .addClass("btn btn-default unpull-button")
                        .click(function () { /* TODO Unpull() */
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
    var total = parseInt(item.UnitsPerPackage) * parseInt(item.NumPackages);
    var sName = item.PackageName + " of " + item.UnitsPerPackage + " * " + item.NumPackages + " = " + total;
    var color = "Marker: " + (item.Marker || "");
    var location = "Location: " + (item.Location || "");

    var cartItemEntry = $("<div/>")
        .addClass("row item-entry")
        .data("dirty", false)
        .append($("<div/>")
            .addClass("col-sm-8 form-group item-input")
            .append($("<div/>")
                .addClass("row")
                .append($("<div/>")
                    .addClass("col-sm-5")
                    .append($("<div/>")
                        .addClass("package-text")
                        .text(item.PackageName + " of " + item.UnitsPerPackage)
                        .attr("name", item.PackageName)
                        .data("size", item.UnitsPerPackage)
                )
                    .append($("<select/>")
                        .addClass("form-control hidden package-select")
                        .change(function () {
                            var selected = cartItemEntry.find(".package-select option:selected");
                            cartItemEntry.find(".total-text").text(parseInt(selected.data("size")) * parseInt(cartItemEntry.find(".amount-input").val()));

                            cartItemEntry.find(".package-text")
                                .attr("name", selected.attr("name"))
                                .data("size", selected.data("size"))
                                .text(selected.val());

                            updateTotal(parent);
                            cartItemEntry.data("dirty", true);
                        })
                )
            )
                .append($("<div/>")
                    .addClass("col-sm-1 text-center")
                    .css("font-size", "150%")
                    .text("*")
            )
                .append($("<div/>")
                    .addClass("col-sm-3")
                    .append($("<div/>")
                        .addClass("amount-text")
                        .text(item.NumPackages)
                )
                    .append($("<input/>")
                        .addClass("form-control hidden amount-input")
                        .attr("type", "number")
                        .attr("min", 0)
                        .val(parseInt(item.NumPackages))
                        .change(function () {
                            var selected = cartItemEntry.find(".package-select option:selected");
                            cartItemEntry.find(".total-text").text(parseInt(selected.data("size")) * parseInt(cartItemEntry.find(".amount-input").val()));

                            cartItemEntry.find(".amount-text")
                                .text(cartItemEntry.find(".amount-input").val());

                            updateTotal(parent);
                            cartItemEntry.data("dirty", true);
                        })
                )
            )
                .append($("<div/>")
                    .addClass("col-sm-1 text-center")
                    .text("=")
            )
                .append($("<div/>")
                    .addClass("col-sm-2 total-text")
                    .text(total)
            )
        )
    )
        .append($("<div/>")
            .addClass("col-sm-2")
            .text(color)
    )
        .append($("<div/>")
            .addClass("col-sm-2")
            .text(location)
    )

    return cartItemEntry;
}

function updateTotal(cartItem) {
    var total = 0;

    cartItem.find(".total-text").each(function () {
        total += parseInt($(this).text()) || 0;
    });

    cartItem.find(".item-total-text").text(total);
}

// Prototype edit feature functions
function handleDirtyItems(cartItem) {
    // TODO post to route to update item
    var refresh = false;

    cartItem.find(".item-entry").each(function () {
        if ($(this).data("dirty")) {
            console.log("Dirty: Package: " + $(this).find(".package-select option:selected").text() + ", Amount: " + $(this).find(".amount-input").val());
            refresh = true;
            $(this).data("dirty".false);
        }
    });

    if (refresh) refreshCartEntry(cartItem); //refresh after done calling route
}

function refreshCartEntry(cartEntry) {
    cartEntry.find(".item-entry").each(function () {
        $(this).remove();
    })

    var idSelected = $("#selectDropDown :selected").val();

    $.get(window.apiRoute + "/Carts/GetCartItems/" + idSelected, function (res) {
        var items = JSON.parse(res)[0];

        items.forEach(function (item) {
            if (cartEntry.find(".item-name").text() != item.ProductName) {
                return;
            }

            var itemEntry = createItemEntry(item, cartEntry);
            cartEntry.append(itemEntry);

            updateTotal(cartEntry);
        });
    }).fail(function (res) {
        $("#response").text("Error: displayCartInventory: Connection error.");
    });
}

//Updates the options for the package types of a single entry.
function updateEntryPackageTypeOptions(input, productId) {
    $.get(window.apiRoute + "/GetSizeByProductID/" + productId, function (res) {
        var packageTypes = $.parseJSON(res);

        input.each(function () {
            var select = $(this).find(".package-select").empty();

            packageTypes.forEach(function (each) {
                $("<option/>")
                    .text(each.Name + " of " + each.Size)
                    .attr("name", each.Name)
                    .data("size", each.Size)
                    .data("sizeMapId", each.SizeMapID)
                    .appendTo(select);
            });

            // Select the correct package type
            var name = $(this).find(".package-text").attr("name");
            select.find("option[name='" + name + "']").prop("selected", true);
        });
    }).fail(function (res) {
        $("#response").text("Error: Update package types: Connection error.");
    });
}

function showPrototypeButtons() {
    var cartContainer = $("#inventory-container")
        .empty();

    if ($("#selectDropDown :selected").val() == -1) return;

    state.nameSelected = $("#selectDropDown :selected").text();
    navigation.saveState(state);
    var idSelected = $("#selectDropDown :selected").val();

    $.get(window.apiRoute + "/Carts/GetCartItems/" + idSelected, function (res) {
        var items = JSON.parse(res)[0];
        populateCartContainer(items);
        $("#inventory-container .edit-button").removeClass("hidden");
    }).fail(function (res) {
        $("#response").text("Error: displayCartInventory: Connection error.");
    });
}

function hidePrototypeButtons() {
    displayCartInventory();
}
