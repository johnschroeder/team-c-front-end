var editProduct = {
    product: null,

    init: function () {
        $("#customer_select").multiselect({maxHeight:192});

        //TODO use john's breadcrumb loader to load a new page here populated with the data.
        $("#item_name").text(window.args.ProductName);
        editProduct.getCustomers();

        var self = this;

        navigation.hit("/EditProduct/" + window.args.ProductID, function (res) {
            self.product = $.parseJSON(res)[0];
            $("#product_name_text").text(self.product.Name);
            $("#description_text").text(self.product.Description);
            $("#product_name_input").val(self.product.Name); //fill Item Name
            $("#description_input").val(self.product.Description); //fill Description

            $("#edit_button").prop("disabled", false);
        });

        this.setupImageHandler();
    },

    getCustomers:function() {
        var host = "/getCustomers/";
        navigation.hit(host, function(response) {
            if(response && response.length) {
                editProduct.customers = JSON.parse(response);
                editProduct.populateCustomers();
            } else {
                console.log("There was an error retrieving customers.");
            }
        })
    },
    populateCustomers: function() {
        var selected = [];

        $("#customer_select option:selected").each(function(){
            selected.push($(this).val());
        });

        if(this.customers) {
            $("#customer_select").empty();

            this.customers.forEach(function(customer){
                $("#customer_select").append(
                    $("<option/>")
                        .text(customer.Name)
                        .val(customer.CustomerID)
                );
            });
        }

        navigation.hit("/FindAssociatesByProductID/" + window.args.ProductID, function (res) {
            var associates = JSON.parse(res);

            $("#customer_select option").each(function(){
                for (var i = 0; i < associates.length; ++i) {
                    if ($(this).val() == associates[i].CustomerID) {
                        $(this).prop("selected", true);
                    }
                }
            });

            selected.forEach(function(v){
                $("#customer_select option").each(function(){
                    if ($(this).val() == v) {
                        $(this).prop("selected", true);
                    }
                });
            });

            $("#customer_select").multiselect("rebuild");
        });
    },

    addCustomer:function() {
        $("#add_customer").addClass("hidden");
        $("#add_customer_text").removeClass("hidden");
        $("#submit_customer").removeClass("hidden");
    },

    submitCustomer:function() {
        var newCustomer = $("#new_customer_text").val();
        var host ="/addCustomer/" + newCustomer;

        navigation.hit(host, function(response) {
            if( response && response.length) {
                editProduct.customers.push({
                    CustomerID:response.CustomerID,
                    Name:newCustomer
                });
                $("#new_customer_text").val("");
                $("#add_customer").removeClass("hidden");
                $("#add_customer_text").addClass("hidden");
                $("#submit_customer").addClass("hidden");
                editProduct.getCustomers();
            } else {
                console.log("There was an error adding a customer");
            }
        });
    },

    breakAssociations: function() {
        var host = "/removeCustomersByProductID/"
            + window.args.ProductID;
        navigation.hit(host,function(response){
            if( response == "Success" ){
                editProduct.submit();
            } else {
                $("#message").text("Error: " + response);
            }
        });/*.fail(function(err) {
            $("#message").text("Error: " + err.responseText);
        })*/

    },

    submit: function(){
        // Get new item name and description
        var name = $("#product_name_input").val();
        var description = $("#description_input").val();

        //console.log("Name: " + name);
        //console.log("Description: " + description);

        // Associate customers
        $("#customer_select option:selected").each(function(){
            var host ="/associateProductCustomer/"
                + window.args.ProductID + "/"
                + parseInt($(this).val());

            navigation.hit(host, function(response) {
                if(response != "Success"){
                    $("#message").text("Error: " + response);
                }
            })/*.fail(function(err) {
                $("#message").text("Error: " + err.responseText);
            })*/;
        });

        // Submit name and description change
        navigation.hit("/reSubmit/" + window.args.ProductID +"/" + name + "/" + description, function(response){
            if( response != "Success" ){
                $("#message").text("Error: " + response);
            }
            navigation.go("DisplayInventory.html");
        })/*.fail(function(err) {
            $("#message").text("Error: " + err.responseText);
        })*/;
    },

    setupImageHandler:function() {

        var savedImage = navigation.makeImageURL( window.args.ProductID );
        navigation.checkImage( savedImage,
            function(){
                console.log("Image found for product");
                $('.thumbnail').html("<img src='"+savedImage+"'/>");
            },function(){
                console.log("No image found for product");
                $('.thumbnail').html("<div class='noImage'>No Image</div>");
            });

        $(':file').change(function(){
            var file = this.files[0];
            var size = file.size;
            $('#uploadFileSize').val(size);
            $('#prodIDForImg').val(window.args.ProductID);
            var type = file.type;
            if( type.indexOf("jpeg") == -1 ) {
                alert( "Sorry, jpeg images only");
                return;
            }

            var formData = new FormData($('#uploadImageForm')[0]);
            $.ajax({
                url: window.apiRoute + '/uploadImage',  //Server script to process data
                type: 'POST',
                beforeSend: function(){
                    $('.imageUpload').remove();
                    $('.uploadImageFormContainer').after( "<div class='imageUpload loading'>Uploading Image<div>" );
                    console.log("Uploading Image");
                },
                success: function( response ){
                    $('.imageUpload').removeClass("loading");
                    $('.imageUpload').html( "<img src='http://" + response +"' />" );
                },
                error: function(err){
                    $("#message").text("Error: " + err.responseText);
                },
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            });
        });
    },

    back: function () {
        navigation.go(window.args.PreviousPage, {ProductID: window.args.ProductID});
    }
};







