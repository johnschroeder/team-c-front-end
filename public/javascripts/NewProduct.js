/**
 * Created by johnschroeder on 7/6/15.
 */
var newProduct = {
    productID: false,
    productName: false,
    customers: false,
    /**
     * Generates the current date and returns it as a string
     * @returns {string}
     */
    getDate:function() {

        var date_object = new Date();
        var day = date_object.getDate();
        var month = date_object.getMonth() + 1;
        var year = date_object.getFullYear();

        var date = year + "-";
        if( month < 10 )
            date += "0";
        date += month + "-";
        if( day < 10 )
            date += "0";
        date += day;

        return date;
    },

    //Tack the date on in the upper-right corner
    init:function() {
        newProduct.getCustomers();
        $("#date").text(newProduct.getDate());

    },

    getCustomers:function() {
        var host = window.apiRoute + "/getCustomers/";
        navigation.get(host, function(err, response) {
            if(err){
                console.log("An error occured in getCustomers when trying to access the route /getCustomers");
                console.log(err);
            }
            else if(response && response.length) {
                newProduct.customers = JSON.parse(response);
                newProduct.populateCustomers();
            } else {
                console.log("There was an error retrieving customers.");
            }
        })
    },
    populateCustomers: function() {
        if(newProduct.customers) {
            var rowToCopy = $(".customer_checkbox").first();
            var rowsContainer = $("#checkbox_cont");
            rowsContainer.empty();

            newProduct.customers.forEach(function(customer) {
                var newRow = rowToCopy.clone();
                newRow.find(".checkbox_label").text(customer.Name);
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
            if(err){
                console.log("An error occured with submitCustomer trying to access route /addCustomer/");
                console.log(err);
            }
            else if( response && response.length) {
                newProduct.customers.push({
                    CustomerID:response.CustomerID,
                    Name:newCustomer
                });
                $("#new_customer_text").val("");
                $("#add_customer").removeClass("hidden");
                $("#add_customer_text").addClass("hidden");
                $("#submit_customer").addClass("hidden");
                newProduct.getCustomers();
            } else {
                console.log("There was an error adding a customer");
            }
        });
    },

    //Submit the form when the submit button is clicked
    //submit_button.on( 'click',
    submit:function(){
        var submit_button = $("#submit");
        $("#message").text("");

        var host = window.apiRoute + "/newProductSubmission/";
        var product_name = $("#product_name_input").val();
        var description = $("#description_input").val();
        var date = newProduct.getDate();
        newProduct.productName = product_name;

        if( !product_name.length || !description.length ){
            $("#message").text("Error: One or more required fields isn't filled out");
            return;
        }

        host = host
            + product_name + "/"
            + description + "/"
            + date + "/";

        submit_button.prop("disabled", true);

        navigation.get(host, function (err, response) {
            if(err){
                $("#message").text("Error: " + err.responseText);
                submit_button.prop("disabled", false);
            }
            else if( response && response.length ){
                newProduct.productID = JSON.parse(response).ProductID;
                $("#message").text("Successfully created product");
                submit_button.prop("disabled", false);
                newProduct.associateCustomers();
            }
            else {
                $("#message").text("Error: " + response);
                submit_button.prop("disabled", false);
            }
        })
    },

    associateCustomers: function() {
        var customerContainer = $("#checkbox_cont").children();
        var nextPage = true;
        customerContainer.each(function(){
            if($(this).find(".checkbox_input")[0].checked) {
                var host = window.apiRoute
                    + "/associateProductCustomer/"
                    + newProduct.productID + "/"
                    + $(this).data().id;

                navigation.get(host, function(err, response) {
                    if(err){
                        nextPage = false;
                        $("#message").text("Error: " + err.responseText);
                    }
                    else if( response != "Success" ){
                        nextPage = false;
                        $("#message").text("Error: " + response);
                    }
                })
            }
        });

        newProduct.nextPage();
    },

    nextPage:function() {
        if($("#new_run_checkbox")[0].checked){
            navigation.go("AddInventory.html", {
                ProductID:newProduct.productID,
                ProductName:newProduct.productName
            });
        } else {
            navigation.go("DisplayInventory.html");
        }
    }
};
