/**
 * Created by Kun on 7/19/2015.
 */

var ViewCarts={


    init: function(){


        this.PopulateCart();



    },

    ChooseCart: function( dropdown ) {
        var cartIDSelected=$("#selectCart").val();
        if(cartIDSelected == -1)
            return;

        this.ReBindPage(cartIDSelected);
    },

    PopulateCart: function(){
        //clean existing options
        $('#selectCart').empty()

        var user = 'don';
        navigation.hit("/Carts/GetCartsByUser/" + user,function(res){
            var results = JSON.parse(res);

            var dropSelect = $("#selectCart")
                .append($("<option/>")
                    .val(-1)
                    .text("-- Select a Cart --")
            );

            for (var i = 0; i < results.length; ++i) {
                var option = $("<option/>")
                    .val(results[i].CartID)
                    .text(results[i].CartName)
                    .appendTo(dropSelect);
            }
        });
    },




    ReBindPage: function(cartID){


        navigation.hit("/Carts/GetCartModelWithProductID/" + cartID,function(res){
            alert(cartID);
            //var results = JSON.parse(res);
            console.log(res);
        });


    }










}