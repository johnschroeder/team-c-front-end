//<script>
var productId = 0;
var itemName = "";
var packageTypes = [];
var locations = [];
var total = 0;

function init() {
    productId = parseInt(window.args.ProductID) || 0;

    $.get(window.apiRoute + "/itemDetail/" + productId, function(res) {
        if (res && res.length) {
            itemName = $.parseJSON(res)[0].Name;
            $("#item_text").text(itemName);
        } else {
            $("#response").text("Error: Init.");
        }
    }).fail(function(res) {
        $("#response").text("Error: Init.");
    });

    updatePackageTypes();
    updateLocations();
}

function addEntry() {
    var entry = $(document.createElement("div"))
        .appendTo("#add_list");

    // package type input
    var select = $(document.createElement("select"))
        .attr("name", "package_input")
        .attr("onchange", "updateTotal()");

    packageTypes.forEach(function(each) {
        var packageType = $(document.createElement("option"))
            .text(each.name + " " + each.size)
            .data("name", each.name)
            .data("size", each.size);

        select.append(packageType);
    });

    entry.append(select);

    entry.append(" * ");

    // amount input
    input = $(document.createElement("input"))
        .attr("name", "amount_input")
        .attr("type", "text")
        .attr("onkeyup", "updateTotal()");

    entry.append(input);

    // count
    var countOf = $(document.createElement("span"))
        .attr("name", "count_of_text")
        .addClass("float_right");

    countOf.append(" = Count of ");

    var count = $(document.createElement("span"))
        .attr("name", "count_text")
        .text("0");

    countOf.append(count);
    entry.append(countOf);

    entry.append("<div style='clear: both;'></div>");
}

// Array of entries (all string)
function getEntries() {
    var a = [];

    $("#add_list").children().each(function() {
        var entry = {};
        entry.itemName = itemName;
        entry.productId = productId;
        entry.location = $("#location_input").children("option:selected").val();
        entry.pileId = $("#location_input").children("option:selected").data("id");
        entry.packageName = $(this).children("select[name='package_input']").children("option:selected").data("name");
        entry.packageSize = $(this).children("select[name='package_input']").children("option:selected").data("size");
        entry.amount = $(this).children("input[name='amount_input']").val();
        entry.count = $(this).children("span[name='count_of_text']").children("span[name='count_text']").text();
        a.push(entry);
    });

    return a;
}

function getPackageTypes() {
    return packageTypes;
}

function getLocations() {
    return locations;
}

function getItemName() {
    return itemName;
}

function getTotal() {
    return updateTotal();
}

function updateTotal() {
    total = 0;

    $("#add_list").children("div").each(function() { // each entry
        var size = parseInt($(this).children("select[name='package_input']").children("option:selected").data("size")) || 0;
        var amount = parseInt($(this).children("input[name='amount_input']").val()) || 0;
        var countOf = size * amount;
        $(this).children("span[name='count_of_text']").children("span[name='count_text']").text(countOf);
        total += countOf;
    });

    $("#total_text").text(total);

    return total;
}

function updatePackageTypes() {
    // TODO: retrieve package types from database
    packageTypes = [{name:"jumbo box", size:2000}, {name:"large box", size:100}, {name:"small pack", size:10}, {name:"single unit", size:1}]; // test data

    updatePackageTypeOptions();
}

function updatePackageTypeOptions() {
    $("#add_list").children().each(function() {
        var select = $(this).children("select[name='package_input']")
            .empty();

        packageTypes.forEach(function(each) {
            var packageType = $(document.createElement("option"))
                .text(each.name + " " + each.size)
                .data("name", each.name)
                .data("size", each.size);

            select.append(packageType);
        });
    });
}

function updateLocations() {
    // TODO: retrieve locations from database
    locations = [{name:"A-113", id:301}, {name:"C-323", id:302}, {name:"E-009", id:303}]; // test data

    updateLocationOptions();
}

function updateLocationOptions() {
    var select = $("#location_input")
        .empty();

    locations.forEach(function(each) {
        var location = $(document.createElement("option"))
            .text(each.name)
            .data("id", each.id);

        select.append(location);
    });
}

function submitAdd() {
    updateTotal();

    var pileId = $("#location_input").children("option:selected").data("id") || 0;

    if (productId == 0 || pileId == 0 || total == 0) {
        $("#response").text("Error: Submit add inventory.");
        return;
    }

    // TODO: submit add inventory
    $.get(window.apiRoute + "/addInventory/" + productId + "/" + pileId + "/" + total, function(res) {
        $("#response").text("Added inventory.");
        navigation.go(window.args.PreviousPage, {ProductID:window.args.ProductID});
    }).fail(function(res) {
        $("#response").text("Error: Submit add inventory.");
    });
}

function submitNewPackageType() {
    var name = $("#pkg_name").val();
    var size = parseInt($("#pkg_size").val()) || 0;

    if (name == "" || size == 0) {
        $("#response").text("Error: Submit new package type.");
        return;
    }

    // TODO: submit add new package type
    $.get(window.apiRoute + "/addNewPackageType/" + name + "/" + size, function(res) {
        $("#response").text("Added new package type: " + name + " " + size);
        updatePackageTypes();
    }).fail(function(res) {
        $("#response").text("Error: Submit new package type.");
    });
}
