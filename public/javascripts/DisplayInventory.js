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
                    case "Item":
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

            // Customer search bar.
            $("#customer").autocomplete({
                minLength: 1,
                source: function(request, response) {
                    $.getJSON(window.apiRoute + "/customerAutoComplete/" + encodeURIComponent(request.term), response); // data = [{label:"item 1"}, {label:"item 2"}, ..]
                },
                select: function(event, ui) {
                    // ui { label, value }
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

            // Item search bar.
            $("#item").autocomplete({
                minLength: 1,
                source: function(request, response) {
                    $.getJSON(window.apiRoute + "/itemAutoComplete/" + encodeURIComponent(request.term), response); // data = [{label:"item 1"}, {label:"item 2"}, ..]
                },
                select: function(event, ui) {
                    // ui { label, value }
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

            var query = window.location.search.substring(1).split('&');
            var pair = query[0].split('=');
            var key = decodeURIComponent(pair[0]);
            var value = decodeURIComponent(pair[1]);

            switch (key.toLowerCase()) {
                case "customer":
                    $("#track_by option:contains('Customer')").prop("selected", true);
                    $("#track_by").trigger("change");
                    $("#customer").val(value);
                    this.searchCustomer(value);
                    break;
                case "item":
                    $("#track_by option:contains('Item')").prop("selected", true);
                    $("#track_by").trigger("change");
                    $("#item").val(value);
                    this.searchItem(value);
                    break;
                case "all":
                    if (value.toLowerCase() == "true") {
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

            //console.log("Search item: " + keyword); return;

            var self = this;
            $.getJSON(window.apiRoute + "/searchItem/" + encodeURIComponent(keyword), function(data) {
                if (!data.length || data[0] === null) {
                    $(".inventory-container")
                        .empty()
                        .text("No inventory found.");

                    return;
                }

                self.inventory = data;
                self.display_inventory();
                $("#customer").val("");
            }).fail(function() {
                self.render_error("Item: Search failed.");
            });
        },

        searchCustomer: function(keyword) {
            if (!keyword) return;

            //console.log("Search customer: " + keyword); return;

            var self = this;
            $.getJSON(window.apiRoute + "/searchCustomer/" + encodeURIComponent(keyword), function(data) {
                if (!data.length || data[0] === null) {
                    $(".inventory-container")
                        .empty()
                        .text("No inventory found.");

                    return;
                }

                self.inventory = data;
                self.display_inventory();
                $("#item").val("");
            }).fail(function() {
                self.render_error("Customer: Search failed.");
            });
        },

        showAllItems: function() {
            var self = this;
            $.getJSON( this.host, function( data ) {

                if( data && data.length && data[0] !== null){

                    self.inventory = data;
                    //self.consolidate_inventory();
                    self.display_inventory();
                    $("#customer").val("");
                    $("#item").val("");
                }
                else {
                    $(".inventory-container")
                        .empty()
                        .text("No inventory found.");
                }

            }).fail( function( response ){

                self.render_error( "Failed to load inventory: " + response );

            });
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
         * Spit out an error message at the top of the screen
         * @param error
         */
        render_error: function( error ) {
            $( '.error-message').remove();
            $( '.display-inventory-container').prepend( "<div class='error-message'>" + error + "</div>" );
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
        case "Item":
            filter = "item";
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
