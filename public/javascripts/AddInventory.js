// Input argument: {ProductID, ProductName}
var addInventory = {
    productId: 0,
    itemName: "",
    packageTypes: [],
    total: 0,

    // Initialize the page.
    init: function () {
        navigation.setTitle("Add Inventory: " + window.args.ProductName);
        this.productId = parseInt(window.args.ProductID) || 0;

        if (this.productId == 0) {
            this.showError("Failed to initialize. Invalid product ID. Please reload the page.");
            console.log("Error: Init: Invalid product ID.");
            return;
        }

        this.itemName = window.args.ProductName || "";
        $("#item_name").text(this.itemName);

        this.addEntry();
        this.updatePackageTypes();
    },

    // Reset the add inventory entries.
    reset: function () {
        $("#add_list").empty();
        this.addEntry();
        this.updateTotal();
    },

    // Add an add inventory entry.
    addEntry: function () {
        var self = this;

        var entry = $("<div class='row form-group'/>")
            .appendTo("#add_list");

        // package type input
        var select = $("<select class='form-control' name='package_input'/>");
            .change(function(){self.updateTotal();});

        this.updateEntryPackageTypeOptions(select);

        entry.append($("<div class='col-sm-4' title='Type of package.'/>")
            .append(select)
        ).append($("<div class='col-sm-1'/>")
            .append($("<p class='form-control-static text-center'/>")
                .css("font-size", "150%")
                .text("*")
            )
        ).append($("<div class='col-sm-2'/>")
            .append($("<input class='form-control' name='amount_input' type='number' min='0' title='Number of packages of this type.'/>") // amount input
                .keyup(function(){self.updateTotal();});
                .change(function(){self.updateTotal();});
            )
        ).append($("<div class='col-sm-1'/>")
            .append($("<p class='form-control-static text-center'/>")
                .text("=")
            )
        ).append($("<div class='col-sm-2'/>")
            .append("<p class='form-control-static'/>")
                .text("Count of")
            )
        ).append($("<div class'col-sm-2'/>")
            .append($("<p class='form-control-static' name='count_text'/>")
                .text("0")
            )
        );
    },

    // Property

    // Array of entries
    getEntries: function () {
        var entries = [];

        $("#add_list div").each(function () {
            entries.push({
                itemName: addInventory.getItemName(),
                productId: addInventory.getProductId(),
                location: addInventory.getLocation(),
                packageName: $(this).find("select[name='package_input'] option:selected").data("name"),
                packageSize: $(this).find("select[name='package_input'] option:selected").data("size"),
                amount: $(this).find("input[name='amount_input']").val(),
                count: $(this).find("p[name='count_text']").text()
            });
        });

        return entries;
    },

    getProductId: function () {
        return this.productId;
    },

    getItemName: function () {
        return this.itemName;
    },

    getPackageTypes: function () {
        return this.packageTypes;
    },

    getLocation: function () {
        return $("#location_input").val() || "";
    },

    getAlternateId: function () {
        return parseInt($("#alt_id_input").val()) || null;
    },

    getTotal: function () {
        this.updateTotal();
        return this.total;
    },

    // Update

    // Updates the current total and the total display.
    updateTotal: function () {
        this.total = 0;
        var self = this;

        $("#add_list").children("div").each(function () { // each entry
            var size = parseInt($(this).find("select[name='package_input'] option:selected").data("size")) || 0;
            var amount = parseInt($(this).find("input[name='amount_input']").val()) || 0;
            var count = size * amount;
            $(this).find("p[name='count_text']").text(count);
            self.total += count;
        });

        $("#total_text").text(this.total);
    },

    // Updates the types of package available. Retrieves package types data from the back-end.
    updatePackageTypes: function () {
        var self = this;

        navigation.get(window.apiRoute + "/GetSizeByProductID/" + this.getProductId(), function (err, res) {
            if (err) {
                self.showError("Failed to retrieve package types: " + err);
                console.log("Error: Update package types: " + err);
            } else {
                self.packageTypes = $.parseJSON(res);
                self.updatePackageTypeOptions();
                self.updateTotal();
            }
        })
    },

    // Updates the options for the package types.
    updatePackageTypeOptions: function () {
        $("#add_list").children("div").each(function () {
            var lastSelected = $(this).find("select[name='package_input'] option:selected").val();
            var select = $(this).find("select[name='package_input']")
                .empty();

            addInventory.updateEntryPackageTypeOptions(select);

            if (lastSelected) {
                select.children("option:contains('" + lastSelected + "')").prop("selected", true);
            }
        });
    },

    // Updates the options for the package types of a single entry.
    updateEntryPackageTypeOptions: function (entry) {
        this.packageTypes.forEach(function (each) {
            $($("<option/>"))
                .text(each.Name + " " + each.Size)
                .data("name", each.Name)
                .data("size", each.Size)
                .appendTo(entry);
        });
    },

    // Submission

    // Submit add inventory.
    submitAdd: function () {
        this.hideAllAlerts();
        var productId = this.getProductId();
        var total = this.getTotal();
        var location = this.getLocation();
        var altId = this.getAlternateId();

        if (productId == 0) {
            this.showError("Failed to add inventory. Invalid product ID. Please reload the page.");
            return;
        }

        if (total == 0) {
            this.showError("Failed to add inventory. Invalid total. Please enter a number greater than 0.");
            return;
        }

        if (location == "") {
            this.showError("Failed to add inventory. Invalid location. Please enter a non-empty location.");
            return;
        }

        if (altId < 0) {
            this.showError("Failed to add inventory. Invalid alternate ID. Please enter a number greater than or equal to 0, or nothing.");
            return;
        }

        $("#inventory_add_button").prop("disabled", true);
        var self = this;

        navigation.get(window.apiRoute + "/AddInventory/" + productId + "/" + total + "/" + location + "/" + (altId === null ? "null" : altId), function(err, res) {
            if (err) {
                self.showError("Failed to add inventory: " + err);
                console.log("Error: Submit add inventory: " + err);
                $("#inventory_add_button").prop("disabled", false);
            } else {
                self.reset();
                self.showResponse("Added inventory: " + total + " at " + location + ".");
                navigation.back();
            }
        });
    },

    // Submit new package type
    submitNewPackageType: function () {
        var productId = this.getProductId();
        var name = $("#pkg_name").val() || "";
        var size = parseInt($("#pkg_size").val()) || 0;

        if (size < 0) size = 0; // unsigned number

        if (productId == 0) {
            this.showError("Failed to add inventory. Invalid product ID. Please reload the page.");
            return;
        }

        if (name == "") {
            this.showError("Failed to add inventory. Invalid package name. Please enter a non-empty name.");
            return;
        }

        if (size == 0) {
            this.showError("Failed to add new package type. Invalid package size. Please enter a number greater than 0.");
            return;
        }

        $("#pkg_add_button").prop("disabled", true);
        var self = this;

        navigation.get(window.apiRoute + "/AddProductSize/" + productId + "/" + name + "/" + size, function (err, res) {
            if (err) {
                self.showError("Failed to add new package type: " + err);
                console.log("Error: Submit new package type: " + err);
            } else {
                self.showResponse("Added new package type: " + name + " " + size + ".");
                self.updatePackageTypes();
                $("#pkg_name").val("");
                $("#pkg_size").val("");
                $("#pkg_add_button").prop("disabled", false);
            }
        });
    },

    // Alert

    showError: function (msg) {
        if (!msg) $("#error").addClass("hidden");
        $("#error").removeClass("hidden").text(msg);
    },

    hideError: function () {
        $("#error").addClass("hidden");
    },

    showResponse: function (msg) {
        if (!msg) $("#response").addClass("hidden");
        $("#response").removeClass("hidden").text(msg);
    },

    hideResponse: function () {
        $("#response").addClass("hidden");
    },

    hideAllAlerts: function () {
        $("#error").addClass("hidden");
        $("#response").addClass("hidden");
    }
};
