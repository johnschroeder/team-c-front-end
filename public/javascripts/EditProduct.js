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
    submit: function(){
        //get new item Name and description
        var name = $("#product_name_text").val();
        var description = $("#description_text").val();

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
        }).fail(function(err) {
            $("#message").text("Error: " + err.responseText);
        })
    },

    edit: function() {
        $("#customer_text").addClass("hidden");
        $("#product_name_text").addClass("hidden");
        $("#description_text").addClass("hidden");

        $("#customer_input").removeClass("hidden");
        $("#product_name_input").removeClass("hidden");
        $("#description_input").removeClass("hidden");
        $("#new_thumbnail_button").removeClass("hidden");
        $("#delete_button").removeClass("hidden");

        $("#edit_button").text("Done")
            .attr("onclick", "editProduct.done()");
    },

    done: function () {
        var newCustName = $("#customer_input").val();
        var newProdName = $("#product_name_input").val();
        var newDescript = $("#description_input").val();

        $("#edit_button").prop("disabled", true);

        // Temporarily disabled
        //$.get(window.apiRoute + "/reSubmit/" + self.product.ProductId + "/" + newCustName +"/" + newProdName + "/" + newDescript, function() {
            console.log("Success!");

        $("#customer_input").addClass("hidden");
        $("#product_name_input").addClass("hidden");
        $("#description_input").addClass("hidden");
        $("#new_thumbnail_button").addClass("hidden");
        $("#delete_button").addClass("hidden");

        $("#customer_text").text(newCustName)
            .removeClass("hidden");

        $("#product_name_text").text(newProdName)
            .removeClass("hidden");

        $("#description_text").text(newDescript)
            .removeClass("hidden");

        $("#edit_button").text("Edit")
            .attr("onclick", "editProduct.edit()")
            .prop("disabled", false);
        //});
    },

    back: function () {
        navigation.go(window.args.PreviousPage, {ProductID: window.args.ProductID});
    }
};







