var itemDetailView = {
    productID: null,
    item: null,
    prevPage: null,

    init: function () {
        $("#response").text("");
        this.productID = window.args.ProductID || window.args.pageKey || window.state.ProductID;
        this.prevPage = window.args.PreviousPage || window.state.PreviousPage;

        if (window.args.ProductID) {
            navigation.saveState(window.args);
        }

        var self = this;

        navigation.hit("/itemDetail/" + this.productID, function (response) {
            if (response && response.length) {
                self.item = jQuery.parseJSON(response)[0];
                //console.log(self.item);
                self.productName = self.item.Name;
                self.displayItem();
                self.doThumbnail();
            } else {
                self.renderError("No inventory found");
            }
        })/*.fail(function (response) {
            self.renderError("Failed to load inventory: " + response);
        })*/;

        navigation.hit("/GetRunsByProduct/" + this.productID, function (response) {
           if (response && response.length) {
               self.runs = jQuery.parseJSON(response);
               //console.log(response);
               if (response.length > 2) {
                   self.displayRuns();
               }
           } else {
               self.renderError("No runs to display");
           }
        });
    },

    displayItem: function () {
        $("#response").text("");
        $("#product_name").text(this.item.Name);
        $("#details").append("<div>Total Available: <span>" + this.item.TotalAvailable + "</span></div>" +
        "<div>Total Reserved: <span>" + this.item.TotalReserved + "</span></div>" +
        "<div>Last run: <span>" + this.item.MostRecent + "</span></div>");
    },

    displayRuns: function () {
        //this.runs.forEach(function (run) {
        // using for loop instead of forEach to reverse order
        $("#runs").append("<h2>" + "Run History" + "</h2>" +
                          "<div class=\"col-sm-12\">" + "<b>" + "<div class=\"col-sm-1\">" + "Run ID" + "</div>" + "<div class=\"col-sm-1\">" + "Alt ID" + "</div>" + "<div class=\"col-sm-2\">" + "Location" + "</div>" + "<div class=\"col-sm-2\">" + "Date Created" + "</div>" + "<div class=\"col-sm-2\">" + "Initial Quantity" + "</div>" + "<div class=\"col-sm-2\">" + "Quantity Available" + "</div>" + "<div class=\"col-sm-2\">" + "Quantity Reserved" + "</div>" + "</b>" + "</div>");
        var displayColor = 0;  // using i % 2 was inconsistent, depends on whether the total number of runs was even or odd
        for (var i = this.runs.length - 1; i >= 0; --i) {
            var run = this.runs[i];
            var dateRegex = /\d\d\d\d-\d\d-\d\d/;
            if (displayColor % 2 == 0) {
                $("#runs").append("<div style=\"background:lightgray\" class=\"col-sm-12\">" + "<div class=\"col-sm-1\">" + run.RunID + "</div>" + "<div class=\"col-sm-1\">" + run.AltID + "</div>" + "<div class=\"col-sm-2\">" + run.Location + "</div>" + "<div class=\"col-sm-2\">" + dateRegex.exec(run.DateCreated) + "</div>" + "<div class=\"col-sm-2\">" + run.InitialQuantity + "</div>" + "<div class=\"col-sm-2\">" + run.QuantityAvailable + "</div>" + "<div class=\"col-sm-2\">" + run.QuantityReserved + "</div>" + " </div>");
                ++displayColor;
            } else {
                $("#runs").append("<div class=\"col-sm-12\">" + "<div class=\"col-sm-1\">" + run.RunID + "</div>" + "<div class=\"col-sm-1\">" + run.AltID + "</div>" + "<div class=\"col-sm-2\">" + run.Location + "</div>" + "<div class=\"col-sm-2\">" + dateRegex.exec(run.DateCreated) + "</div>" + "<div class=\"col-sm-2\">" + run.InitialQuantity + "</div>" + "<div class=\"col-sm-2\">" + run.QuantityAvailable + "</div>" + "<div class=\"col-sm-2\">" + run.QuantityReserved + "</div>" + " </div>");
                ++displayColor;
            }
        }
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
        navigation.hit( "/DeleteProductByID/" + productID, function (resp) {
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
        })/*.fail(function (res) {
            $("#response").text( "Fail to delete product: Error --- " + res );
        })*/;
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
