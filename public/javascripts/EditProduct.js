var editProduct = {
    product: null,
    init: function() {
        //TODO use john's breadcrumb loader to load a new page here populated with the data.

        var self = this;

        $.get(window.apiRoute + "/EditProduct/" + window.args.ProductID , function(res) {
            self.product = $.parseJSON(res)[0];
            $(".selectedID").text(self.product.ProductID);
            $(".customer").text(self.product.Customer); //fill Customer
            $(".product-name").text(self.product.Name); //fill Item Name
            $(".description").text(self.product.Description); //fill Description
        });
    },

    reSubmit: function() {
        var newCustName = $(".customer").val();
        var newProdName  = $(".product-name").val();
        var newDescript  = $(".description").val();

        $.get(window.apiRoute + "/reSubmit/" + self.product.ProductId + "/" + newCustName +"/" + newProdName + "/" + newDescript, function() {
            console.log("Success!");
        });
    }
};







