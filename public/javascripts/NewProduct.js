/**
 * Created by johnschroeder on 7/6/15.
 */
var newProduct = {

    customers:false,
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
        $.get(host, function(response) {
            if(response && response.length) {
                newProduct.customers = JSON.parse(response);
                console.log("Customers: " );
                console.log(newProduct.customers);
                newProduct.populateCustomers();
            } else {
                console.log("There was an error retrieving customers.");
            }
        })
    },
    stupidCounter: 0,
    populateCustomers: function() {
        if(newProduct.customers) {
            var rowToCopy = $("#customer_checkbox").first();
            var rowsContainer = $("#checkbox_cont");
            rowsContainer.empty();

            newProduct.customers.forEach(function(customer) {
                var newRow = rowToCopy.clone();
                newRow.find(".checkbox_label").text(customer.Name);
                newRow.removeClass("hidden");
                newRow.appendTo( rowsContainer );
            });
        }
    },

    //Submit the form when the submit button is clicked
    //submit_button.on( 'click',
    submit:function(){
        var submit_button = $("#submit");
        $("#message").text("");

        var host = window.apiRoute + "/newProductSubmission/";
        var customer = $("#customer_input").val();
        var product_name = $("#product_name_input").val();
        var description = $("#description_input").val();
        var date = newProduct.getDate();

        if( !product_name.length || !description.length ){
            $("#message").text("Error: One or more required fields isn't filled out");
            return;
        }

        host = host
            + product_name + "/"
            + description + "/"
            + date + "/";

        submit_button.prop("disabled", true);

        $.get(host, function (response) {
            if( response == "Success" ){
                $("#message").text("Successfully created product");
                submit_button.prop("disabled", false);
            }
            else {
                $("#message").text("Error: " + response);
                submit_button.prop("disabled", false);
            }
        }).fail(function (err) {
            $("#message").text("Error: " + err.responseText);
            submit_button.prop("disabled", false);
        });
    }
};
