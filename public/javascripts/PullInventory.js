/**
 * Created by Kun on 6/18/2015.
 */


function init() {
    //grab navigation object arguments
    var productID = window.args.ProductID;
    var productName = window.args.ProductName;
    var previousPage = window.args.PreviousPage;
    var totalQuantity = window.args.TotalQuantity;
    //console.log("PRODUCT ID: " + productID);
    //console.log("PRODUCT Name: " + productName);
    //console.log("Total Quantity: " + totalQuantity);
    //console.log("Previous Page" + previousPage);
    $('#ProductName').text(productName);
    $('#AvailableAmout').text(totalQuantity);

    //add dropdown options to select
    var selectEle = $("#InputDiv").children().find(".size");
    PopulateOptions(selectEle, productID);
}

function PopulateOptions(dropdown, pID) {
    var addNew = new Option("New ---", -1);
    $(dropdown).append($(addNew));

    $.get(window.apiRoute + "/GetSizeByProductID/" + pID, function(res) {
        if (res && res.length) {
            var temp = $.parseJSON(res);

            for(var i = 0; i < temp.length; i++) {
                var obj = temp[i];
                var optionname = obj.Name + "---" + obj.Size;
                var option = new Option(optionname, obj.SizeMapID);
                var exist = 0;
                $(dropdown).append($(option));
            }
        } else {
            $("#response").text("Error: Init: No response.");
        }
    }).fail(function(res) {
        $("#response").text("Error: Init: Connection error.");
    });
}

function AddMore() {
    var myDiv = document.getElementById("InputDiv").firstElementChild;
    var divClone = myDiv.cloneNode(true);
    divCloneChild = divClone.childNodes;
    divCloneChild[3].value = "";
    divCloneChild[1].value = 0;
    var pDiv = document.getElementById("InputDiv");
    pDiv.appendChild(divClone);

    ReCalculate();
}

function ReCalculate() {
    var total = 0;

    $('#InputDiv').children('.InputChild').each(function() {
        var subtotal = 0;
        var size = $(this).find('.Size').find('option:selected').text().split('---', 2)[1];

        if (size < 0) size = 0;

        var count = $(this).find('.Count').val();
        var subtotal = size*count;
        total += subtotal;
        $(this).find('.Subtotal').text(subtotal);
    });

    $('#TotalInventory').text(total);

    var productTotal = window.args.TotalQuantity;

    if (total > productTotal)
        alert("There is not enough inventory to fullfill this pull. Current total inventory is " + productTotal + ".");
}

function SelectOnchange(dropdown) {
    var selectedValue = dropdown.value;

    if (selectedValue == -1) {
        AddNewSize();
        return;
    } else {
        $("#AddNewSize").hide();
    }

    ReCalculate();
}

function AddNewSize() {
    $("#AddNewSize").show();
}

function SubmitNewSize() {
    //validate user input.
    if ($('#SizeNumebr').val() <= 0) {
        alert("New size must be greater than 0");
        return;
    }

    if ($.trim($('#SizeName').val()) == '') {
        alert("Size name can't be empty.");
        return;
    }

    var sizeName = $.trim($('#SizeName').val());
    var size = $('#SizeNumber').val();
    var productID = window.args.ProductID;
    var productName = window.args.ProductName;

    submitAddNewSize();

    var sizeMapID = 0;//GetSizeMapIDbyName(sizeName, size);

    //clean up
    $('#SizeName').val('');
    $('#SizeNumber').val('');
    $("#AddNewSize").hide();
}

function submitAddNewSize() {
    //send request
    var sizeName = $.trim($('#SizeName').val());
    var size = $('#SizeNumber').val();
    var productID = window.args.ProductID;
    var productName = window.args.ProductName;

    $.get(window.apiRoute + "/addProductSize/" + productID + "/" + sizeName+"/" + size, function(res) {
        alert("New Size "+ sizeName + " for product " + productName + " Added!");
        BindNewOption(sizeName,size);
    });
}

function BindNewOption(n, s) {
    var productID = window.args.ProductID;
    var productName = window.args.ProductName;

    $.get(window.apiRoute + "/GetSizeMapID/" + productID + "/" + n + "/" + s, function(resp) {
        if (resp && resp.length) {
            var temp = $.parseJSON(resp);
            var smID = temp[0].SizeMapID;

            $('#InputDiv').children('.InputChild').each(function() {
                var option = new Option(n + "---" +s, smID);
                var dropdown = $(this).find('.Size')
                    .append(option);

                if ($(dropdown).val() == -1) {
                    $(dropdown).val(smID);
                }
            });
            //clean up
            $('#SizeName').val('');
            $('#SizeNumber').val('');
            $("#AddNewSize").hide();
        } else {
            $("#response").text("Error: BindNewOption: No response.");
        }
    }).fail(function(res) {
        $("#response").text("Error: BindNewOption: Connection error.");
    });
}

function AddToExistingCart() {
    $("#divSelectCart").show();
    $("#divNewCart").hide();
    $('#slCart').empty();

    var username = 'don';//this needs to be swap out for real username

    $.get(window.apiRoute + "/Carts/GetCartsByUser/" + username, function(resp) {
        if (resp && resp.length) {
            var temp = $.parseJSON(resp);

            for (var i = 0; i < temp.length; i++) {
                var obj = temp[i];
                var cartoption = new Option(obj.CartName, obj.CartID);
                $('#slCart').append($(cartoption));
            }
        } else {
            $("#response").text("Error: AddToExistingCart: No response.");
        }
    }).fail(function(res) {
        $("#response").text("Error: AddToExistingCart: Connection error.");
    });
}

function AddToNewCart() {
    $("#divSelectCart").hide();
    $("#divNewCart").show();
    $('#sltAssignee').empty();
    $('#iptCartName').val('');
    $('#iptDaysToSave').val('');

    $.get(window.apiRoute + "/Carts/GetPossibleAssignees/", function(resp) {
        if (resp && resp.length) {
            var temp = $.parseJSON(resp);

            for (var i = 0; i < temp.length; i++) {
                var obj = temp[i];
                var assOption = new Option(obj.Assignee);
                $('#sltAssignee').append($(assOption));
            }
        } else {
            $("#response").text("Error: AddToNewCart: No response.");
        }
    }).fail(function(res) {
        $("#response").text("Error: AddToNewCart: Connection error.");
    });
}

function SubmitNewCart() {
    var assignee = $("#sltAssignee option:selected").text();
    var reporter = "don";///////////////////////This need to be swap out for real username
    var cartName = $("#iptCartName").val();
    var keepdays = $("#iptDaysToSave").val();
    var today = new Date();
    var deleteDate = new Date(today);

    if ($("#iptCartName").val()=='') {
        alert("Cart Name/Order Number is required field");
        return;
    }

    if (keepdays <= 0) keepdays=1;

    $.get(window.apiRoute + "/Carts/CreateCart/" + cartName + "/" + reporter + "/" + assignee + "/" + keepdays, function() {
        alert("New Cart " + cartName + " Added!");
        //clear inputs
        //delete options in assignee
        $('#iptCartName').val('');
        $('#iptDaysToSave').val('');
        $('#sltAssignee').empty();
        $('#divNewCart').hide();
        AddToExistingCart();
    });
}

function AddOneItemToCart(cID, smID, qty) {
    $.get(window.apiRoute + "/Carts/AddItemToCartGeneral/" + cID + "/" + smID + "/" + qty, function(resp) {
        var msg = "";

        if (resp && resp.length) {
            msg = resp.split('####', 2)[0];

            if (msg.trim() != 'Success') {
                $("#response").text(msg);
            }
        } else {
            msg = "Error: Init: No response.";
            $("#response").text(msg);
        }

        return msg;
    }).fail(function(res) {
        var msg = "Error: Init: Connection error.";
        $("#response").text(msg);
        return msg;
    });
}

function ChooseExistingCart() {
    var availableAmount = parseInt($('#AvailableAmout').text());
    var currentTotal = parseInt($('#TotalInventory').text());

    if (availableAmount < currentTotal) {
        alert("There is not enough inventory to pull. Please Update Pull Amount");
        return;
    }

    $('#InputDiv').children('.InputChild').each(function() {
        var subtotal = 0;
        var sizeMapID = $(this).find('.Size').find('option:selected').val();
        var cartID = $('#slCart').find('option:selected').val();

        if (sizeMapID > 0) {
            var count = $(this).find('.Count').val();
            var message = AddOneItemToCart(cartID, sizeMapID, count);
            console.log(message);

            if (message != 'Success') {
                alert(message);
                return;
            }
        }
    });

    $('#slCart').empty();
    $("#divSelectCart").hide();
    alert("Items added to cart ");
    navigation.go("DisplayInventory.html", {PreviousPage: "PullInventory.html"});
}
