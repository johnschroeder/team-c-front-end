/**
 * Created by elijah on 6/21/15.
 */
var state = window.state;
function populateByCartId(){
    //TODO when function runs we need to make sure that if there is a state.nameSelected that it is put in the selected option on run.
    //TODO when users is able to be gotten dynamicly, change "don" to + userid; so it grabs the carts for the user
    var user = 'don';
    $.get(window.apiRoute + "/Carts/GetCartsByUser/" + user, function(res) {
        if(res && res.length) {
            var dropSelect = document.getElementById("selectDropDown");
            var results = JSON.parse(res);

            for(var i = 0; i < results.length; i++ ) {
                var option = document.createElement("option");
                option.value = results[i].CartID;
                if(!(typeof state === 'undefined')) {
                    if (results[i].CartName == state.nameSelected) {
                        option.attr = ("selected");
                    }
                }
                option.text = results[i].CartName;
                dropSelect.add(option);
            }
        }
        else {
            $("#response").text("Error: Init: No response.");
        }
    }).fail(function(res) {
        $("#response").text("Error: Init: Connection error.");
    });
}

function displayCartInventory(){
    $("#inventory-container").empty();
    var cartContainer = $("#inventory-container");
    var cartList = $(document.createElement("div"))
        .appendTo(cartContainer);

    console.log("nameselected:" + $("#selectDropDown :selected").text());

    state.nameSelected = $("#selectDropDown :selected").text();
    navigation.saveState(state);
    var idSelected = $("#selectDropDown :selected").val();

    $.get(window.apiRoute + "/Carts/GetCartItems/" + idSelected, function(res) {
        if (res && res.length) {
            var items = JSON.parse(res)[0];
            populateCartContainer(items);
        }
        else {
            $("#response").text("Error: Init: No response.");
        }
    }).fail(function(res) {
        $("#response").text("Error: Init: Connection error.");
    });
}
function pullAll(){
    var name = $("#selectDropDown :selected").text();
    var cartName = prompt("Please confirm that -- " + name + " -- is the cart you want to pull by typing in the cart name.");

    if(cartName == name) {
        $("#pullAllButton")
            .text("Ship Cart!")
            .prop("onclick", null)
            .off("click");
    }
}
function doNothing(){
    $("#response").text("Shipment sent!");
}

function gotoEditCarts(){
        state.nameSelected = $("#selectDropDown :selected").text();
        navigation.saveState(state);
        var idSelected = $("#selectDropDown :selected").val();
        navigation.go('EditCartData.html',{cartID: idSelected, cartName: state.nameSelected});
}

function gotoEditItems(){
    state.nameSelected = $("#selectDropDown :selected").text();
    navigation.saveState(state);
    var idSelected = $("#selectDropDown :selected").val();
    navigation.go('EditCartItems.html',{cartID: idSelected, cartName: state.nameSelected, previousPage: "ViewCarts.html"});
}

function populateCartContainer(items){
    var cartContainer = $("#inventory-container")
        .empty();

    var cartList = $("<div/>")
        .appendTo(cartContainer);

    for(var i = 0; i < items.length; ++i) {
        var name = items[i].ProductName.toString();
        var total = items[i].Total.toString();
        var sName  = items[i].SizeName.toString() + " of " + items[i].CountPerBatch.toString() + " * " + items[i].BatchCount.toString()+  " = " + total;
        var color = "Run Color/Marker: " + items[i].Marker.toString();
        var location = "Location: "+ items[i].Location.toString();

        var cartItem = $("<div/>")
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
                .append($("<div/>")
                    .addClass("col-sm-4")
                    .text(sName)
                )
                .append($("<div/>")
                    .addClass("col-sm-4 text-center")
                    .text(color)
                )
                .append($("<div/>")
                    .addClass("col-sm-4 text-right")
                    .text(location)
                )
            )
            .appendTo(cartList)
    }
}
