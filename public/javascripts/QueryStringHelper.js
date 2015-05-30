function getQueryStringParams() {
    var params = {};
    location.search.substr(1).split("&").forEach(function(each) {
        if (each !== "") {
            var pair = each.split("=");
            params[pair[0]] = pair[1];
        }
    });

    return params;
}

function mapToQueryString(map) {
    var s = "";
    var entries = [];

    for (var k in map) {
        entries.push(k + "=" + map[k]);
    }

    for (var i = 0; i < entries.length; ++i) {
        s += entries[i];

        if (i < entries.length - 1) {
            s += "&";
        }
    }

    return s;
}
