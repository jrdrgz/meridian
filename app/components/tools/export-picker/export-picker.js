define([
    './export-picker-publisher',
    'text!./export-picker-layers.hbs',
    'bootstrap',
    'handlebars'
], function (publisher, layersHBS) {

    var context,
        selectedFeature,
        layerListTemplate,
        $modal,
        $layerList,
        $selectAll,
        $layerContainer,
        $exportContainer,
        $extraContainer,
        COMPONENT_DESIGNATION = 'export-picker-modal'

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            selectedFeature = null;
            layerListTemplate = Handlebars.compile(layersHBS);

            $modal = context.$('#export-picker-modal');
            $modalDialog = $modal.find('modal-dialog');

            //Layer objects
            $layerContainer = $modal.find('#layer-container');
            $layerList = $layerContainer.find('#layer-options');
            $selectAll = $layerContainer.find('input:checkbox[value=checkAll]');

            //Export objects
            $exportContainer = $modal.find('#export-container');

            //Extra options objects
            $extraContainer = $modal.find('#extra-export-container');

            $modal.modal({
                backdrop: true,
                keyboard: true,
                show: false
            }).on('hidden.bs.modal', function() {
                publisher.close();
            });

            //Export button
            $modal.find('.modal-footer button[type="submit"]').on('click', function(){
                var selectedLayers = getSelectedLayers(),
                    selectedExportOption = getSelectedExportOption(),
                    extraFields = getExtraFields(selectedExportOption),
                    featureId,
                    layerId,
                    publishMessageCallback;

                publishMessageCallback = function(callbackParams){
                    publisher.publishMessage({
                        messageType: callbackParams.messageType,
                        messageTitle: callbackParams.messageTitle,
                        messageText: callbackParams.messageText
                    });
                };

                if(!selectedExportOption || selectedExportOption === ''){
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Export',
                        messageText: 'No export option selected.'
                    });
                } else if(selectedFeature){ //Is set on open
                    featureId = selectedFeature.featureId;
                    layerId = selectedFeature.layerId;

                    publisher.close(); //This resets selected feature
                    context.sandbox.export.export[selectedExportOption]({
                        featureId: featureId,
                        layerId: layerId,
                        options: extraFields,
                        callback: publishMessageCallback
                    });
                } else if (!selectedLayers.length){
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Export',
                        messageText: 'No layer to export selected.'
                    });
                } else{
                    publisher.close();
                    context.sandbox.export.export[selectedExportOption]({
                        layerIds: selectedLayers,
                        options: extraFields,
                        callback: publishMessageCallback
                    });
                }
            });

            //Close button
            $modal.find('.modal-footer button[type="cancel"]').on('click', function(event) {
                event.preventDefault();
                publisher.close();
            });


            //select all logic. WILL NOT WORK consistently WITH .attr
            $selectAll.on('change', function(event) {
                if($selectAll.is(':checked')){
                    $layerList.find('input.layer-checkbox').prop('checked', true);
                    showStepTwo();
                }
                else{
                    //don't change this to removeProp.
                    $layerList.find('input.layer-checkbox').prop('checked', false);
                    showStepOne();
                }
                validateLayers();
            });

            //Export radio buttons. These don't get removed, so can do up here.
            $exportContainer.find('input:radio[name=exportOption]').on('change', function(){
                var $this = context.$(this),
                    exportId = $this.val(),
                    enabledExtraOptions;

                $exportContainer.find('.radio').removeClass('selected');
               // $this.parent().parent().addClass('selected'); //TODO does 'selected' do anything anymore?
                enabledExtraOptions = enableExtraOptions(exportId);

            });

            //Layercontainer click logic.
            $layerContainer.on('click', function(event){
                if(event.target.type != "checkbox"){
                    if($extraContainer.css("opacity") == 1){
                        showStepTwo();
                    }
                    else if($exportContainer.css("opacity") == 1){
                        showStepOne();
                    }
                }
            });
        },
        open: function(params) {
            clean();

            if(params && params.featureId && params.layerId){ //It is a point
                selectedFeature = {
                    featureId: params.featureId,
                    layerId: params.layerId
                };

                publisher.publishOpening({
                    componentOpening: COMPONENT_DESIGNATION
                });

                validateFeature({
                    featureId: params.featureId,
                    layerId: params.layerId
                });

            }else if(params && params.layerId){ //It is a specific layer
                //message came from timeline containing params.overlayId
                publisher.publishOpening({
                    componentOpening: COMPONENT_DESIGNATION
                });
                exposed.updateExportLayerList();
                $selectAll.removeProp('checked');

                $layerContainer.find('.layer-option input[value=' + params.layerId +']').prop('checked', true);
                showStepTwo();
                validateLayers();

            } else{ //It is all layers
                publisher.publishOpening({
                    componentOpening: COMPONENT_DESIGNATION
                });
                exposed.updateExportLayerList();
                showStepOne();
            }
            $modal.modal('show');
        },
        close: function() {
            $modal.modal('hide');
            selectedFeature = null;
            clean();
        },
        clear: function() {
            exposed.close();
        },
        updateExportLayerList: function(){
            var layerList = [];

            //It is assumed that dataStorage.datasets will always have at least one layer
            //since the component does not open without one.
            context.sandbox.util.each(context.sandbox.dataStorage.datasets, function(layerId, layerInfo){
                layerList.push({
                    layerId: layerId,
                    layerName: layerInfo.layerName,
                    dataSource: layerInfo.dataService,
                    count: layerInfo.length
                });
            });//end of the util.each
            $layerList.html(layerListTemplate({
                layers: layerList
            }));

            //Apply update logic to layer checkboxs
            $layerList.find('.layer-checkbox:checkbox').on('change',function(event){
                $selectAll.removeProp('checked');//TODO: not working on chrome??
                validateLayers();
                var selectedOptions = getSelectedLayers();
                    //if at least one layer is selected, keep the export options tab open
                    if(selectedOptions.length == 0){
                        showStepOne();
                    }else{
                        showStepTwo();
                    }
            });
        }
    };

    function showExportOptions(){
        $exportContainer.css("opacity", 1);
        $exportContainer.stop().animate({left: "418px"}, 500, 'swing');
    }


    function hideExportOptions(){
        //change the opacity when the animation completes.
        $exportContainer.stop().animate({left: "598px"}, 500, 'swing', function(){
            $exportContainer.css('opacity', 0);
        });
       
    }

    function validateFeature(params){
        var featureId = params.featureId,
            layerId = params.layerId;

        context.sandbox.utils.each(context.sandbox.export.validate, function(exportId, validateFunction){
            var setExportOption = function(valid){
                if(valid){
                    enableExportOption(exportId);
                }else{
                    disableExportOption(exportId);
                }
            };

            validateFunction({
                featureId: featureId,
                layerId: layerId,
                callback: setExportOption
            });
        });
    }

    function validateLayers(){
        var selectedLayers = getSelectedLayers();

        context.sandbox.utils.each(context.sandbox.export.validate, function(exportId, validateFunction){
            var setExportOption = function(valid){
                if(valid){
                    enableExportOption(exportId);
                }else{
                    disableExportOption(exportId);
                }
            };

            validateFunction({
                layerIds: selectedLayers,
                callback: setExportOption
            });
        });
    }

    function disableExportOption(exportId){
        var exportRadioDiv = $exportContainer.find('#export-'+ exportId);
        exportRadioDiv.hide();
        exportRadioDiv.find(':radio').prop('disabled', true);

    }
    function enableExportOption(exportId, type){
        var exportRadioDiv = $exportContainer.find('#export-'+ exportId),
            exportRadio = exportRadioDiv.find(':radio');

        exportRadioDiv.show();
        exportRadio.prop('disabled', false);
        exportRadio.prop('checked', false);
    }

    function getSelectedLayers(){
        return $layerList.find('input.layer-checkbox:checked').map(function () {
            return this.value;
        }).get();
    }

    function getSelectedExportOption(){
        return $exportContainer.find('#export-options input:checked').val();
    }

    //set modal to initial view clean of all selections.
    //TODO: clean options from extraContainer
    function clean(){
        $selectAll.removeProp('checked');
        $layerContainer.find('.layer-option input').prop('checked', false);
        $exportContainer.find('.radio').removeClass('selected');
        showStepOne();
    }

    //verifies if the export option has additional options
    function enableExtraOptions(exportId){
        var $exportPane = $extraContainer.find('#tab-' + exportId);

        if($exportPane.length) { //Check if there is a pane for the export id
            showStepThree();
            return true;
        }else{
            showStepTwo(); 
            return false;
        }
    }
    
    //shows the extra option container and moves the export options further left.
    function showExtraOptions(){
        $exportContainer.css("opacity", 1);
        $exportContainer.stop().animate({left: "106px"}, 500, 'swing');

        $extraContainer.css("opacity", 1);
        $extraContainer.stop().animate({left: "237px"}, 450, 'swing');
    }
    //hides the extra options pane.
    function hideExtraOptions(){
        $extraContainer.stop().animate({left: "598px"}, 500, 'swing', function(){
            $extraContainer.css("opacity", 0);
        });
    }

    function getExtraFields(exportId){
        //Collect all (if any inputs in the export option's pane
        var $inputs = $extraContainer.find('#tab-' + exportId + ' input'),
            fieldValueMap = {};

        $inputs.each(function(){
            var $this = context.$(this);
            if($this.is(':checkbox')){
                fieldValueMap[$this.data('field')] = $this.is(':checked');
            } else{
                fieldValueMap[$this.data('field')] = $this.val();
            }
        });

        return fieldValueMap;
    }

    //View that only contains the layer list.
    function showStepOne(){
        hideExtraOptions();
        hideExportOptions();
    }
    //View that contains the layers and the export options.
    function showStepTwo(){
        hideExtraOptions();
        showExportOptions();
    }
    //View that contains layer list, export options and the additional options.
    function showStepThree(){
        showExtraOptions();
    }

    return exposed;

});
