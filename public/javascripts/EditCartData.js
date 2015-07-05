var editCartData = {
    init: function () {
        $("#cart_name").text(window.args.cartName);

        var host = window.apiRoute + "/Carts/GetAllCarts/";

        var original_cart = "original_cart";
        var original_reporter = "original_reporter";
        var original_assignee = "original_assignee";
        var original_date = "original_date";

        $.get(host, function (data) {
            var carts = $.parseJSON(data);

            var cartsFound = carts.filter(function (each) {
                if (each.CartID == window.args.cartID) return true;
            });

            if (!cartsFound.length) {
                $("#response").text("Error: Cart not found.");
                return;
            }

            var cart = cartsFound[0];

            original_cart = cart.CartName;
            original_reporter = cart.Reporter;
            original_assignee = cart.Assignee;
            original_date = cart.DateToDelete;

            $("#CartName_text").text(original_cart);
            $("#Reporter_text").text(original_reporter);
            $("#Assignee_text").text(original_assignee);
            $("#Date_text").text(original_date.split("T")[0]);

            $("#CartName").val(original_cart);
            $("#Reporter").val(original_reporter);
            $("#Assignee").val(original_assignee);
            $("#Date").val(original_date.split("T")[0]);

            $("#edit_button").prop("disabled", false);
        });

        //$("#CartName").focus();
    },

    getCartId: function () {
        return window.args.cartID;
    },

    getCartName: function () {
        return $("#CartName_text").text();
    },

    edit: function () {
        $("#CartName_text").addClass("hidden");
        $("#Reporter_text").addClass("hidden");
        $("#Assignee_text").addClass("hidden");
        $("#Date_text").addClass("hidden");

        $("#CartName").removeClass("hidden");
        $("#Reporter").removeClass("hidden");
        $("#Assignee").removeClass("hidden");
        $("#Date").removeClass("hidden");
        $("#delete_button").removeClass("hidden");

        $("#edit_button")
            .attr("onclick", "editCartData.CartDataEdit(editCartData.getCartId())")
            .text("Done");
    },

    CartDataEdit: function (cartID) {
        //TODO implement: var prodID = getQueryStringParams().inventoryID; and get the prodID from there
        //var prodID = window.args.ProductID

        var newCartName = $("#CartName").val();
        var newReporter = $("#Reporter").val();
        var newAssignee = $("#Assignee").val();
        var newDate = $("#Date").val();

        $("#edit_button").prop("disabled", true);

        var host = window.apiRoute + '/Carts/EditCart/' + cartID + '/' + '"' + newCartName.trim() + '"' + "/" + '"' + newReporter.trim() + '"' + "/" + '"' + newAssignee.trim() + '"' + "/" + '"' + newDate.trim() + '"';

        $.get(host, function (res) {
            $("#CartName").addClass("hidden");
            $("#Reporter").addClass("hidden");
            $("#Assignee").addClass("hidden");
            $("#Date").addClass("hidden");
            $("#delete_button").addClass("hidden");

            $("#CartName_text").text(newCartName)
                .removeClass("hidden");

            $("#Reporter_text").text(newReporter)
                .removeClass("hidden");

            $("#Assignee_text").text(newAssignee)
                .removeClass("hidden");

            $("#Date_text").text(newDate)
                .removeClass("hidden");

            $("#edit_button")
                .attr("onclick", "editCartData.edit()")
                .prop("disabled", false)
                .text("Edit");

            //navigation.go(window.args.previousPage);
        });
    },

    CartItemsEdit: function (cartID, cartName) {
        //navigation.go("EditCartItems.html", {cartID: cartID, cartName: cartName});
    },

    back: function () {
        navigation.go(window.args.previousPage);
    }
};
