var packageSizes = [{name:"test", size:"100"}, {name:"test2", size:"200"}];

function init() {
    updatePackageSizes();
    updatePackageSizeOptions();
}

function addEntry() {
    var entry = $(document.createElement("div"))
    entry.appendTo("#add_list");

    var pkgSelect = document.createElement("select");
    pkgSelect.setAttribute("onchange", "updateTotal()");

    packageSizes.forEach(function(each) {
        packageSize = document.createElement("option");
        packageSize.innerHTML = each.name + " (" + each.size + ")";
        pkgSelect.appendChild(packageSize);

        $(packageSize).data("name", each.name);
        $(packageSize).data("size", each.size);
    });

    entry.append(pkgSelect);

    entry.append(" Amount: ");
    input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("onkeyup", "updateTotal()");
    entry.append(input);

    entry.append(" Location: ");
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    entry.append(input);
}

// Get an array of entries
function getEntryList() {
    var a = [];

    $("#add_list").children().each(function() {
        var entry = {};

        entry.packageName = $(this).children("select").children("option:selected").data("name");
        entry.packageSize = $(this).children("select").children("option:selected").data("size");
        entry.amount = $(this).children("input").val();
        entry.location = $(this).children("input").next().val();
        a.push(entry);
    });

    return a;
}

// Get an array of entries
function getPackageSizeList() {
    return packageSizes;
}

// Update the total text
function updateTotal() {
    $("#total_text").text(calculateTotal());
}

function calculateTotal() {
    var total = 0;

    $("#add_list").children("div").each(function() { // each entry
        var size = parseInt($(this).children("select").children("option:selected").data("size")) || 0;
        var amount = parseInt($(this).children("input").val()) || 0;
        total += size * amount;
    });

    return total;
}

function submitAdd() {
    // post to submit route
    // return to last page
    console.log("Submit: " + calculateTotal());
}

function updatePackageSizes() {
    // retrieve package sizes from backend
    // update packageSizes
    updatePackageSizeOptions();
}

function updatePackageSizeOptions() {
    // update options
    $("#add_list").children().each(function() {
        var entry = $(this).children("select");

        packageSizes.forEach(function(each) {
            packageSize = document.createElement("option");
            packageSize.innerHTML = each.name + " (" + each.size + ")";
            entry.append(packageSize);
        });
    });
}

function submitNewPackageSize() {
    var name = $("#pkg_name").val();
    var size = parseInt($("#pkg_size").val()) || -1;

    if (name == "" || size == -1) {
        console.log("Error: Submit new package size.");
        return;
    }

    console.log("Submit new package size: " + name + ", " + size);

    // if successful, updatePackageSizeOptions()
}
