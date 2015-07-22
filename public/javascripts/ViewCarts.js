/**
 * Created by Kun on 7/19/2015.
 */

var ViewCarts={



    init: function(){
        var scID = state.CartIDSelected;

        this.PopulateCart(function(){
            if (state && state.CartIDSelected) {
                $('#selectCart').val(scID);
            }
        });

        if (state && state.CartIDSelected) {
            this.BindPage(scID);
        }

        if(window.args.ProductID != null) {
            this.AddNewCartItem();
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
        $('#selectCart').empty()

        var user = 'don';
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
        $("#divCalc").show();
        $("#lblNewProductToPull").text(window.args.ProductName);
        this.PopulateSize();
    },


    PopulateSize: function(){
        var inputChild = $( '.InputChild').first();
        var dropdown = $(inputChild).find('.Size')
        var addNew = new Option("New ---", -1);
        $(dropdown).append($(addNew));
        var productID = window.args.ProductID;

        navigation.hit("/GetSizeByProductID/" + productID,function(res){
            var temp = $.parseJSON(res);

            for (var i = 0; i < temp.length; i++) {
                var obj = temp[i];
                var optionname = obj.Name + "---" + obj.Size;
                var option = new Option(optionname, obj.SizeMapID);
                var exist = 0;
                $(dropdown).append($(option));
            }
        });

    },



    SizeOnChange: function(dropdown){
        var selectedValue = dropdown.value;

        this.ReCalculate();
    },

    LocationOnChange: function(){
        this.ReCalculate();
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

    DoneAdding: function(){
        $("#divCalc").hide();
        this.ReBindPage($("#selectCart").val());
    },


    CleanPage: function(cartIDSelected){
        var temp = ($("#divProductsContainer").children())[0];
        $("#divProductsContainer").empty();
        $(temp).appendTo("#divProductsContainer");
    },

    PopulateSizeByProductID: function(dropdown,pID,sizeMapID){

        var productID = pID;
        navigation.hit("/GetSizeByProductID/" + productID,function(res){
            var temp = $.parseJSON(res);

            for (var i = 0; i < temp.length; i++) {
                var obj = temp[i];
                var optionname = obj.Name + "---" + obj.Size;
                var option = new Option(optionname, obj.SizeMapID);
                var exist = 0;
                $(dropdown).append($(option));
            }
            dropdown.val(sizeMapID);
        });

    },

    BindPage: function(cartID){
        navigation.hit("/Carts/GetCartModelByCartID/" + cartID,function(res){
            if(res == 'empty')
                return;
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
                    $(pnameLabel).text(productName);
                    $(newProductContainer).appendTo("#divProductsContainer");

                    var items = product.items;
                    var itemLen = items.length;

                    var locs = product.availableByLocations.locations;
                    var avlQty = product.availableByLocations.available;

                    var viewRow = $(newProductContainer).children('.divItemRowView');
                    var editRow = $(newProductContainer).children('.divItemRowEdit');

                    for (i = 0; i < itemLen; i++) {

                        subtotal = items[i].amountPerPackage * items[i].packageCount;
                        total = total + items[i].amountPerPackage * items[i].packageCount;
                        var sizeText = items[i].sizeName + " of " + items[i].amountPerPackage;
                        var sizeMapID = items[i].sizeMapID;

                        var newEditRow = editRow.clone();
                        var sizeSelect = $(newEditRow).find('.Size');

                        ViewCarts.PopulateSizeByProductID(sizeSelect,productID,sizeMapID);
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
                        $(newRow).show();
                        newRow.appendTo(newProductContainer);

                    }

                    var lbTotal = $(newProductContainer).find(".lbProductTotal");
                    $(lbTotal).text(" with Quantity of "+total+" in Cart");
                    var btns = $(newProductContainer).find('.divEditPullButtons');
                    $(btns).show();


                }
            });
        });
    },

    Edit: function(button){
        $(button).parent().hide();
        var oneProd = $(button).parent().parent();
        $(oneProd).find('.divDoneEditButtons').show();
        var editRows = $(oneProd).children('.divItemRowEdit');
        var viewRows = $(oneProd).children('.divItemRowView');
        var viewRowsLen = viewRows.length;
        for (i = 1; i < viewRowsLen; i++) {
            $(viewRows[i]).hide();
            $(editRows[i]).show();
        }
    },

    DoneEditing: function(button){
        $(button).parent().hide();
        var oneProd = $(button).parent().parent();
        $(oneProd).find('.divEditPullButtons').show();
        var editRows = $(oneProd).children('.divItemRowEdit');
        var viewRows = $(oneProd).children('.divItemRowView');
        var viewRowsLen = viewRows.length;
        for (i = 1; i < viewRowsLen; i++) {
            $(viewRows[i]).show();
            $(editRows[i]).hide();
        }
    },

    Pull: function(button){
        $(button).parent().hide();
        var oneProd = $(button).parent().parent();
        $(oneProd).find('.divUnpullButton').show();
    },

    Unpull: function(button){
        $(button).parent().hide();
        var oneProd = $(button).parent().parent();
        $(oneProd).find('.divEditPullButtons').show();
    },


    ReBindPage: function(cartID){


        navigation.hit("/Carts/GetCartModelWithProductID/" + cartID,function(res){

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

    }










}