/**
 * Created by Kun on 7/5/2015.
 */

var itemDetailView = {
    productID: null,
    item: null,
    prevPage: null,

    init: function () {
        $("#response").text("");

        if (window.args.ProductID) {
            this.productID = window.args.ProductID;
            this.prevPage = window.args.PreviousPage;
            navigation.saveState(window.args);
        } else if (window.state.ProductID) {
            this.productID = window.state.ProductID;
            this.prevPage = window.state.PreviousPage;
        }

        var self = this;

        $.get(window.apiRoute + "/itemDetail/" + this.productID, function (response) {
            if (response && response.length) {
                self.item = jQuery.parseJSON(response)[0];
                //console.log(self.item);
                self.productName = self.item.Name;
                self.displayItem();
            } else {
                self.renderError("No inventory found");
            }
        }).fail(function (response) {
            self.renderError("Failed to load inventory: " + response);
        });
    },

    displayItem: function () {
        $("#response").text("");
        $("#product_name").text(this.item.Name);
        $("#details").append("<div>Total Available: <span>" + this.item.TotalAvailable + "</span></div>" +
        "<div>Total Reserved: <span>" + this.item.TotalReserved + "</span></div>" +
        "<div>Last run: <span>" + this.item.MostRecent + "</span></div>");
    },

    renderError: function (error) {
        $("#response").text("Error: " + error);
    },

    add: function () {
        if (!this.productID || !this.item) return;
        navigation.go("AddInventory.html", {
            ProductID: this.productID,
            ProductName: this.item.Name || "",
            PreviousPage: "ItemDetailView.html"
        });
    },

    pull: function () {
        if (!this.productID || !this.item) return;
        navigation.go("PullInventory.html", {
            ProductID: this.productID,
            ProductName: this.item.Name || "",
            TotalQuantity: this.item.TotalAvailable,
            PreviousPage: "ItemDetailView.html"
        });
    },

    edit: function () {
        if (!this.productID || !this.item) return;
        navigation.go("EditProduct.html", {
            ProductID: this.productID,
            ProductName: this.item.Name || "",
            PreviousPage: "ItemDetailView.html"
        });
    },

    qrCode: function () {
        if (!this.productID || !this.item) return;
        navigation.go("ShowQRCode.html", {
            Text: window.location + "ItemDetailView-" + this.productID,
            PreviousPage: "ItemDetailView.html"
        });
    },

    Delete: function() {
        var productID = window.args.ProductID;
        $.get(window.apiRoute + "/DeleteProductByID/" + productID, function (resp) {
            var r = jQuery.parseJSON(resp);
            if (r[0].message == 'Success') {
                alert("Product " + $("#product_name").text() + " is deleted.");
                navigation.go("DisplayInventory.html",{ProductID: window.args.ProductID, PreviousPage:"ItemDetailView"});
            }
            else {
                alert(r[0].message);
                //$("#response").append("<br/>" + "Deleting Product is only available to system admin.");
                //$("#response").append("<br/>" + "Please go through the following checklist before deleting product.");
                //$("#response").append("<br/>" + "1. Inventory of the product is 0.");
                //$("#response").append("<br/>" + "2. De-associate all customers from the product");
            }
        }).fail(function (res) {
            $("#response").text( "Fail to delete product: Error --- " + res );
        });
    },

    back: function () {
        if (this.prevPage)
            navigation.go(this.prevPage);
    }
};
