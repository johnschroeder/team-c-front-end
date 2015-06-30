/**
 * Created by elijah on 6/21/15.
 */

var state = window.state;
//<script>
function populateByCartId() {
    //TODO when function runs we need to make sure that if there is a state.nameSelected that it is put in the selected option on run.
    //TODO when users is able to be gotten dynamicly, change "don" to + userid; so it grabs the carts for the user
    var user = 'don';
    $.get(window.apiRoute + "/Carts/GetCartsByUser/" + user, function(res) {
        if (res && res.length) {
            var dropSelect = $("#selectDropDown");
            var results = JSON.parse(res);

            dropSelect
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
        }
        else {
            $("#response").text("Error: populateByCartId: No response.");
        }
    }).fail(function(res) {
        $("#response").text("Error: populateByCartId: Connection error.");
    });
}

function displayCartInventory() {
    var cartContainer = $("#inventory-container")
        .empty();

    if ($("#selectDropDown :selected").val() == -1) return;

    var cartList = $("<div/>")
        .appendTo(cartContainer);

    console.log("Selected: " + $("#selectDropDown :selected").text());

    state.nameSelected = $("#selectDropDown :selected").text();
    navigation.saveState(state);
    var idSelected = $("#selectDropDown :selected").val();

    $.get(window.apiRoute + "/Carts/GetCartItems/" + idSelected, function(res) {
        if (res && res.length) {
            var items = JSON.parse(res)[0];
            populateCartContainer(items);
        }
        else {
            $("#response").text("Error: displayCartInventory: No response.");
        }
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
        state.nameSelected = $("#selectDropDown :selected").text();
        navigation.saveState(state);
        var idSelected = $("#selectDropDown :selected").val();
        navigation.go('EditCartData.html',{cartID: idSelected, cartName: state.nameSelected});
}

function gotoEditItems() {
    state.nameSelected = $("#selectDropDown :selected").text();
    navigation.saveState(state);
    var idSelected = $("#selectDropDown :selected").val();
    navigation.go('EditCartItems.html',{cartID: idSelected, cartName: state.nameSelected, previousPage: "ViewCarts.html"});
}

function populateCartContainer(items) {
    var cartContainer = $("#inventory-container")
        .empty();

    var cartItem = null

    for (var i = 0; i < items.length; ++i) {
        if (!cartItem || cartItem.find(".item-name").text() != items[i].ProductName) {
            cartItem = $("<div/>")
                .addClass("cart-item")
                .append($("<hr/>"))
                .append($("<div/>")
                    .addClass("row")
                    .append($("<div/>")
                        .addClass("col-sm-8")
                        .append($("<h2/>")
                            .addClass("item-name")
                            .text(items[i].ProductName)
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
                        .append($("<button/>")
                            .addClass("btn btn-default pull-right")
                            .click(function() { /* TODO Unpull() */ })
                            .text("Unpull")
                        )
                    )
                )
                .append($("<br/>"))
                .appendTo(cartContainer);
        }

        var entry = createItemEntry(items[i], cartItem)
        cartItem.append(entry);

        updateTotal(cartItem);
    }
}

function createItemEntry(item, parent) {
    var name = item.ProductName;
    var total = parseInt(item.UnitsPerPackage) * parseInt(item.NumPackages);
    var sName  = item.PackageName + " of " + item.UnitsPerPackage + " * " + item.NumPackages + " = " + total;
    var color = "Run Color/Marker: " + item.Marker;
    var location = "Location: "+ item.Location;

    var inputDiv = $("<div/>");

    var cartItem = $("<div/>")
        .addClass("row")
        .append(inputDiv
            .addClass("col-sm-7 form-group input-div")
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
                        .change(function() {
                            var selected = inputDiv.find(".package-select option:selected");
                            cartItem.find(".total-text").text(parseInt(selected.data("size")) * parseInt(inputDiv.find(".amount-input").val()));

                            inputDiv.find(".package-text")
                                .attr("name", selected.attr("name"))
                                .data("size", selected.data("size"))
                                .text(selected.val());

                            updateTotal(parent);
                            inputDiv.data("dirty", true);
                        })
                    )
                )
                .append($("<div/>")
                    .addClass("col-sm-1")
                    .text(" * ")
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
                        .change(function() {
                            var selected = inputDiv.find(".package-select option:selected");
                            cartItem.find(".total-text").text(parseInt(selected.data("size")) * parseInt(inputDiv.find(".amount-input").val()));

                            inputDiv.find(".amount-text")
                                .text(inputDiv.find(".amount-input").val());

                            updateTotal(parent);
                            inputDiv.data("dirty", true);
                        })
                    )
                )
                .append($("<div/>")
                    .addClass("col-sm-3")
                    .text(" = ")
                    .append($("<span/>")
                        .addClass("total-text")
                        .text(total)
                    )
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
        .append($("<div/>")
            .addClass("col-sm-1")
            .append($("<button/>")
                .addClass("btn btn-default pull-right edit-button")
                .click(function() {
                    inputDiv
                        .data("dirty", false)
                        .find(".package-text")
                           .addClass("hidden")
                        .end()
                        .find(".amount-text")
                           .addClass("hidden")
                        .end()
                        .find(".package-select")
                            .removeClass("hidden")
                        .end()
                        .find(".amount-input")
                            .removeClass("hidden")
                        .end();

                    cartItem
                        .find(".edit-button")
                           .addClass("hidden")
                        .end()
                        .find(".done-button")
                            .removeClass("hidden")
                        .end();

                    updateEntryPackageTypeOptions(inputDiv.find(".package-select"), item.ProductID, inputDiv)
                })
                .text("Edit")
            )
            .append($("<button/>")
                .addClass("btn btn-default pull-right hidden done-button")
                .click(function() {
                    inputDiv
                        .find(".package-text")
                           .removeClass("hidden")
                        .end()
                        .find(".amount-text")
                           .removeClass("hidden")
                        .end()
                        .find(".package-select")
                            .addClass("hidden")
                        .end()
                        .find(".amount-input")
                            .addClass("hidden")
                        .end();

                    cartItem
                        .find(".edit-button")
                           .removeClass("hidden")
                        .end()
                        .find(".done-button")
                            .addClass("hidden")
                        .end();

                        handleDirtyInput(inputDiv);
                })
                .text("Done")
            )
        )

    return cartItem;
}

function handleDirtyInput(input) {
    if (!input.data("dirty")) return;

    // TODO post to route to update item
    console.log("Input is dirty.");

    displayCartInventory(); //refresh after done calling route
}

//Updates the options for the package types of a single entry.
function updateEntryPackageTypeOptions(entry, productId, input) {
    var packageTypes = null;
    entry.empty();

    $.get(window.apiRoute + "/GetSizeByProductID/" + productId, function(res) {
        if (res && res.length) {
            packageTypes = $.parseJSON(res);

            packageTypes.forEach(function(each) {
                $("<option/>")
                    .text(each.Name + " of " + each.Size)
                    .attr("name", each.Name)
                    .data("size", each.Size)
                    .appendTo(entry);
            });

            // Select the correct package type
            var name = input.find(".package-text").attr("name");

            input.find(".package-select option[name='" + name + "']").prop("selected", true);
        } else {
            $("#response").text("Error: Update package types: No response.");
        }
    }).fail(function(res) {
        $("#response").text("Error: Update package types: Connection error.");
    });
}

function updateTotal(cartItem) {
    var total = 0;

    cartItem.find(".total-text").each(function() {
        total += parseInt($(this).text()) || 0;
    });

    cartItem.find(".item-total-text").text(total);
}
