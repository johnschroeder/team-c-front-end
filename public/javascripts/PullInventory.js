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

    //add dropdown options to select
    var selectEle = document.getElementById("InputDiv").firstElementChild.childNodes[1];
    PopulateOptions(selectEle,productID);

    $("#AddNewSize").hide();
    $("#divSelectCart").hide();
    $("#divNewCart").hide();
}

function PopulateOptions(dropdown,pID)
{
    var addNew = new Option("New ---", -1);
    $(dropdown).append($(addNew));
    host: window.apiRoute+"/GetSizeByProductID/"+pID.toString();
    $.get(window.apiRoute + "/GetSizeByProductID/" + pID, function(res) {
        if (res && res.length) {
            var temp = $.parseJSON(res);
            for(var i = 0; i < temp.length; i++) {
                var obj = temp[i];
                var optionname=obj.Name + "---" +obj.Size;
                var option = new Option(optionname, obj.SizeMapID);
                var exist=0;
                $(dropdown).append($(option));
            }
        } else {
            $("#response").text("Error: Init: No response.");
        }
    }).fail(function(res) {
        $("#response").text("Error: Init: Connection error.");
    });
}

function AddMore()
{
    var myDiv = document.getElementById("InputDiv").firstElementChild;
    var divClone = myDiv.cloneNode(true);
    divCloneChild = divClone.childNodes;
    divCloneChild[3].value = "";
    divCloneChild[1].value = 0;
    var pDiv = document.getElementById("InputDiv");
    pDiv.appendChild(divClone);

    ReCalculate();
}

function ReCalculate()
{
    var total = 0;
    var inputDiv = document.getElementById("InputDiv");
    var inputChildren = inputDiv.childNodes;
    var inputCount = inputChildren.length;

    $('#InputDiv').children('.InputChild').each(function () {
        var subtotal = 0;
        var size = $(this).find('.Size').find('option:selected').text().split('---', 2)[1];
        if(size<0)
            size=0;
        var count = $(this).find('.Count').val();
        var subtotal = size*count;
        total += subtotal;
        $(this).find('.Subtotal').text(subtotal);
    });
    $('#TotalInventory').text(total);
}

function SelectOnchange(dropdown)
{
    var selectedValue = dropdown.value;
    if(selectedValue == -1) {
        AddNewSize();
        return;
    }
    else
    {
        var sizeDiv = document.getElementById("AddNewSize")
        sizeDiv.style.visibility = "collapse";
    }

    ReCalculate();
}

function AddNewSize()
{
    $("#AddNewSize").show();
}

function SubmitNewSize()
{
    //validate user input.
    if($('#SizeNumebr').val()<=0) {
        alert("New size must be greater than 0");
        return;
    }
    if($.trim($('#SizeName').val()) == ''){
        alert("Size name can't be empty.");
        return;
    }
    var sizeName = $.trim($('#SizeName').val());
    var size = $('#SizeNumber').val();
    var productID = window.args.ProductID;
    var productName = window.args.ProductName;

    submitAddNewSize()

    var sizeMapID=0;//GetSizeMapIDbyName(sizeName,size);

    //clean up
    $('#SizeName').val('');
    $('#SizeNumber').val('');
    $("#AddNewSize").hide();
}

function submitAddNewSize()
{
//send request
    var sizeName = $.trim($('#SizeName').val());
    var size = $('#SizeNumber').val();
    var productID = window.args.ProductID;
    var productName = window.args.ProductName;

    var host = window.apiRoute + "/addProductSize/"+productID+"/"+sizeName+"/"+size;
    sendRequest(host, function() {
        if (dispReq.readyState == 4 && dispReq.status == 200) {
            alert("New Size "+ sizeName +" for product "+productName+" Added!");
            BindNewOption(sizeName,size);
        }
    });
}

function BindNewOption(n,s)
{
    var productID = window.args.ProductID;
    var productName = window.args.ProductName;

    host: window.apiRoute+"/GetSizeMapID/"+productID+"/"+n+"/"+s;
    $.get(window.apiRoute + "/GetSizeMapID/" + productID+"/"+n+"/"+s, function(resp) {
        if (resp && resp.length) {
            var temp = $.parseJSON(resp);
            var smID= temp[0].SizeMapID;
            $('#InputDiv').children('.InputChild').each(function () {
                var option = new Option(n + "---" +s,smID);
                var dropdown = $(this).find('.Size');
                $(dropdown).append(option);
                if($(dropdown).val()==-1)
                {
                    $(dropdown).val(smID);
                }
            });
            //clean up
            $('#SizeName').val('');
            $('#SizeNumber').val('');
            $("#AddNewSize").hide();
        } else {
            $("#response").text("Error: Init: No response.");
        }
    }).fail(function(res) {
        $("#response").text("Error: Init: Connection error.");
    });

}

function AddToExistingCart(){
    $("#divSelectCart").show();
    $("#divNewCart").hide();
    $('#slCart').empty();

    var username = 'don';//this needs to be swap out for real username

    host: window.apiRoute+"/Carts/GetCartsByUser/"+username;
    $.get(window.apiRoute + "/Carts/GetCartsByUser/"+username, function(resp) {
        if (resp && resp.length) {
            var temp = $.parseJSON(resp);
            for(var i = 0; i < temp.length; i++) {
                var obj = temp[i];
                var cartoption = new Option(obj.CartName, obj.CartID);
                $('#slCart').append($(cartoption));
            }

        } else {
            $("#response").text("Error: Init: No response.");
        }
    }).fail(function(res) {
        $("#response").text("Error: Init: Connection error.");
    });

}

function AddToNewCart(){
    $("#divSelectCart").hide();
    $("#divNewCart").show();
    $('#sltAssignee').empty();
    $('#iptCartName').val('');
    $('#iptDaysToSave').val('');
    host: window.apiRoute+"/Carts/GetPossibleAssignees/";
    $.get(window.apiRoute + "/Carts/GetPossibleAssignees/", function(resp) {
        if (resp && resp.length) {
            var temp = $.parseJSON(resp);
            for(var i = 0; i < temp.length; i++) {
                var obj = temp[i];
                var assOption = new Option(obj.Assignee);
                $('#sltAssignee').append($(assOption));
            }
        } else {
            $("#response").text("Error: Init: No response.");
        }
    }).fail(function(res) {
        $("#response").text("Error: Init: Connection error.");
    });
}

function SubmitNewCart()
{
    var assignee = $("#sltAssignee option:selected").text();
    var reporter="don";///////////////////////This need to be swap out for real username
    var cartName=$("#iptCartName").val();
    var keepdays =$("#iptDaysToSave").val();
    var today = new Date();
    var deleteDate = new Date(today);
    if($("#iptCartName").val()=='') {
        alert("Cart Name/Order Number is required field");
        return;
    }
    if(keepdays<=0) {
        keepdays=1;
    }

    var host = window.apiRoute + "/Carts/CreateCart/"+cartName+"/"+reporter+"/"+assignee+"/"+keepdays;
    sendRequest(host, function() {
        if (dispReq.readyState == 4 && dispReq.status == 200) {
            alert("New Cart "+ cartName +" Added!");
            //clear inputs
            //delete options in assignee
            $('#iptCartName').val('');
            $('#iptDaysToSave').val('');
            $('#sltAssignee').empty();
            $('#divNewCart').hide();
            AddToExistingCart();
            $("#slCart option").filter(function() {
                return $(this).text() == cartName;
            }).attr('selected', true);
        }
    });

}

function AddOneItemToCart() {
    //CREATE PROCEDURE AddItemToCart
    //(IN _CartID int, IN _SizeMapID int, IN _Quantity int, IN _RunID int, OUT _Msg varchar(512))

}


function ChooseExistingCart(){
    $('#slCart').empty();
    $("#divSelectCart").hide();
    AddOneItemToCart();
}