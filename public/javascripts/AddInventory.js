//<script>
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
        var rowToCopy = $('.calc-clone').last().toggle();
        var rowsContainer = '#add_list';

        var entry = rowToCopy.clone();

        entry.appendTo(rowsContainer);

        // package type input
        var select = entry.find(".select");

        this.updateEntryPackageTypeOptions(select);
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
        $.get(window.apiRoute + "/GetSizeByProductID/" + this.getProductId(), function(res) {
            addInventory.packageTypes = $.parseJSON(res);
            addInventory.updatePackageTypeOptions();
            addInventory.updateTotal();
        }).fail(function(res) {
            $("#response").text("Error: Update package types: Connection error.");
        });
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

        $.get(window.apiRoute + "/AddInventory/" + productId + "/" + total + "/" + location, function(res) {
            addInventory.reset();
            $("#response").text("Added inventory: " + total + " at " + location + ".");
            navigation.go(window.args.PreviousPage, {ProductID: window.args.ProductID});
        }).fail(function(res) {
            $("#response").text("Error: Submit add inventory: Connection error.");
            $("#inventory_add_button").prop("disabled", false);
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

        $.get(window.apiRoute + "/AddProductSize/" + productId + "/" + name + "/" + size, function(res) {
            $("#response").text("Added new package type: " + name + " " + size + ".");
            addInventory.updatePackageTypes();
            $("#pkg_name").val("");
            $("#pkg_size").val("");
            $("#pkg_add_button").prop("disabled", false);
        }).fail(function(res) {
            $("#response").text("Error: Submit new package type: Connection error.");
            $("#pkg_add_button").prop("disabled", false);
        });
    },

    // Go back to the last page.
    back: function () {
        navigation.go(window.args.PreviousPage, {ProductID: window.args.ProductID});
    }
};
