/**
 * Created by elijah on 6/21/15.
 */

var state = window.state;

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

    var cartList = $("<div/>")
        .appendTo(cartContainer);

    for (var i = 0; i < items.length; ++i) {
        cartList.append(createItemEntry(items[i]));
    }
}

function createItemEntry(item) {
    var name = item.ProductName;
    var total = parseInt(item.UnitsPerPackage) * parseInt(item.NumPackages);
    var sName  = item.PackageName + " of " + item.UnitsPerPackage + " * " + item.NumPackages + " = " + total;
    var color = "Run Color/Marker: " + item.Marker;
    var location = "Location: "+ item.Location;

    var inputDiv = $("<div/>");

    var cartItem = $("<div/>")
        .addClass("form-group")
        .append($("<hr/>"))
        .append($("<div/>")
            .addClass("row")
            .append($("<div/>")
                .addClass("col-sm-6")
                .text("Pulled")
            )
            .append($("<div/>")
                .addClass("col-sm-6")
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
                .append($("<button/>")
                    .addClass("btn btn-default pull-right")
                    .attr("onclick", "unPullButton(unPull, pulledText, cartItem)")
                    // Tip: Don't use onclick attribute. Use .click(function() { /* javascript implementation */ })
                    .text("Unpull Item")
                )
            )
        )
        .append($("<div/>")
            .addClass("row")
            .append($("<div/>")
                .addClass("col-sm-6 productName")
                .text(name)
            )
            .append($("<div/>")
                .addClass("col-sm-6 text-right")
                .text(total)
            )
        )
        .append($("<div/>")
            .addClass("row")
            .append(inputDiv
                .addClass("col-sm-6 input-div")
                .append($("<div/>")
                    .addClass("col-sm-4")
                    .append($("<div/>")
                        .addClass("package-text")
                        .text(item.PackageName + " of " + item.UnitsPerPackage)
                    )
                    .append($("<select/>")
                        .addClass("form-control hidden package-select")
                        .change(function() {
                            // TODO update total
                            inputDiv.data("dirty", true);
                        })
                    )
                )
                .append($("<div/>")
                    .addClass("col-sm-1")
                    .text(" * ")
                )
                .append($("<div/>")
                    .addClass("col-sm-4")
                    .append($("<div/>")
                        .addClass("amount-text")
                        .text(item.NumPackages)
                    )
                    .append($("<input/>")
                        .addClass("form-control hidden amount-input")
                        .attr("type", "number")
                        .val(parseInt(item.NumPackages))
                        .change(function() {
                            // TODO update total
                            inputDiv.data("dirty", true);
                        })
                    )
                )
                .append($("<div/>")
                    .addClass("col-sm-1")
                    .text(" = ")
                )
                .append($("<div/>")
                    .addClass("col-sm-2 total-text")
                    .text(total)
                )
            )
            .append($("<div/>")
                .addClass("col-sm-3 text-center")
                .text(color)
            )
            .append($("<div/>")
                .addClass("col-sm-3 text-right")
                .text(location)
            )
        )

    return cartItem;
}

function handleDirtyInput(input) {
    if (!input.data("dirty")) return;

    // TODO post to route to update item
    console.log("Input is dirty.")
}
