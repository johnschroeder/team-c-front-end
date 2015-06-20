var itemName = "";
var packageSizes = [];
var locations = [];
var total = 0;

function init() {
    // get item name
    itemName = "CHP #10 Regular Envelopes";
    $("#item_text").text(itemName);

    // get package sizes
    packageSizes = [{name:"jumbo box", size:"2000"}, {name:"large box", size:"100"}, {name:"small pack", size:"10"}, {name:"single unit", size:"1"}];
    updatePackageSizes();

    // get locations
    locations = ["A-113", "C-323", "E-009"];
}

function addEntry() {
    var entry = $(document.createElement("div"))
        .appendTo("#add_list");

    // package size input
    var select = $(document.createElement("select"))
        .attr("name", "package_input")
        .attr("onchange", "updateTotal()");

    packageSizes.forEach(function(each) {
        var packageSize = $(document.createElement("option"))
            .text(each.name + " " + each.size)
            .data("name", each.name)
            .data("size", each.size);

        select.append(packageSize);
    });

    entry.append(select);

    entry.append(" * ");

    // amount input
    input = $(document.createElement("input"))
        .attr("name", "amount_input")
        .attr("type", "text")
        .attr("onkeyup", "updateTotal()");

    entry.append(input);

    entry.append(" Location ");

    // location input
    select = $(document.createElement("select"))
        .attr("name", "location_input");

    locations.forEach(function(each) {
        var location = $(document.createElement("option"))
            .text(each);

        select.append(location);
    });

    entry.append(select);

    // count of
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

// Array of entries: {packageName, packageSize, amount, location, count}
function getEntries() {
    var a = [];

    $("#add_list").children().each(function() {
        var entry = {};

        entry.packageName = $(this).children("select[name='package_input']").children("option:selected").data("name");
        entry.packageSize = $(this).children("select[name='package_input']").children("option:selected").data("size");
        entry.amount = $(this).children("input[name='amount_input']").val();
        entry.location = $(this).children("select[name='location_input']").children("option:selected").text();
        entry.count = $(this).children("span[name='count_of_text']").children("span[name='count_text']").text();
        a.push(entry);
    });

    return a;
}

// Array of package sizes: {name:string, size:number}
function getPackageSizes() {
    return packageSizes;
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

function updatePackageSizes() {
    // retrieve package sizes from backend
    // update packageSizes
    updatePackageSizeOptions();

    updateTotal(); // just in case something got deleted
}

function updatePackageSizeOptions() {
    // update options
    $("#add_list").children().each(function() {
        var select = $(this).children("select[name='package_input']")
            .empty();

        packageSizes.forEach(function(each) {
            var packageSize = $(document.createElement("option"))
                .text(each.name + " " + each.size)
                .data("name", each.name)
                .data("size", each.size);

            select.append(packageSize);
        });
    });
}

function submitAdd() {
    // post to submit route
    // return to last page
    console.log("Submit: " + updateTotal());
    console.log(getEntries());
}

function submitNewPackageSize() {
    var name = $("#pkg_name").val();
    var size = parseInt($("#pkg_size").val()) || -1;

    if (name == "" || size == -1) {
        console.log("Error: Submit new package size.");
        return;
    }

    console.log("Submit new package size: " + name + ", " + size);

    // if successful, updatePackageSizes()
}
