(function($){

    /**
     * Handles the display-all functionality and filtering
     */

    var display_inventory = {
        host: window.apiRoute + "/displayInventory/",
        inventory: false,
        customerSelector: null,
        consolidated: false,

        /**
         * Go fetch everything and get it set up
         */
        init: function() {
            navigation.setTitle("View Inventory");
            var self = this;

            $("#track_by").change(function() {
                $("#customer-filter").hide();
                $("#item-filter").hide();

                switch($("#track_by option:selected").val()) {
                    case "Customer":
                        $("#customer-filter").show();
                        $("#qr_button").removeClass("hidden");
                        break;
                    case "Product":
                        $("#item-filter").show();
                        $("#qr_button").removeClass("hidden");
                        break;
                    case "All":
                        self.showAllItems();
                        $("#qr_button").addClass("hidden");
                        break;
                    default:
                        break;
                }
            });

            // Setup customer search bar.
            $("#customer").autocomplete({
                minLength: 1,
                source: function(request, response) {
                    $.getJSON(window.apiRoute + "/customerAutoComplete/" + encodeURIComponent(request.term), response); // data = [{label:"item 1"}, {label:"item 2"}, ..]
                },
                select: function(event, ui) {
                    // ui { item { label, value } }
                    self.searchCustomer(ui.item.label);
                }
            });

            $("#customer").keypress(function(e) {
                if (e.which == 13) {
                    self.searchCustomer($("#customer").val());
                }
            });

            $("#search_customer_button").click(function() {
                self.searchItem($("#customer").val());
            });

            // Setup item search bar.
            $("#item").autocomplete({
                minLength: 1,
                source: function(request, response) {
                    $.getJSON(window.apiRoute + "/itemAutoComplete/" + encodeURIComponent(request.term), response); // data = [{label:"item 1"}, {label:"item 2"}, ..]
                },
                select: function(event, ui) {
                    // ui { item { label, value } }
                    self.searchItem(ui.item.label);
                }
            });

            $("#item").keypress(function(e) {
                if (e.which == 13) {
                    self.searchItem($("#item").val());
                }
            });

            $("#search_item_button").click(function() {
                self.searchItem($("#item").val());
            });

            // State
            var filter = "";
            var keyword = "";

            if (window.state && window.state.filter && window.state.keyword) {
                filter = window.state.filter || "";
                keyword = window.state.keyword || "";
            } else {
                var query = window.location.search.substring(1).split('&');
                var pair = query[0].split('=');

                filter = decodeURIComponent(pair[0]);
                keyword = decodeURIComponent(pair[1]);

                navigation.saveState({filter:filter, keyword:keyword});
            }

            // Show state
            switch (filter.toLowerCase()) {
                case "customer":
                    $("#track_by option:contains('Customer')").prop("selected", true);
                    $("#track_by").trigger("change");
                    $("#customer").val(keyword);
                    this.searchCustomer(keyword);
                    break;
                case "product":
                    $("#track_by option:contains('Product')").prop("selected", true);
                    $("#track_by").trigger("change");
                    $("#item").val(keyword);
                    this.searchItem(keyword);
                    break;
                case "all":
                    if (keyword.toLowerCase() == "true") {
                        $("#track_by option:contains('All')").prop("selected", true);
                        $("#track_by").trigger("change");
                        this.showAllItems();
                    }
                    break;
                default:
                    break;
            }
        },

        searchItem: function(keyword) {
            if (!keyword) return;
            this.hideError();

            //console.log("Search product: " + keyword); return;
            var self = this;

            $.getJSON(window.apiRoute + "/searchItem/" + encodeURIComponent(keyword), function(data) {
                if (!data.length || data[0] === null) {
                    self.showNotFound();
                    return;
                }

                self.inventory = data;
                self.display_inventory();
                $("#customer").val("");
                navigation.saveState({filter:"product", keyword:keyword});
            }).fail(function() {
                self.showError("Failed to search for product: " + keyword + ".");
            });
        },

        searchCustomer: function(keyword) {
            if (!keyword) return;
            this.hideError();

            //console.log("Search customer: " + keyword); return;
            var self = this;

            $.getJSON(window.apiRoute + "/searchCustomer/" + encodeURIComponent(keyword), function(data) {
                if (!data.length || data[0] === null) {
                    self.showNotFound();
                    return;
                }

                self.inventory = data;
                self.display_inventory();
                $("#item").val("");
                navigation.saveState({filter:"customer", keyword:keyword});
            }).fail(function() {
                self.showError("Failed to search for customer: " + keyword + ".");
            });
        },

        showAllItems: function() {
            this.hideError();
            var self = this;

            $.getJSON( this.host, function( data ) {
                if( data && data.length && data[0] !== null){
                    self.inventory = data;
                    //self.consolidate_inventory();
                    self.display_inventory();
                    $("#customer").val("");
                    $("#item").val("");
                    navigation.saveState({filter:"all", keyword:"true"});
                } else {
                    self.showNotFound();
                }
            }).fail( function(response){
                self.showError("Failed to show all inventory: " + response + ".");
            });
        },

        showNotFound: function() {
            $(".inventory-container")
                .empty()
                .html("<br/><b>No inventory found.</b>");
        },

        /**
         * Consolidate all of the items by product id
         */
        /*consolidate_inventory: function() {
         this.consolidated = new Array();
         if( !this.inventory || !this.inventory.length )
         return;
         for( var i = 0; i < this.inventory.length; ++i ){
         var found = false;
         for( var j = 0; j < this.consolidated.length; ++j ){
         if( this.consolidated[j].ProductID == this.inventory[i].ProductID ){
         found = true;
         this.consolidated[j].Runs.push( this.inventory[i] );
         this.consolidated[j].Total += this.inventory[i].Amount;
         this.consolidated[j].Runs.sort( function(a, b){ return a.Date.localeCompare( b.Date ) } );
         break;
         }
         }
         if( !found ){
         this.consolidated.push({
         ProductID: this.inventory[i].ProductID,
         Total: this.inventory[i].Amount,
         Runs: [ this.inventory[i] ]
         });
         }
         }
         },*/

        /**
         * Output all of the items to the screen
         */
        display_inventory: function() {

            //if( !this.consolidated || !this.consolidated.length )
            //    return;

            var inventory_container = $( '.inventory-container' );
            inventory_container.empty();

            //var customer_filter_container = $( '.filter.customer');
            //customer_filter_container.empty();

            for( var i = 0; i < this.inventory.length; ++i ){

                //var latest_run = this.inventory[i].LastRunDate;
                //var concatenated_customer = this.inventory[i].Runs[0].Customer.replace(/ /g,"_");

                var ProductID = this.inventory[i].ProductID;
                var ProductName = this.inventory[i].ProductName;
                var TotalQuantity = this.inventory[i].TotalQuantityAvailable;

                var inventory_item = "<div class='inventory-item " /*+ concatenated_customer */ + "'>";
                inventory_item +=
                    "<div><a class='detail-view' href='javascript:void(0);' data-id='" + this.inventory[i].ProductID + "'>"
                    + "<div class='thumbnail'><div class='noImage'>No Image</div></div>"
                    + "<span class='name'>" + this.inventory[i].ProductName + "</span>"
                    + "</a></div>";
                inventory_item += "<div class='pull-button'>" +
                    "<button class='btn btn-default' onclick='gotoAddInventory(" + ProductID + "," + "\"" + ProductName + "\"" + ")' type='button'>Add</button>";

                inventory_item += "<button class='btn btn-default' onclick='gotoPullInventory(" + ProductID + "," + "\"" + ProductName + "\"" + "," + TotalQuantity + ")' type='button'>Pull</button></div>";
                if( this.inventory[i].LastRunInitialQuantity )
                    inventory_item += "<div>Last run: " + this.inventory[i].LastRunDate + " (+" + this.inventory[i].LastRunInitialQuantity + ")</div>";
                else
                    inventory_item += "<div>No runs yet</div>";
                inventory_item += "<div class='total'>" + TotalQuantity + "</div>";
                inventory_item += "</div>";

                inventory_container.append( inventory_item );

                /*customer_filter_container.append(
                 "<option value='" + concatenated_customer + "'>" +
                 this.inventory[i].Runs[0].Customer +
                 "</option>"*/
            }

            //Fetch the thumbnails
            $('.detail-view').each(function(){
                var id = $( this).data('id');
                var self = this;

                if( !id )
                    return;

                var thumbSource = navigation.makeImageURL( id );
                navigation.checkImage( thumbSource,
                    function(){
                        $( self ).find(".thumbnail").html( "<img src='"+thumbSource+"'/>" );
                    },
                    function(){}
                );
            });

            //this.setup_customer_select_menu();
            this.setup_links();
        },

        /**
         * Set up the filter actions for the customer select filter
         */
        setup_customer_select_menu: function() {
            var select_menu = $( '.filter.customer' );

            select_menu.change( function(){

                var selection = select_menu.val()

                if( selection == "0" ){
                    $('.inventory-item').show();
                } else {
                    $( '.inventory-item').hide();
                    $( '.'+selection).show();
                }

            });
        },

        setup_links: function() {

            $( '.display-inventory-container').find( '.detail-view').on( 'touchend click', function( evt ){

                evt.preventDefault();

                var product_id = $( this).data( 'id' );

                navigation.go("ItemDetailView.html", {
                    ProductID: product_id
                });

                /*$('#main_cont').load('ItemDetailView.html', function(){
                 detailView.init( product_id );
                 });*/

            });
        },

        // Show the error message on top of the page.
        // msg: The error message to show.
        showError: function (msg) {
            $("#error").removeClass("hidden").text(msg);
        },

        // Hide the error message.
        hideError: function () {
            $("#error").addClass("hidden");
        }

    };

    display_inventory.init();

})( jQuery );

/**
 * Created by Kun on 6/18/2015.
 */

var gotoPullInventory = function (pid, pname, tlq) {
    navigation.go("PullInventory.html", {
        ProductID: pid,
        ProductName: pname,
        TotalQuantity: tlq
    });
};
var gotoAddInventory = function (pid, pname) {
    navigation.go("AddInventory.html", {
        ProductID: pid,
        ProductName: pname || ""
    });
};

var qrCode = function () {
    var filter = "";
    var keyword = null;

    switch($("#track_by option:selected").val()) {
        case "Customer":
            filter = "customer";
            keyword = encodeURIComponent($("#customer").val());
            break;
        case "Product":
            filter = "product";
            keyword = encodeURIComponent($("#item").val());
            break;
        default:
            break;
    }

    if (!filter || !keyword) return;

    navigation.go("ShowQRCode.html", {
        Text: window.location.protocol + "//" + window.location.hostname + "/" + "DisplayInventory?" + filter + "=" + keyword
    });
};
