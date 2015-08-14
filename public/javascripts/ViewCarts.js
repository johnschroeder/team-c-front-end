/**
 * Created by Kun on 7/19/2015.
 */

var CartView={



    init: function(){
        var scID
        if(window.args.CartID === undefined) {
            scID = state.CartIDSelected;
        } else {
            scID = window.args.CartID;
        }

        
        if(typeof window.state.productUnderEdit === 'undefined')
            window.state.productUnderEdit = [];
        this.PopulateCart(function(){
            if (state && state.CartIDSelected) {
                $('#selectCart').val(scID);
            }
        });


        if(window.args.ProductID != null) {
            CartView.AddNewCartItem();

            window.setInterval(CartView.AddRowOnChange, 5000);


             var productID = window.args.ProductID;
             var products = window.state.productUnderEdit;
             var hasProduct = false;
             $.each(products, function(i,obj) {
             if (obj.pID === productID)
             hasProduct = true;
             });
             if(hasProduct == false)
             window.state.productUnderEdit.push({"pID":productID.toString()});

        }

        if (state && state.CartIDSelected) {
            this.BindPage(scID);
        }
    },

    CartOnChange: function( dropdown ) {
        var cartIDSelected=$("#selectCart").val();
        if(cartIDSelected == -1)
            return;
        var state = window.state;
        state.CartIDSelected = $("#selectCart").val();
        navigation.saveState(state);
        this.CleanPage(cartIDSelected);
        this.BindPage(cartIDSelected);
    },

    PopulateCart: function(callback){
        //clean existing options
        $('#selectCart').empty();
        var option = $("<option/>")
            .val(0)
            .text("Please select cart")
            .appendTo('#selectCart');
        option = $("<option/>")
            .val(1)
            .text("--- New Cart ---")
            .appendTo("#selectCart");
        var user = 'don';
        var assignee = 'don';
        $('#selectCart').on('change', function() {
            if($(this).find('option:selected').text()=="--- New Cart ---" ){
                var cartName = window.prompt("Enter job ID:", "Job ID");
                navigation.hit("/Carts/CreateCart/" + cartName + "/" + user  + "/" + assignee + "/" + 5,
                                function(res) {
                                    state.CartIDSelected = res;
                                    console.log("STUFF");
                                    $('#sel1').off('change');
                                    navigation.go("ViewCarts.html", {CartID: res,
                                                    ProductID: window.args.ProductID});
                                });
            }
        });
        navigation.hit("/Carts/GetCartsByUser/" + user,function(res){
            var results = JSON.parse(res);

            for (var i = 0; i < results.length; ++i) {
                var option = $("<option/>")
                    .val(results[i].CartID)
                    .text(results[i].CartName)
                    .appendTo('#selectCart');
            }
            callback();
        });
    },


    AddNewCartItem: function(){
        var addItemCalc = $("#addItemCalc");
        addItemCalc.show();
        $("#lblNewProductToPull").text(window.args.ProductName);
        var sizeDropdown = $(addItemCalc).find('.Size');
        var locationDropdown = $(addItemCalc).find('.Location');
        var productID = window.args.ProductID;

        navigation.hit("/carts/getproductforaddrow/" + productID,function(res){
            console.log(res)
            var locationSize = res.availableByLocations.locations.length;
            var sizeSize = res.sizes.length;
            for(var i = 0; i < locationSize; ++i){
                var optionname = res.availableByLocations.locations[i] + "---" + res.availableByLocations.available[i] + " still available";
                var option = new Option(optionname, res.availableByLocations.locations[i]);
                $(locationDropdown).append($(option));
            }
            for(var i = 0; i < sizeSize; ++i){
                var obj = res.sizes[i];
                var optionname = obj.name + "---" + obj.amountPerPackage;
                var option = new Option(optionname, obj.sizeMapID);
                $(sizeDropdown).append($(option));
            }
        });

    },



    AddRowOnChange: function(){
        var row = $('#addItemCalc');
        var legal = CartView.RowRecalculate(row);
        var cartItemID = $(row).find('.CartItemID').text();
        if(legal == false){
            alert("There is not enough inventory in the selected location.");
            CartView.addNewCartItem();
            $('#btnAddRow').prop('disabled', true);
            return false;
        }
        else{
            $('#btnAddRow').prop('disabled', false);
            return true;
        }
    },

    addNewProductRow: function(button){
        if(window.state.CartIDSelected != 0 && CartView.AddRowOnChange()) {
            var row = $(button).parent();
            console.log($(row).find('.Size').find('option:selected').val())
            var dirtyRow = {
                "cartItemID": -1,
                "cartID": window.state.CartIDSelected,
                "productID": window.args.ProductID,
                "location": $(row).find('.Location').find('option:selected').val(),
                "packageSize": $(row).find('.Size :selected').text().split('---', 2)[1],
                "packageCount": $(row).find('.Count').val(),
                "sizeMapID": $(row).find('.Size').find('option:selected').val()
            };
            navigation.hit("/Carts/PutCartModel/" + JSON.stringify(dirtyRow), function (res) {
                if (res == "Success") {
                    CartView.BindPage(window.state.CartIDSelected);
                    //or parseresult
                    $("#addItemCalc").hide();
                }
            });
        }
    },

    DoneAdding: function(){
        $("#divCalc").hide();
        this.ReBindPage($("#selectCart").val());
    },

    ReCalculate: function(){
        //decrease calculate ability
        //increase hit by ReBindPage

        var size = $('#InputDiv').children('.InputChild').find('.Size').find('option:selected').text().split('---', 2)[1];
        if (size < 0) size = 0;
        var count = $('#InputDiv').children('.InputChild').find('.Count').val();
        var subtotal = size*count;
        $('#InputDiv').children('.InputChild').find('.Subtotal').text(subtotal);
        $('#InputDiv').children('.InputChild').find('.Color').css({"background-color":"red"});

    },




    CleanPage: function(cartIDSelected){
        var temp = ($("#divProductsContainer").children())[0];
        $("#divProductsContainer").empty();
        $(temp).appendTo("#divProductsContainer");
    },

    PopulateSizeByProductID: function(dropdown,pID,sizeMapID){

        var productID = pID;
        var products = window.state.CartModel.products;
        products.forEach(function(p){
            if(p.productID == pID){
                p.sizes.forEach(function(size){
                    var optionname = size.Name + "---" + size.Size;
                    var option = new Option(optionname, size.SizeMapID);
                    var exist = 0;
                    $(dropdown).append($(option));
                })
            }
        });

        /*for (var i = 0; i < temp.length; i++) {

        }
        if(sizeMapID) {
            dropdown.val(sizeMapID);
        }*/
    },



    BindPage: function(cartID){
        navigation.hit("/Carts/GetCartModel/" + cartID,function(res){
            var state = window.state;
            state.CartModel = res;
            navigation.saveState(state);
            if(res == 'empty') {
                return;
            }
            console.log(res);


            var template = ($('#divProductsContainer').children())[0];
            $('#divProductsContainer').empty();
            $('#divProductsContainer').append(template);
            var products = res.products;
            var oneProductContainer = ($("#divProductsContainer").children())[0];

            products.forEach(function(product){
                if(product != null) {
                    var productName = product.name;
                    var productID = product.productID;
                    var sizes = product.sizes;
                    var total = 0;

                    var newProductContainer = $(oneProductContainer).clone();
                    var pnameLabel = $(newProductContainer).find(".lbProductName");
                    var pIDLabel = $(newProductContainer).find(".lbProductID");
                    $(pnameLabel).text(productName);
                    $(pIDLabel).text(productID);

                    if(window.args.ProductID != null && window.args.ProductID == productID){
                        var firstdiv = $('#divProductsContainer').children()[0];
                        console.log(firstdiv);
                        $(newProductContainer).insertAfter($(firstdiv));

                    }
                    else{
                        $(newProductContainer).appendTo("#divProductsContainer");
                    }




                    var items = product.items;
                    var itemLen = items.length;

                    var locs = product.availableByLocations.locations;
                    var avlQty = product.availableByLocations.available;

                    var viewRow = $(newProductContainer).children('.divItemRowView');
                    var editRow = $(newProductContainer).children('.divItemRowEdit');


                    var products = window.state.productUnderEdit;
                    var inEditMode = false;
                    $.each(products, function(i,obj) {
                        if (obj.pID == productID.toString())
                            inEditMode = true;
                    });

                    for (i = 0; i < itemLen; i++) {

                        subtotal = items[i].amountPerPackage * items[i].packageCount;
                        total = total + items[i].amountPerPackage * items[i].packageCount;
                        var sizeText = items[i].sizeName + " of " + items[i].amountPerPackage;
                        var sizeMapID = items[i].sizeMapID;

                        var newEditRow = editRow.clone();
                        var sizeSelect = $(newEditRow).find('.Size');

                        CartView.PopulateSizeByProductID(sizeSelect,productID,sizeMapID);
                        $(newEditRow).find('.CartItemID').text(items[i].cartItemID);
                        $(newEditRow).find('.Count').val(items[i].packageCount);
                        $(newEditRow).find('.Subtotal').text(subtotal);
                        $(newEditRow).find('.Location').text(items[i].location);
                        $(newEditRow).find('.Color').css({'background':items[i].color});

                        var locSelect = $(newEditRow).find('.Location');
                        for(j = 0; j < locs.length; j++){
                            var optionname = locs[j] + "---" + avlQty[j] + " still available";
                            var option = new Option(optionname, locs[j]);
                            $(locSelect).append($(option));

                        }
                        $(locSelect).val(items[i].location);
                        newEditRow.appendTo(newProductContainer);

                        var newRow = viewRow.clone();
                        $(newRow).find('.ViewSize').text(sizeText);
                        $(newRow).find('.ViewCount').text(items[i].packageCount);
                        $(newRow).find('.ViewSubtotal').text(subtotal);
                        $(newRow).find('.ViewLocation').text(items[i].location);
                        $(newRow).find('.ViewColor').css({'background':items[i].color});
                        //$(newRow).show();
                        newRow.appendTo(newProductContainer);

                        var lbTotal = $(newProductContainer).find(".lbProductTotal");
                        $(lbTotal).text(" with Quantity of "+total+" in Cart");
                        var btnsEditPull = $(newProductContainer).find('.divEditPullButtons');
                        var btnsDoneEdit = $(newProductContainer).find('.divDoneEditButtons');
                        $(btnsEditPull).show();

                        if(inEditMode == false){
                            $(newRow).show();
                            $(newEditRow).hide();
                            $(btnsEditPull).show();
                            $(btnsDoneEdit).hide();
                        }
                        else{
                            $(newRow).hide();
                            $(newEditRow).show();
                            $(btnsEditPull).hide();
                            $(btnsDoneEdit).show();
                        }



                    }

                    var addBtn = $('.addBtn').first().clone();
                    $(addBtn).appendTo(newProductContainer);

                    if(inEditMode == true){
                        $(addBtn).show();
                    }





                }
            });

            var btn = document.createElement("BUTTON");        // Create a <button> element
            var t = document.createTextNode("SHIP");       // Create a text node
            btn.setAttribute("id", "shipBtnId");

            btn.appendChild(t); // Append the text to <button>
            btn.addEventListener("click",
                function() {
                    var deleteHost = "/Carts/DeleteCart/" + cartID;
                   // alert(deleteHost);
                    navigation.hit(deleteHost,
                        function(res) {
                            if (res == "Success") {

                            alert("Shipping!");
                                navigation.go("DisplayInventory.html", null);
                        }
                            else{
                                alert(res);
                            }

                        });
                });
            $(btn).appendTo("#divProductsContainer");// .appendChild(btn);
            $(btn).hide();
        });
    },

    AddNewEditRow: function(button){
        var thisProd = $(button).parent().parent();
        var newRow = $(thisProd).children('.divItemRowEdit').first().clone();
        var productID = $(thisProd).find(".lbProductID").text();
        var sizeSelect = $(newRow).find('.Size');
        var product = false;
        var products = state.CartModel.products;
        products.forEach(function(p){
            if(p.productID == productID){
                product = p;
            }
        });
        if(!product){
            console.log("ERROR, Product not found in AddNewEditRow")
        }
        else {
            var locs = product.availableByLocations.locations;
            var avlQty = product.availableByLocations.available;
            var locSelect = $(newRow).find('.Location');
            for (j = 0; j < locs.length; j++) {
                var optionname = locs[j] + "---" + avlQty[j] + " still available";
                var option = new Option(optionname, locs[j]);
                $(locSelect).append($(option));

            }
            CartView.PopulateSizeByProductID(sizeSelect, productID, null);
            var placeToPut = $(button).parent();
            $(newRow).insertBefore(placeToPut);
            $(newRow).show();
        }
    },

    Edit: function(button){
        $(button).parent().hide();
        var oneProd = $(button).parent().parent();
        var productID = $(oneProd).find('.lbProductID').text();
        var products = window.state.productUnderEdit;
        var hasProduct = false;
        $.each(products, function(i,obj) {
            if (obj.pID === productID)
                hasProduct = true;
        });
        if(hasProduct == false)
            window.state.productUnderEdit.push({"pID":productID});
        $(oneProd).find('.divDoneEditButtons').show();
        var editRows = $(oneProd).children('.divItemRowEdit');
        var viewRows = $(oneProd).children('.divItemRowView');
        var viewRowsLen = viewRows.length;
        for (i = 1; i < viewRowsLen; i++) {
            $(viewRows[i]).hide();
            $(editRows[i]).show();
        }
        $(oneProd).find('.AddBtn').show();
    },

    DoneEditing: function(button){
        $(button).parent().hide();
        var oneProd = $(button).parent().parent();
        $(oneProd).find('.divEditPullButtons').show();
        var editRows = $(oneProd).children('.divItemRowEdit');
        var viewRows = $(oneProd).children('.divItemRowView');
        var editRowsLen = editRows.length;

        var productID = $(oneProd).find('.lbProductID').text();
        var products = window.state.productUnderEdit;
        var hasProduct = false;
        $.each(products, function(i,obj) {
            if (obj.pID === productID)
                hasProduct = true;
        });
        if(hasProduct == true)
            window.state.productUnderEdit.pop({"pID":productID});

        for (i = 1; i < editRowsLen; i++) {
            $(viewRows[i]).show();
            $(editRows[i]).hide();
        }
        $(oneProd).find('.AddBtn').hide();
    },

    Pull: function(button){
        $(button).parent().hide();
        var oneProd = $(button).parent().parent();
        $(oneProd).find('.divUnpullButton').show();

        var readyToShip = true;
        $(".btnPull").each(function(){


            if ($(this).is(":visible"))
            {
                readyToShip = false;
            }
        });

        if (readyToShip)
        {
            document.getElementById('shipBtnId').style.display = "";
        }

    },

    Unpull: function(button){
        $(button).parent().hide();
        var oneProd = $(button).parent().parent();
        $(oneProd).find('.divEditPullButtons').show();
        document.getElementById('shipBtnId').style.display = "none";
    },


    RowItemOnChange: function(input){
        console.log(input);
        var row = $(input).parent().parent();
        var legal = this.RowRecalculate(row);
        var cartItemID = $(row).find('.CartItemID').text();
        if(legal == false){
            this.BindPage(row);
            alert("There is not enough inventory in the selected location.");
        }
        else{

            this.BindPage(row);
        }

    },


    RowRecalculate: function(row){
        var dirtyCartItemID = $(row).find('.CartItemID').text();
        var originalCount = 0;
        window.state.CartModel.products.forEach(function (product) {
            product.items.forEach(function (item) {
                if (item.cartItemID == dirtyCartItemID) {
                    originalCount = item.packageCount;
                }
            });
        });
        var sizeNumber = $(row).find('.Size :selected').text().split('---', 2)[1];
        var count = $(row).find('.Count').val();
        var diffCount = count - originalCount;
        var available = ($(row).find('.Location').find('option:selected').text().split('---', 2)[1]).split('still',2)[0];
        //alert(available + ", " + sizeNumber + ", " + diffCount);
        if(available<sizeNumber*diffCount){
            count = (available - available%sizeNumber)/sizeNumber;
            $(row).find('.Count').val(count);
            $(row).find('.Subtotal').text(count*sizeNumber);
            return false;
        }
        else{
            $(row).find('.Subtotal').text(count*sizeNumber);
            return true;
        }
    },


    ReBindPage: function(row){
        var cartID = $("#selectCart").val();
        var productID = $(row).parent().find('.lbProductID').text();
        var cartItemID = $(row).find('.CartItemID').text();
        var sizeMapID = $(row).find('.Size').val();
        var packageCount = $(row).find('.Count').val();
        var location = $(row).find('.Location').val();
        var sizeSelect = $(row).find('.Size');
        var packageSizeOption = $(sizeSelect).find('option:selected').text();
        var packageSize = (packageSizeOption.split('---'))[1];

        var dirtyRow = {"cartID":cartID,
            "productID":productID,
            "cartItemID":cartItemID,
            "sizeMapID":sizeMapID,
            "packageSize":packageSize,
            "packageCount":packageCount,
            "location":location
        };

        navigation.hit("/Carts/PutCartModel/" +  JSON.stringify(dirtyRow),function(res){
            if(res=="Success"){
                CartView.BindPage(cartID);
                //or parseresult

            }
        });


        /*
        var cartModel = window.state.CartModel;
        var index;
        for(k=0; k<cartModel.products.length; k++){
            if(cartModel.products[k].productID == productID){
                index = k;
            }
        }
        var items = cartModel.products[index].items;

        cartModel.products[index].items.forEach(function(item){
            if(item.cartItemID == cartItemID){
                //can update more.....but below are the critical ones
                item.sizeMapID = sizeMapID;
                item.packageCount = packageCount;
                item.location = location;
                item.dirty = true;
            }
        });
        window.state.CartModel = cartModel;
        navigation.saveState(window.state);

        var mmm = window.state.CartModel;
//console.log(JSON.stringify(mmm));
        */


        //hit backend with window.state.CartModel
        /*
        navigation.hit("/Carts/GetCartModelWithProductID/" + cartID,function(res){
            //compare res with current webpage values loop through only that product's items rows



            var products = res.products;

            products.forEach(function(product){
                if(product != null) {
                    var productName = product.name;
                    var productID = product.productID;
                    var sizes = product.sizes;
                    //console.log(productName+ ' ' + productID);
                    //console.log(sizes);


                }
            });
        });
        */

    }










}