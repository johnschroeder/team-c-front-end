/**
 * Created by Kun on 7/5/2015.
 */

var itemDetailView = {
    productID: null,
    item: null,
    prevPage: null,

    init: function () {
        $("#response").text("");
        this.productID = window.args.ProductID;

        if (window.args.ProductID) {
            navigation.saveState(window.args);
        }

        var self = this;

        navigation.get(window.apiRoute + "/itemDetail/" + this.productID, function (err, response) {
            if(err){
                self.renderError("Failed to load inventory: " + response);
            }
            else if (response && response.length) {
                self.item = jQuery.parseJSON(response)[0];
                //console.log(self.item);
                self.productName = self.item.Name;
                self.displayItem();
                self.doThumbnail();
            } else {
                self.renderError("No inventory found");
            }
        })
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
            Text: window.location.protocol + "//" + window.location.hostname + "/" + "ItemDetailView-" + this.productID,
            PreviousPage: "ItemDetailView.html"
        });
    },

    Delete: function() {
        var productID = window.args.ProductID;
        navigation.get(window.apiRoute + "/DeleteProductByID/" + productID, function (err, resp) {
            if(err){
                $("#response").text( "Fail to delete product: Error --- " + res );
            }
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
        });
    },

     doThumbnail: function() {

         var imageLocation = navigation.makeImageURL(this.productID);

         navigation.checkImage( imageLocation,
            function(){
                console.log("Image found for product");
                $('.thumbnail').html("<img src='"+imageLocation+"'/>");
            },
            function(){
                console.log("No image found for product");
                $('.thumbnail').html("<div class='noImage'>No Image</div>");
            });

    },
    back: function () {
        if (this.prevPage)
            navigation.go(this.prevPage);
    }
};
