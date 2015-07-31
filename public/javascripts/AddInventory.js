//<script>
// Input arguments: ProductID, ProductName, PreviousPage
var addInventory = {
    productId: 0,
    itemName: "",
    packageTypes: [],
    total: 0,

    // Initialize the page.
    init: function() {

        var locations = "No locations;sorry".split(";");

        navigation.hit("/GetInventoryLocations/", function (res) {
            locations = (JSON.parse(res)).locationList;
            createEditableSelect(document.forms[0].location_input, locations);
        });

        this.productId = parseInt(window.args.ProductID) || 0;

        if (this.productId == 0) {
            $("#response").text("Error: Init: Invalid product ID.");
            return;
        }

        this.itemName = window.args.ProductName || "";
        $("#item_name").text(this.itemName);

        this.addEntry();
        this.updatePackageTypes();
    },

    // Reset the add inventory entries.
    reset: function() {
        $("#add_list").empty();
        this.addEntry();
        this.updateTotal();
    },

    // Add an add inventory entry.
    addEntry: function() {
        var entry = $(document.createElement("div"))
            .addClass("row form-group")
            .appendTo("#add_list");

        // package type input
        var select = $(document.createElement("select"))
            .addClass("form-control")
            .attr("name", "package_input")
            .attr("onchange", "addInventory.updateTotal()");

        this.updateEntryPackageTypeOptions(select);

        entry.append($(document.createElement("div"))
                .addClass("col-sm-4")
                .attr("title", "Type of package.")
                .append(select)
        ).append($(document.createElement("div"))
                .addClass("col-sm-1")
                .append($(document.createElement("p"))
                    .addClass("form-control-static text-center")
                    .css("font-size", "150%")
                    .text("*")
            )
        ).append($(document.createElement("div"))
                .addClass("col-sm-2")
                .append($(document.createElement("input")) // amount input
                    .addClass("form-control")
                    .attr("name", "amount_input")
                    .attr("type", "number")
                    .attr("min", 0)
                    .attr("onkeyup", "addInventory.updateTotal()")
                    .attr("onchange", "addInventory.updateTotal()")
                    .attr("title", "Number of packages of this type.")
            )
            ).append($(document.createElement("div"))
                .addClass("col-sm-1")
                .append($(document.createElement("p"))
                    .addClass("form-control-static text-center")
                    .text("=")
            )
            ).append($(document.createElement("div"))
                .addClass("col-sm-2")
                .append($(document.createElement("p"))
                    .addClass("form-control-static")
                    .text("Count of")
            )
        ).append($(document.createElement("div"))
                .addClass("col-sm-2")
                .append($(document.createElement("p"))
                    .addClass("form-control-static")
                    .attr("name", "count_text")
                    .text("0")
            )
            );
    },

    // Array of entries
    getEntries: function() {
        var entries = [];

        $("#add_list").children("div").each(function() {
            entries.push({
                itemName: addInventory.getItemName(),
                productId: addInventory.getProductId(),
                location: addInventory.getLocation(),
                packageName: $(this).find("select[name='package_input']").children("option:selected").data("name"),
                packageSize: $(this).find("select[name='package_input']").children("option:selected").data("size"),
                amount: $(this).find("input[name='amount_input']").val(),
                count: $(this).find("p[name='count_text']").text()
            });
        });

        return entries;
    },

    getProductId: function() {
        return this.productId;
    },

    getItemName: function() {
        return this.itemName;
    },

    getPackageTypes: function() {
        return this.packageTypes;
    },

    getLocation: function() {
        return $("#location_input").val() || "";
    },

    getTotal: function () {
        this.updateTotal();
        return this.total;
    },

    // Updates the current total and the total display.
    updateTotal: function() {
        this.total = 0;

        $("#add_list").children("div").each(function() { // each entry
            var size = parseInt($(this).find("select[name='package_input']").children("option:selected").data("size")) || 0;
            var amount = parseInt($(this).find("input[name='amount_input']").val()) || 0;
            var count = size * amount;
            $(this).find("p[name='count_text']").text(count);
            addInventory.total += count;
        });

        $("#total_text").text(this.total);
    },

    // Updates the types of package available. Retrieves package types data from the back-end.
    updatePackageTypes: function() {
        navigation.get(window.apiRoute + "/GetSizeByProductID/" + this.getProductId(), function(err, res) {
            if(err){
                $("#response").text("Error: Update package types: Connection error.");
            }
            else {
                addInventory.packageTypes = $.parseJSON(res);
                addInventory.updatePackageTypeOptions();
                addInventory.updateTotal();
            }
        })
    },

    // Updates the options for the package types.
    updatePackageTypeOptions: function() {
        $("#add_list").children("div").each(function() {
            var lastSelected = $(this).find("select[name='package_input']").children("option:selected").val();
            var select = $(this).find("select[name='package_input']")
                .empty();

            addInventory.updateEntryPackageTypeOptions(select);

            if (lastSelected) {
                select.children("option:contains('" + lastSelected + "')").prop("selected", true);
            }
        });
    },

    // Updates the options for the package types of a single entry.
    updateEntryPackageTypeOptions: function(entry) {
        this.packageTypes.forEach(function(each) {
            $(document.createElement("option"))
                .text(each.Name + " " + each.Size)
                .data("name", each.Name)
                .data("size", each.Size)
                .appendTo(entry);
        });
    },

    // Submit add inventory.
    submitAdd: function() {
        var productId = this.getProductId();
        var total = this.getTotal();
        var location = this.getLocation();
        if (productId == 0 || total == 0 || location == "") {
            $("#response").text("Error: Submit add inventory: Invalid input or product ID.");
            return;
        }

        $("#inventory_add_button").prop("disabled", true);

        navigation.get(window.apiRoute + "/AddInventory/" + productId + "/" + total + "/" + location, function(err, res) {
            if(err){
                $("#response").text("Error: Submit add inventory: Connection error.");
                $("#inventory_add_button").prop("disabled", false);
            }
            else {
                addInventory.reset();
                $("#response").text("Added inventory: " + total + " at " + location + ".");
                navigation.go(window.args.PreviousPage, {ProductID: window.args.ProductID});
                navigation.go(window.args.PreviousPage, {ProductID: window.args.ProductID});
            }
        });
    },

    // Submit new package type
    submitNewPackageType: function() {
        var productId = this.getProductId();
        var name = $("#pkg_name").val() || "";
        var size = parseInt($("#pkg_size").val()) || 0;

        if (productId == 0 || name == "" || size == 0) {
            $("#response").text("Error: Submit new package type: Invalid input or product ID.");
            return;
        }

        $("#pkg_add_button").prop("disabled", true);

        navigation.get(window.apiRoute + "/AddProductSize/" + productId + "/" + name + "/" + size, function(err, res) {
            if(err){
                $("#response").text("Error: Submit new package type: Connection error.");
            }
            else {
                $("#response").text("Added new package type: " + name + " " + size + ".");
                addInventory.updatePackageTypes();
                $("#pkg_name").val("");
                $("#pkg_size").val("");
                $("#pkg_add_button").prop("disabled", false);
            }
        });
    },

    // Go back to the last page.
    back: function () {
        navigation.go(window.args.PreviousPage, {ProductID: window.args.ProductID});
    }
};
