var editProduct = {
    product: null,

    init: function () {
        //TODO use john's breadcrumb loader to load a new page here populated with the data.
        $("#item_name").text(window.args.ProductName);
        editProduct.getCustomers();


        var self = this;

        navigation.get(window.apiRoute + "/EditProduct/" + window.args.ProductID, function (err, res) {
            if(res) {
                self.product = $.parseJSON(res)[0];
                $("#product_name_text").text(self.product.Name);
                $("#description_text").text(self.product.Description);
                $("#product_name_input").val(self.product.Name); //fill Item Name
                $("#description_input").val(self.product.Description); //fill Description

                $("#edit_button").prop("disabled", false);
            }
        });
    },

    getCustomers:function() {
        var host = window.apiRoute + "/getCustomers/";
        navigation.get(host, function(err, response) {
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
                navigation.get(window.apiRoute + "/FindAssociatesByProductID/" + window.args.ProductID, function (err, res) {
                    if(res) {
                        var associates = JSON.parse(res);
                        for (var i = 0; i < associates.length; i++) {
                            if (customer.CustomerID == associates[i].CustomerID) {
                                newRow.find(".checkbox_input").prop('checked', true);
                            }
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

        navigation.get(host, function(err, response) {
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
        navigation.get(host, function(err, response){
            if(err){
                $("#message").text("Error: " + err.responseText);
            }
            else if( response == "Success" ){
                editProduct.submit();
            } else {
                $("#message").text("Error: " + response);
            }
        });

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
            navigation.get(host, function(err, response){
                if(err){
                    $("#message").text("Error: " + err.responseText);
                }
                else if( response != "Success" ){
                    $("#message").text("Error: " + response);
                }
            })
        });

        //submit name and descricption change:
        navigation.get(window.apiRoute +"/reSubmit/" + window.args.ProductID +"/" + name + "/" + description, function(err, response){
            if(err){
                $("#message").text("Error: " + err.responseText);
            }
            else if( response != "Success" ){
                $("#message").text("Error: " + response);
            }
            else {
                navigation.go("DisplayInventory.html");
            }
        })
    },

    back: function () {
        navigation.go(window.args.PreviousPage, {ProductID: window.args.ProductID});
    }
};







