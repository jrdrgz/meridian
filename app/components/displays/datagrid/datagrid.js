define([
    './datagrid-publisher',
    'datatable'
], function (publisher) {

    var context,
        myTable,
        $datagridContainer,
        datagridVisible = false;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $datagridContainer = context.$('#datagridContainer');
        },
        toggleGrid: function() {
            if($datagridContainer.hasClass('hidden')) {
                exposed.open();
            }else {
                exposed.close();
            }
        },
        open: function() {
            if(!context.sandbox.utils.isEmptyObject(context.sandbox.dataStorage.datasets)) {
                var compiledData = [],
                    storedColumns,
                    datasets = context.sandbox.dataStorage.datasets;

                $datagridContainer.removeClass('hidden');
                $datagridContainer.height(328);


                storedColumns = context.sandbox.dataStorage.getColumns();
                 _.each(datasets, function(collection) {
                    _.each(collection.models, function(model) {

                        var tempObject = {};
                        $.each(storedColumns, function(k, v){
                            if(model.attributes.hasOwnProperty(k)) {
                                tempObject[v] = model.attributes[k];
                            } else {
                                tempObject[v] = '';
                            }
                        });
                        compiledData.push(tempObject);

                    });
                });

                var columnsArray = [];
                context.sandbox.utils.each(storedColumns, function(k, v) {
                    columnsArray.push(v);
                });
                
                if(!myTable) {
                    myTable = $datagridContainer.Datatable({
                        "sortable": true,
                        "pagination": true,
                        "data": compiledData,
                        "columns": columnsArray,
                        "searchable": true,
                        "closeable": false,
                        "clickable": true,
                        "afterRowClick": function(target) {
                            publisher.identifyRecord({
                                "featureId": target['Feature ID'],
                                "layerId": target['Layer ID']
                            });
                        }
                    });
                } else {
                    myTable.removeAllData();
                    myTable.addData(compiledData);
                }
                datagridVisible = true;
            } else {
                publisher.closeDatagrid();
                datagridVisible = false;
            }
        },
        close: function() {
            $datagridContainer.addClass('hidden');
            $datagridContainer.height(0);
            if(myTable) {
                myTable.removeAllData();
            }
            datagridVisible = false;
        },
        clear: function() {
            if(myTable) { //In both untill refactor
                myTable.removeAllData();
            }
            exposed.close();
        },
        reload: function() {
            if(datagridVisible) {
                exposed.open();
            }
        }
    };

    return exposed;
    
});