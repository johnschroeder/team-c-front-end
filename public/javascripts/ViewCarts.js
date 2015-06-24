/**
 * Created by elijah on 6/21/15.
 */
var state = window.state;
function populateByCartId(){

    $.get(window.apiRoute + "/Carts/GetCartsByUser/don", function(res) {
        if(res && res.length) {
            var dropSelect = document.getElementById("selectDropDown");
            var results = JSON.parse(res)[0];
            var option1 =document.createElement("option");
            option1.text = 999;
            dropSelect.appendChild(option1);
            var option2 =document.createElement("option");
            option2.text = 42;
            dropSelect.appendChild(option2);
            var option3 =document.createElement("option");
            option3.text = 33;
            dropSelect.appendChild(option3);

            for(var i = 0; i < results.length; i++ ) {
                var option = document.createElement("option");
                option.value = results[i].CartID;
  /*              if(!(typeof state === 'undefined'))
                if(results[i].CartName == window.state.nameSelected){
                    option.attr("selected");
                }
    */            option.text = results[i].CartName;
                dropSelect.add(option);
            }
          /*  if(typeof state.nameSelected === 'undefined'){
            }
            else{
                var option = $(document.createElement("option"))
                    .attr("selected");
                dropSelect = state.nameSelected;
            }*/
        }
        else {
                $("#response").text("Error: Init: No response.");
            }
        }).fail(function(res) {
             $("#response").text("Error: Init: Connection error.");
        });
}

function displayCartInventory(){

    var cartContainer = $(".inventory-container");
    var cartList = $(document.createElement("div"))
        .appendTo(cartContainer);

//    state.nameSelected = $("#selectDropDown :selected").text();
//    navigation.saveState(window.state);
    var idSelected = $("#selectDropDown :selected").value;

    $.get(window.apiRoute + "/Carts/GetCartItems/" + idSelected, function(res) {
        if (res && res.length) {
            var items = JSON.parse(res)[0];
            for(var i = 0; i < items.length; i++){
                var name = items[i].ProductName.toString();
                var total = items[i].Total.toString();
                var sName  = items[i].SizeName.toString() + " of " + items[i].CountPerBatch.toString() + " * " + items[i].BatchCount.toString();

                var cartItem = $(document.createElement("div"))
                    .appendTo(cartList);
                $(document.createElement("hr"))
                    .appendTo(cartItem);
                var productName = $(document.createElement("span"))
                    .text(name)
                    .appendTo(cartItem);
                var total = $(document.createElement("span"))
                    .text(total)
                    .addClass("float_right")
                    .appendTo(cartItem);
                $(document.createElement("br"))
                    .appendTo(cartItem);
                var sizeName = $(document.createElement("span"))
                    .text(sName)
                    .appendTo(cartItem);
                cartList.append(cartItem);
            }
            cartContainer.append(cartList);

        }
        else {
            $("#response").text("Error: Init: No response.");
        }
    }).fail(function(res) {
        $("#response").text("Error: Init: Connection error.");
    });
}

/*function populateCartContainer(){
    for(var i = 0; i < cartStuff.length; i++){
        var productName = $(document.createElement("span"))
            .attr= cartStuff[i].Name;
        var cartItem = $(document.createElement("div"))
            .appendTo(cartList);

    }

}*/