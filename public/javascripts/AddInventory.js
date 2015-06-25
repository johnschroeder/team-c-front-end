// Input arguments: ProductID, ProductName, PreviousPage
var addInventory = {
    productId: 0,
    itemName: "",
    packageTypes: [],
    total: 0,

    // Initialize the page.
    init: function() {
        this.productId = parseInt(window.args.ProductID) || 0;

        if (this.productId == 0) {
            $("#response").text("Error: Init: Invalid product ID.");
            return;
        }

        this.itemName = window.args.ProductName || "";
        $("#item_text").text(this.itemName);

        /*$.get(window.apiRoute + "/GetItemName/" + this.productId, function(res) {
            if (res && res.length) {
                addInventory.itemName = $.parseJSON(res)[0].Name;
                $("#item_text").text(addInventory.itemName);
            } else {
                $("#response").text("Error: Init: No response.");
            }
        }).fail(function(res) {
            $("#response").text("Error: Init: Connection error.");
        });*/

        this.updatePackageTypes();
    },

    // Reset the add inventory entries.
    reset: function() {
        $("#add_list").empty();
        this.updateTotal();
    },

    // Add an add inventory entry.
    addEntry: function() {
        var entry = $(document.createElement("div"))
            .addClass("row")
            .appendTo("#add_list");

        // package type input
        var select = $(document.createElement("select"))
            .addClass("col-sm-3")
            .attr("name", "package_input")
            .attr("onchange", "addInventory.updateTotal()")

        this.updateEntryPackageTypeOptions(select);

        entry.append(select)
            .append($(document.createElement("div"))
                .css("font-size", "150%")
                .addClass("col-sm-1 text-center")
                .text("*")
            ).append($(document.createElement("input")) // amount input
                .addClass("col-sm-2")
                .attr("name", "amount_input")
                .attr("type", "text")
                .attr("onkeyup", "addInventory.updateTotal()")
            ).append($(document.createElement("div"))
                .addClass("col-sm-2 text-center")
                .text("=")
            ).append($(document.createElement("div"))
                .addClass("col-sm-2")
                .text("Count of")
            ).append($(document.createElement("div")) // count
                .addClass("col-sm-2")
                .attr("name", "count_text")
                .text("0")
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
                packageName: $(this).children("select[name='package_input']").children("option:selected").data("name"),
                packageSize: $(this).children("select[name='package_input']").children("option:selected").data("size"),
                amount: $(this).children("input[name='amount_input']").val(),
                count: $(this).children("div[name='count_text']").text()
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
            var size = parseInt($(this).children("select[name='package_input']").children("option:selected").data("size")) || 0;
            var amount = parseInt($(this).children("input[name='amount_input']").val()) || 0;
            var countOf = size * amount;
            $(this).children("div[name='count_text']").text(countOf);
            addInventory.total += countOf;
        });

        $("#total_text").text(this.total);
    },

    // Updates the types of package available. Retrieves package types data from the back-end.
    updatePackageTypes: function() {
        $.get(window.apiRoute + "/GetSizeByProductID/" + this.getProductId(), function(res) {
            if (res && res.length) {
                addInventory.packageTypes = $.parseJSON(res);
                addInventory.updatePackageTypeOptions();
                addInventory.updateTotal();
            } else {
                $("#response").text("Error: Update package types: No response.");
            }
        }).fail(function(res) {
            $("#response").text("Error: Update package types: Connection error.");
        });
    },

    // Updates the options for the package types.
    updatePackageTypeOptions: function() {
        $("#add_list").children("div").each(function() {
            var lastSelected = $(this).children("select[name='package_input']").children("option:selected").val();
            var select = $(this).children("select[name='package_input']")
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
            $("#response").text("Error: Submit add inventory: Invalid input or ID.");
            return;
        }

        $.get(window.apiRoute + "/AddInventory/" + productId + "/" + total + "/" + location, function(res) {
            $("#response").text("Added inventory: " + total + " at " + location + ".");
            navigation.go(window.args.PreviousPage, {ProductID: window.args.ProductID});
        }).fail(function(res) {
            $("#response").text("Error: Submit add inventory: Connection error.");
        });

        addInventory.reset()
    },

    // Submit new package type
    submitNewPackageType: function() {
        var productId = this.getProductId();
        var name = $("#pkg_name").val() || "";
        var size = parseInt($("#pkg_size").val()) || 0;

        if (productId == 0 || name == "" || size == 0) {
            $("#response").text("Error: Submit new package type: Invalid input.");
            return;
        }

        $.get(window.apiRoute + "/AddProductSize/" + productId + "/" + name + "/" + size, function(res) {
            $("#response").text("Added new package type: " + name + " " + size + ".");
            addInventory.updatePackageTypes();
        }).fail(function(res) {
            $("#response").text("Error: Submit new package type: Connection error.");
        });
    }
}
