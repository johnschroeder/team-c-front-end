var editProduct = {
    product: null,
    editing: false,
    ready: false,

    init: function() {
        //TODO use john's breadcrumb loader to load a new page here populated with the data.
        $("#item_name").text(window.args.ProductName);

        var self = this;

        $.get(window.apiRoute + "/EditProduct/" + window.args.ProductID , function(res) {
            self.product = $.parseJSON(res)[0];
            $("#customer_text").text(self.product.Customer);
            $("#product_name_text").text(self.product.Name);
            $("#description_text").text(self.product.Description);

            $("#customer_input").val(self.product.Customer); //fill Customer
            $("#product_name_input").val(self.product.Name); //fill Item Name
            $("#description_input").val(self.product.Description); //fill Description
            self.ready = true;
        });
    },

    edit: function() {
        if (!this.ready) return;

        $("#customer_text").addClass("hidden");
        $("#product_name_text").addClass("hidden");
        $("#description_text").addClass("hidden");

        $("#customer_input").removeClass("hidden");
        $("#product_name_input").removeClass("hidden");
        $("#description_input").removeClass("hidden");
        $("#new_thumbnail_button").removeClass("hidden");

        $("#edit_button").text("Done")
            .attr("onclick", "editProduct.done()");
    },

    done: function() {
        var newCustName = $("#customer_input").val();
        var newProdName  = $("#product_name_input").val();
        var newDescript  = $("#description_input").val();

        $("#edit_button").prop("disabled", true);

        // Temporarily disabled
        //$.get(window.apiRoute + "/reSubmit/" + self.product.ProductId + "/" + newCustName +"/" + newProdName + "/" + newDescript, function() {
            console.log("Success!");

            $("#customer_input").addClass("hidden");
            $("#product_name_input").addClass("hidden");
            $("#description_input").addClass("hidden");
            $("#new_thumbnail_button").addClass("hidden");

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
    }
};







