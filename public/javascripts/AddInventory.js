//<script>
var addInventory = {
    productId: 0,
    itemName: "",
    packageTypes: [],
    locations: [],
    total: 0,

    // Initialize the page.
    init: function() {
        this.productId = parseInt(window.args.ProductID) || 0;

        $.get(window.apiRoute + "/itemDetail/" + this.productId, function(res) {
            if (res && res.length) {
                addInventory.itemName = $.parseJSON(res)[0].Name;
                $("#item_text").text(addInventory.itemName);
            } else {
                $("#response").text("Error: Init.");
            }
        }).fail(function(res) {
            $("#response").text("Error: Init.");
        });

        this.updatePackageTypes();
        this.updateLocations();
    },

    // Add a row of add inventory entry.
    addEntry: function() {
        var entry = $(document.createElement("div"))
            .appendTo("#add_list");

        // package type input
        var select = $(document.createElement("select"))
            .attr("name", "package_input")
            .attr("onchange", "addInventory.updateTotal()")
            .appendTo(entry);

        this.packageTypes.forEach(function(each) {
            var packageType = $(document.createElement("option"))
                .text(each.name + " " + each.size)
                .data("name", each.name)
                .data("size", each.size)
                .appendTo(select);
        });

        entry.append(" * ");

        // amount input
        input = $(document.createElement("input"))
            .attr("name", "amount_input")
            .attr("type", "text")
            .attr("onkeyup", "addInventory.updateTotal()")
            .appendTo(entry);

        // count
        var countOf = $(document.createElement("span"))
            .attr("name", "count_of_text")
            .addClass("float_right")
            .append(" = Count of ")
            .appendTo(entry);

        var count = $(document.createElement("span"))
            .attr("name", "count_text")
            .text("0")
            .appendTo(countOf);

        entry.append("<div style='clear: both;'></div>");
    },

    // Array of entries (all string)
    getEntries: function() {
        var a = [];

        $("#add_list").children().each(function() {
            var entry = {};
            entry.itemName = addInventory.getItemName();
            entry.productId = addInventory.getProductId();
            entry.location = addInventory.getSelectedLocation();
            entry.pileId = addInventory.getSelectedPileId();
            entry.packageName = $(this).children("select[name='package_input']").children("option:selected").data("name");
            entry.packageSize = $(this).children("select[name='package_input']").children("option:selected").data("size");
            entry.amount = $(this).children("input[name='amount_input']").val();
            entry.count = $(this).children("span[name='count_of_text']").children("span[name='count_text']").text();
            a.push(entry);
        });

        return a;
    },

    getProductId :function() {
        return this.productId;
    },

    getSelectedPileId :function() {
        return $("#location_input").children("option:selected").data("id");
    },

    getSelectedLocation :function() {
        return $("#location_input").children("option:selected").val();
    },

    getItemName :function() {
        return this.itemName;
    },

    getPackageTypes :function() {
        return this.packageTypes;
    },

    getLocations :function() {
        return this.locations;
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
            $(this).children("span[name='count_of_text']").children("span[name='count_text']").text(countOf);
            addInventory.total += countOf;
        });

        $("#total_text").text(this.total);
    },

    // Updates the types of package available. Retrieves package types data from the back-end.
    updatePackageTypes: function() {
        // TODO: retrieve package types from database.
        /*
        $.get(window.apiRoute + "/getPackageTypes/", function(res) {
            if (res && res.length) {
                $.parseJSON(res).forEach(function(each) {

                });
            } else {
                $("#response").text("Error: Update package types.");
            }
        }).fail(function(res) {
            $("#response").text("Error: Update package types.");
        });
        */

        this.packageTypes = [{name:"jumbo box", size:2000}, {name:"large box", size:100}, {name:"small pack", size:10}, {name:"single unit", size:1}]; // test data

        this.updatePackageTypeOptions();
    },

    // Updates the options for the package types.
    updatePackageTypeOptions: function() {
        $("#add_list").children().each(function() {
            var select = $(this).children("select[name='package_input']")
                .empty();

            this.packageTypes.forEach(function(each) {
                var packageType = $(document.createElement("option"))
                    .text(each.name + " " + each.size)
                    .data("name", each.name)
                    .data("size", each.size)
                    .appendTo(select);
            });
        });
    },

    // Updates the locations available. Retrieves locations data from the back-end.
    updateLocations: function() {
        // TODO: retrieve locations from database.
        /*
        $.get(window.apiRoute + "/getLocations/", function(res) {
            if (res && res.length) {
                $.parseJSON(res).forEach(function(each) {

                });
            } else {
                $("#response").text("Error: Update locations.");
            }
        }).fail(function(res) {
            $("#response").text("Error: Update locations.");
        });
        */

        this.locations = [{name:"A-113", id:301}, {name:"C-323", id:302}, {name:"E-009", id:303}]; // test data

        this.updateLocationOptions();
    },

    // Updates the options for the locations.
    updateLocationOptions: function() {
        var select = $("#location_input")
            .empty();

        this.locations.forEach(function(each) {
            var location = $(document.createElement("option"))
                .text(each.name)
                .data("id", each.id)
                .appendTo(select);
        });
    },

    // Submit add inventory.
    submitAdd: function() {
        this.getTotal();

        var pileId = $("#location_input").children("option:selected").data("id") || 0;

        if (this.getProductId() == 0 || this.getSelectedPileId() == 0 || this.getTotal() == 0) {
            $("#response").text("Error: Submit add inventory.");
            return;
        }

        // TODO: submit add inventory.
        $.get(window.apiRoute + "/addInventory/" + this.getProductId() + "/" + this.getSelectedPileId() + "/" + this.getTotal(), function(res) {
            $("#response").text("Added inventory: " + addInventory.total + ".");
            navigation.go(window.args.PreviousPage, {ProductID: window.args.ProductID});
        }).fail(function(res) {
            $("#response").text("Error: Submit add inventory.");
        });
    },

    // Submit new package type
    submitNewPackageType: function() {
        var name = $("#pkg_name").val() || "";
        var size = parseInt($("#pkg_size").val()) || 0;

        if (name == "" || size == 0) {
            $("#response").text("Error: Submit new package type.");
            return;
        }

        // TODO: submit add new package type.
        $.get(window.apiRoute + "/addNewPackageType/" + name + "/" + size, function(res) {
            $("#response").text("Added new package type: " + name + " " + size + ".");
            addInventory.updatePackageTypes();
        }).fail(function(res) {
            $("#response").text("Error: Submit new package type.");
        });
    }
}
