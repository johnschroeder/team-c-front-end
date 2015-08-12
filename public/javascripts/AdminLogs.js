/**
 * Created by Trevor on 7/20/2015.
 */


var counter = 0;
function DisplayNext(log, currId) {

    var rowToCopy = $('.InputChild').first();
    var rowsContainer = '#InputDiv';

    var clonedRow = rowToCopy.clone();
    if (counter == 0)
    {
        $('.InputChild').first().remove();
    }
    clonedRow.find('label').prop('id', 'log' + counter);
    clonedRow.find('label').text(log);

    counter++;

    clonedRow.appendTo(rowsContainer);

}

function clearLogs()
{
    while (counter > 1)
    {
        $('.InputChild').first().remove();
        counter--;
    }
}



var filterCounter = 0;
function DisplayNextFilter(filterName, filterId) {

    var rowToCopy = $('.filter').first();
    var rowsContainer = '#filterForm';

    var clonedRow = rowToCopy.clone();
    if (filterCounter == 0)
    {
        $('.filter').first().remove();
    }
    clonedRow.find('label').prop('id', 'filter' + filterCounter);
    clonedRow.find('input:checkbox').prop('id', filterId);
    clonedRow.find('label').text(filterName);

    filterCounter++;

    clonedRow.appendTo(rowsContainer);


}

var DisplayAll =
{
    var:logTypesDisplayed = [],

    var:firstInitialization = true,


    Now: function () {
        counter = 0;

        var filterParameters = JSON.stringify({"filter":logTypesDisplayed});
      
        var host = window.apiRoute + "/getAllLogs/" + filterParameters;

        navigation.get(host, function (err, logsForUsername) {
            var logsObj = JSON.parse(logsForUsername);
            var logs = logsObj.logs;


            for (var i = logs.length -1; i >= 0; i--) {

                var log = logs[i];
                var currId = logsObj.id[i];
                DisplayNext(log, currId);
            }

        });
    },

    refreshedLogs : function()
    {
        clearLogs();
        DisplayAll.Now();
    },

    FilterBoxes: function() {
        filterCounter = 0;


        $.get(apiRoute + "/LogFilterMappings/", function (mappings) {
            var filterObj = JSON.parse(mappings);
            var filterNames = filterObj.types;
            var filterTypes = filterObj.keys;

            for (var i = filterNames.length - 1; i >= 0; i--) {


                var filterName = filterNames[i];
                var currId = filterTypes[i]; // logsObj.id[i];
                if (firstInitialization)
                {
                    logTypesDisplayed.push(currId);
                }
                DisplayNextFilter(filterName, currId);
            }

            $("input:checkbox").each(function () {
                var $this = $(this);
                var fieldName = $this.attr("name");
                if (fieldName == "filterLogs") {
                    if (!($this.is(":checked"))) {

                        var myId = $this.attr("id");

                        for (var i = 0; i < logTypesDisplayed.length; i++) {
                            if ("" + logTypesDisplayed[i] == myId) {
                                $this.prop('checked', 1);
                            }
                        }
                    }
                }
            });
        }).then(function x() {
            if (firstInitialization) {
                DisplayAll.firstInitization = false;
                DisplayAll.Filter();
            }});



    },


    Filter: function () {

        while(logTypesDisplayed.length > 0) {
            logTypesDisplayed.pop();
        }

        $("input:checkbox").each(function(){
            var $this = $(this);
            var name = $this.attr("name");
            if (name == "filterLogs") {
                if ($this.is(":checked")) {
                    var push = $this.attr("id");
                    logTypesDisplayed.push(push);
                }
            }
        });

        DisplayAll.refreshedLogs();
    }

};