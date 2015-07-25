var editProduct = {
    product: null,

    init: function () {
        //TODO use john's breadcrumb loader to load a new page here populated with the data.
        $("#item_name").text(window.args.ProductName);
        editProduct.getCustomers();


        var self = this;

        $.get(window.apiRoute + "/EditProduct/" + window.args.ProductID, function (res) {
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
        var host = window.apiRoute + "/getCustomers/";
        $.get(host, function(response) {
            if(response && response.length) {
                editProduct.customers = JSON.parse(response);
                editProduct.populateCustomers();
            } else {
                console.log("There was an error retrieving customers.");
            }
        })
    },
    populateCustomers: function() {
        if(editProduct.customers) {
            var rowToCopy = $(".customer_checkbox").first();
            var rowsContainer = $("#checkbox_cont");
            rowsContainer.empty();

            editProduct.customers.forEach(function(customer) {
                var newRow = rowToCopy.clone();
                newRow.find(".checkbox_label").text(customer.Name);
                $.get(window.apiRoute + "/FindAssociatesByProductID/" + window.args.ProductID, function (res) {
                    var associates = JSON.parse(res);
                    for (var i = 0; i < associates.length; i++) {
                        if (customer.CustomerID == associates[i].CustomerID) {
                            newRow.find(".checkbox_input").prop('checked', true);
                        }
                    }

                });
                newRow.removeClass("hidden");
                newRow.appendTo( rowsContainer );
                newRow.attr("data-ID", customer.CustomerID);
            });
        }
    },

    addCustomer:function() {
        $("#add_customer").addClass("hidden");
        $("#add_customer_text").removeClass("hidden");
        $("#submit_customer").removeClass("hidden");
    },

    submitCustomer:function() {
        var newCustomer = $("#new_customer_text").val();
        var host = window.apiRoute + "/addCustomer/" + newCustomer;

        $.get(host, function(response) {
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
        var host = window.apiRoute
            + "/removeCustomersByProductID/"
            + window.args.ProductID;
        $.get(host,function(response){
            if( response == "Success" ){
                editProduct.submit();
            } else {
                $("#message").text("Error: " + response);
            }
        }).fail(function(err) {
            $("#message").text("Error: " + err.responseText);
        })

    },

    submit: function(){
        //get new item Name and description
        var name = $("#product_name_input").val();
        var description = $("#description_input").val();
        console.log("name: " + name);
        console.log("description: " + description);

        //get and submit checked boxes:
        var customerContainer = $("#checkbox_cont").children();
        customerContainer.each(function() {
            if ($(this).find(".checkbox_input")[0].checked) {
                var host = window.apiRoute
                    + "/associateProductCustomer/"
                    + window.args.ProductID + "/"
                    + $(this).data().id;
            }
            $.get(host,function(response){
                if( response != "Success" ){
                    $("#message").text("Error: " + response);
                }
            }).fail(function(err) {
                $("#message").text("Error: " + err.responseText);
            })
        });

        //submit name and descricption change:
        $.get(window.apiRoute +"/reSubmit/" + window.args.ProductID +"/" + name + "/" + description, function(response){
            if( response != "Success" ){
                $("#message").text("Error: " + response);
            }
            navigation.go("DisplayInventory.html");
        }).fail(function(err) {
            $("#message").text("Error: " + err.responseText);
        })
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







