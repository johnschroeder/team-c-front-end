/**
 * Manages the functionality of the Pull Inventory screen located in PullInventory.html
 */
var pullInventory = {

    // Store arguments passed in from previous page
    navigationArgs: {
        productID: null,
        productName: null,
        previousPage: null,
        totalQuantity: null
    },


    /**
     * Populate the page with relevant information
     */
    init: function(){

        //grab and save navigation object arguments
        this.navigationArgs.productID = window.args.ProductID;
        this.navigationArgs.productName = window.args.ProductName;
        this.navigationArgs.previousPage = window.args.PreviousPage;
        this.navigationArgs.totalQuantity = window.args.TotalQuantity;

        $('#ProductName').text(this.navigationArgs.productName);
        $('#AvailableAmout').text(this.navigationArgs.totalQuantity);

        //add dropdown options to select
        var selectEle = $("#InputDiv").children().find(".size");
        this.PopulateOptions( selectEle, this.navigationArgs.productID );

    },


    /**
     * Populate the dropdown menu for selecting package size
     * @param dropdown - The specific dropdown we're populating
     * @param pID - The product id of the current product
     */
    PopulateOptions: function( dropdown, pID ){

        var addNew = new Option("New ---", -1);
        $(dropdown).append($(addNew));

        navigation.hit( "/GetSizeByProductID/" + pID, function(res) {
            var temp = $.parseJSON(res);

            for (var i = 0; i < temp.length; i++) {
                var obj = temp[i];
                var optionname = obj.Name + "---" + obj.Size;
                var option = new Option(optionname, obj.SizeMapID);
                var exist = 0;
                $(dropdown).append($(option));
            }
        })/*.fail(function(res) {
            $("#response").text("Error: Init: Connection error.");
            $("#response").text("Error: Init: Connection error.");
        });*/
    },


    /**
     * Add another row to the pull menu through cloning
     */
    AddMore: function(){

        var rowToCopy = $( '.InputChild').first(); //Grab the first InputChild row to duplicate
        var rowsContainer = '#InputDiv';

        rowToCopy.clone().appendTo( rowsContainer );

        this.ReCalculate();

    },


    /**
     * Recalculate the subtotals of each row and the final total
     */
    ReCalculate: function(){

        var total = 0;

        $('#InputDiv').children('.InputChild').each(function () {
            var subtotal = 0;
            var size = $(this).find('.Size').find('option:selected').text().split('---', 2)[1];

            if (size < 0) size = 0;

            var count = $(this).find('.Count').val();
            var subtotal = size*count;
            total += subtotal;
            $(this).find('.Subtotal').text(subtotal);
        });

        $('#TotalInventory').text(total);

        var productTotal = this.navigationArgs.TotalQuantity;

        if (total > productTotal)
            alert("There is not enough inventory to fullfill this pull. Current total inventory is " + productTotal + ".");
    },


    /**
     * Handle what happens when a value is selected or changed in a pull-row dropdown menu
     * @param dropdown - The dropdown menu whose option changed
     */
    SelectOnchange: function( dropdown ) {

        var selectedValue = dropdown.value;

        if (selectedValue == -1) {
            this.AddNewSize();
            return;
        } else {
            $("#AddNewSize").hide();
        }

        this.ReCalculate();
    },


    /**
     * Display the Add New Size menu
     */
    AddNewSize: function(){

        $("#AddNewSize").show();
    },


    /**
     * Process and validate the submission of a new size
     */
    SubmitNewSize: function(){

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
        var productID = this.navigationArgs.ProductID;
        var productName = this.navigationArgs.ProductName;

        this.submitAddNewSize();

        var sizeMapID = 0;//GetSizeMapIDbyName(sizeName, size);

        //clean up
        $('#SizeName').val('');
        $('#SizeNumber').val('');
        $("#AddNewSize").hide();
    },


    /**
     * Send validated new size to the backend for saving
     */
    submitAddNewSize: function(){

        //send request
        var sizeName = $.trim($('#SizeName').val());
        var size = $('#SizeNumber').val();
        var productID = this.navigationArgs.ProductID;
        var productName = this.navigationArgs.ProductName;

        navigation.hit( "/addProductSize/" + productID + "/" + sizeName + "/" + size, function (res) {
            alert("New Size " + sizeName + " for product " + productName + " Added!");
            this.BindNewOption(sizeName, size);
        });

    },


    /**
     * @param n : sizeName of the newly added size
     * @param s : size of the newly added size
     * This function bind newly created size to the size dorpdown in the input child rows
     */
    BindNewOption: function( n, s ) {

        var productID = this.navigationArgs.ProductID;
        var productName = this.navigationArgs.ProductName;

        navigation.hit( "/GetSizeMapID/" + productID + "/" + n + "/" + s, function (resp) {
            var temp = $.parseJSON(resp);
            var smID = temp[0].SizeMapID;

            $('#InputDiv').children('.InputChild').each(function () {
                var option = new Option(n + "---" + s, smID);
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
        })/*.fail(function(res) {
            $("#response").text("Error: BindNewOption: Connection error.");
        });*/
    },


    /**
     * Show the Add to Existing Cart menu and populate the dropdown list
     */
    AddToExistingCart: function(){

        $("#divSelectCart").show();
        $("#divNewCart").hide();
        $('#slCart').empty();

        var username = 'don';//this needs to be swap out for real username

        navigation.hit( "/Carts/GetCartsByUser/" + username, function (resp) {
            var temp = $.parseJSON(resp);

            for (var i = 0; i < temp.length; i++) {
                var obj = temp[i];
                var cartoption = new Option(obj.CartName, obj.CartID);
                $('#slCart').append($(cartoption));
            }
        })/*.fail(function(res) {
            $("#response").text("Error: AddToExistingCart: Connection error.");
        });*/;
    },


    /**
     * Show and populate the Create a New Cart menu
     */
    AddToNewCart: function(){

        $("#divSelectCart").hide();
        $("#divNewCart").show();
        $('#sltAssignee').empty();
        $('#iptCartName').val('');
        $('#iptDaysToSave').val('');

        navigation.hit( "/Carts/GetPossibleAssignees/", function(resp) {
            var temp = $.parseJSON(resp);

            for (var i = 0; i < temp.length; i++) {
                var obj = temp[i];
                var assOption = new Option(obj.Assignee);
                $('#sltAssignee').append($(assOption));
            }
        }) /*.fail(function(res) {
            $("#response").text("Error: AddToNewCart: Connection error.");
        })*/;
    },


    /**
     * Submit a new cart to the backend for saving
     */
    SubmitNewCart: function(){

        var assignee = $("#sltAssignee option:selected").text();
        var reporter = "don";///////////////////////This need to be swap out for real username
        var cartName = $("#iptCartName").val();
        var keepdays = $("#iptDaysToSave").val();
        var today = new Date();
        var deleteDate = new Date(today);

        if ( cartName == '') {
            alert("Cart Name/Order Number is required field");
            return;
        }

        if (keepdays <= 0) keepdays = 1;

        var self = this;
        navigation.hit("/Carts/CreateCart/" + cartName + "/" + reporter + "/" + assignee + "/" + keepdays, function () {
            alert("New Cart " + cartName + " Added!");
            //clear inputs
            //delete options in assignee
            $('#iptCartName').val('');
            $('#iptDaysToSave').val('');
            $('#sltAssignee').empty();
            $('#divNewCart').hide();
            self.AddToExistingCart();
        });

    },


    /**
     * Send one row to the back end for saving
     * @param cID - The cart ID
     * @param smID - The size map ID
     * @param qty - The quantity to add
     */
    AddOneItemToCart: function( cID, smID, qty ){

        navigation.hit("/Carts/AddItemToCartGeneral/" + cID + "/" + smID + "/" + qty, function (resp) {
            var msg = "";

            msg = resp.split('####', 2)[0];
            if (msg.trim() != 'Success') {
                $("#response").text(msg);
            }

            return msg;
        })/*.fail(function(res) {
            var msg = "Error: Init: Connection error.";
            $("#response").text(msg);
            return msg;
        })*/;
    },

    /**
     * Send every row recursively to the back end for saving
     * @param entry - The jQuery object containing the list of row entries
     */
    AddOneItemToCartRecursively: function(entry){

        var nextEntry = entry;

        while (nextEntry.length && !(nextEntry.find('option:selected').val() > 0)) {
            nextEntry = nextEntry.next();
        }

        if (!nextEntry.length) {
            return;
        }

        var sizeMapID = $(nextEntry).find('.Size').find('option:selected').val();
        var cartID = $('#slCart').find('option:selected').val();
        var quantity = $(nextEntry).find('.Count').val();

        var self = this;

        $.get(window.apiRoute + "/Carts/AddItemToCartGeneral/" + cartID + "/" + sizeMapID + "/" + quantity, function (resp) {
            var msg = "";

            msg = resp.split('####', 2)[0];

            if (msg.trim() != 'Success') {
                $("#response").text(msg);
            }

            console.log(msg);
        }).then(function() {
            nextEntry = nextEntry.next();

            while (nextEntry.length && !(nextEntry.find('option:selected').val() > 0)) {
                nextEntry = nextEntry.next();
            }

            if (nextEntry.length) {
                self.AddOneItemToCartRecursively(nextEntry);
            } else {
                $('#slCart').empty();
                $("#divSelectCart").hide();
                alert("Items added to cart ");
                navigation.go(self.navigationArgs.previousPage, {ProductID: self.navigationArgs.productID});
            }
        }).fail(function(res) {
            if(res.status == 511){
                console.log("Access Denied!");
                alert("Sorry your permission level doesn't allow you to access this page.");
                navigation.go("Home.html");
            }
            if(res.status == 510){
                navigation.go("loginForm.html");
                alert("You have to log in before you can see this page!");
            }
        });
    },


    /**
     * Handle submission of adding a product to an existing cart
     */
    ChooseExistingCart: function(){

        var availableAmount = parseInt($('#AvailableAmout').text());
        var currentTotal = parseInt($('#TotalInventory').text());

        if (availableAmount < currentTotal) {
            alert("There is not enough inventory to pull. Please Update Pull Amount");
            return;
        }

        this.AddOneItemToCartRecursively($('#InputDiv').children('.InputChild').first());
    },


    /**
     * Go back to the previous page
     */
    back: function(){
        navigation.go(this.navigationArgs.PreviousPage, {ProductID: this.navigationArgs.ProductID});
    }

};
