var navigation = {
    stateTable:{},
    pageHistory:[], // [{page, title}]
    maxPageHistory: 16,

    go:function(targetPage, args) {
        var self = this;

        if(targetPage == "loginForm.html"){
            this.clearPageHistory();
            this.savePageHistory(targetPage);
            $("#main_cont").load('/load/' + targetPage, {args:args, state:this.stateTable[targetPage.toLowerCase().split(".")[0]]});
            jQuery('#login').toggle(true);
            jQuery('#loggedIn').toggle(false)
        }
        else {
            jQuery.get(window.apiRoute + "/getUserInfo", function (result) {
                if(result.isConfirmed == 1) {
                    jQuery('#loggedIn').toggle(true);
                    jQuery('#login').toggle(false);
                    jQuery('#usersName').text(function () {
                        return result.FirstName + " " + result.LastName
                    });
                    jQuery.get(window.apiRoute + "/checkPermissions/" + targetPage + "/" + result.PermsID, function (res) {
                        self.savePageHistory(targetPage);

                        $("#main_cont").load('/load/' + targetPage, {
                            args: args,
                            state: self.stateTable[targetPage.toLowerCase().split(".")[0]]
                        });
                    }).fail(function () {
                        self.clearPageHistory();
                        alert("Your permission level doesn't allow you to access this page");
                        self.go("Home.html");
                    });
                }
                else{
                    alert("Your account has been created but not yet confirmed. Please check your email and confirm your account.");
                    jQuery('#login').toggle(true);
                    jQuery('#loggedIn').toggle(false);
                }
            }).fail(function () {
                navigation.clearPageHistory();
                navigation.go("loginForm.html");
                jQuery('#login').toggle(true);
                jQuery('#loggedIn').toggle(false);
            });
        }
    },
    back:function(times) {
        if (!times || times <= 0) times = 1;
        if (!this.pageHistory.length) return;

        var last = null;

        this.pageHistory.shift();

        for (var i = 0; i < times; ++i)
            last = this.pageHistory.shift();

        if (last)
            this.go(last.page);
        else
            this.go("Home.html");
    },
    saveState:function(state) {
        this.stateTable[window.thisPage.toLowerCase().split(".")[0]] = state;
    },
    get:function(route, callback){
        this._ajax(route, 'GET', null, null, callback);
    },
    getJSON:function(route, callback){
        this._ajax(route, 'GET', null, 'json', callback);
    },
    postJSON:function(route, callback){
        this._ajax(route, 'POST', null, 'json', callback);
    },
    post:function(route, data, callback){
        this._ajax(route, 'POST', data, null, callback);
    },
    put:function(route, data, callback) {
        this._ajax(route, 'PUT', data, null, callback);
    },
    _ajax: function(route, method, data, dataType, callback){
        params = {};

        if(data != null && typeof data != 'undefined'){
            params.data = data;
        }
        if(route.indexOf(window.apiRoute) < 0){
            route = window.apiRoute+route;
        }
        params.url = route;

        method = method.toUpperCase();
        if(['GET', 'POST', 'PUT'].indexOf(method) < 0){
            method = 'GET';
        }
        params.method = method;

        if(dataType != null && typeof dataType != 'undefined'){
            params.dataType = dataType;
        }

        $.ajax(params)
            .done(function(res){callback(null, res)})
            .fail(function(err){
                if(err.status == 511){
                    console.log("Access Denied!");
                    alert("Sorry your permission level doesn't allow you to access this page.");
                    navigation.go("Home.html");
                }
                else if(err.status == 510){
                    navigation.go("loginForm.html");
                    //alert("You have to log in before you can see this page!");
                }
                else{
                    callback(err, null);
                }
            })
    },
    checkImage: function( src, onLoad, onError ) {

        var img = new Image();

        img.onload = onLoad;
        img.onerror = onError;
        img.src = src;

    },
    makeImageURL: function( productID ) {
        return 'http://images.thisisimp.com.s3.amazonaws.com/'+productID+'.jpeg';
    },

    // Breadcrumbs

    savePageHistory: function(page) {
        if (this.pageHistory.length >= this.maxPageHistory) {
            this.pageHistory.pop();
        }

        if (!page) return;

        this.pageHistory.unshift({page:page});
        this.showBreadcrumbs(3);
    },

    // Copy of the page history array. [{page, title}].
    getPageHistory: function() {
        return this.pageHistory.slice(0);
    },

    clearPageHistory: function() {
        this.pageHistory = [];
        this.showBreadcrumbs(false);
    },

    setTitle: function(title) {
        if (!title) {
            $("#title").empty();
        } else {
            $("#title").text(title);

            if (this.pageHistory.length)
                this.pageHistory[0].title = title;
        }
    },

    showTitle: function(show) {
        !show ? $("#title").addClass("hidden") : $("#title").removeClass("hidden");
    },

    showBackButton: function(show) {
        !show ? $("#back_button").addClass("hidden") : $("#back_button").removeClass("hidden");
    },

    showBreadcrumbs: function(limit) {
        if (!limit) {
            $("#breadcrumbs").addClass("hidden");
            this.showBackButton(false);
            this.showTitle(false);
        } else {
            $("#breadcrumbs").removeClass("hidden").empty();
            var history = this.getPageHistory();
            var current = history.shift();
            var title = current.title || ""; // page.split(".", 1)[0]
            $("#title").text(title);
            this.showTitle(true);

            if (history.length < 1) {
                $("#breadcrumbs").addClass("hidden");
                this.showBackButton(false);
                return;
            }

            //this.showBackButton(true); //TODO do we even need a back button?

            for (var i = 0; i < limit && history.length; ++i) {
                var next = history.shift();
                var a = $("<a style='cursor: pointer;'/>")
                    .text(next.title);
                // a.attr("href", "#") // html4 and below
                this.makeBackLink(a, i + 1);
                $("#breadcrumbs").prepend(" > ").prepend(a);
            }
        }
    },

    makeBackLink:function(elem, times) {
        elem.click(function() {
            navigation.back(times); // closure fix
        });
    }
};
