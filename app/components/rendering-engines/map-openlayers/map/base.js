define([
    './../map-api-publisher',
    './../libs/openlayers-2.13.1/OpenLayers'
], function(publisher) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        /**
         * Create the basic map and set default values for initial viewport
         * @param params
         * @returns {OpenLayers.Map}
         */
        createMap: function(params) {
            var mapElement,
                map,
                showCursorLocationDefault = true;
                
            mapElement = (params && params.el) ? params.el : 'map';
            map = new OpenLayers.Map(mapElement,{
                controls: [new OpenLayers.Control.Navigation()],
                projection: new OpenLayers.Projection(context.sandbox.mapConfiguration.projection),
                projectionWGS84: new OpenLayers.Projection('EPSG:4326')
            });

            exposed.addSelector({
                "map": map
            });

            // Check user settings for default setting to display cursor location
            if(
                context.sandbox.cursorLocation && 
                typeof context.sandbox.cursorLocation.defaultDisplay !== undefined
            ){
                showCursorLocationDefault = context.sandbox.cursorLocation.defaultDisplay; 
            }

            if(
                context.sandbox.mapConfiguration.cursorLocation && 
                context.sandbox.mapConfiguration.cursorLocation.defaultDisplay && 
                showCursorLocationDefault
            ){
                exposed.trackMousePosition({
                    "map": map
                });

                exposed.trackMapClick({
                    "map": map
                });
            }

            // Set initial value of map extent, in the state manager
            context.sandbox.stateManager.setMapExtent({
                "extent": {
                    "minLon": context.sandbox.mapConfiguration.initialMinLon,
                    "minLat": context.sandbox.mapConfiguration.initialMinLat,
                    "maxLon": context.sandbox.mapConfiguration.initialMaxLon,
                    "maxLat": context.sandbox.mapConfiguration.initialMaxLat
                }
            });

            // Listen for map movents and update the map extent in the state manager
            map.events.register('moveend', map, function(evt) {
                var currentExtent = map.getExtent().transform(map.projection, map.projectionWGS84);
                context.sandbox.stateManager.setMapExtent({
                    "extent": {
                        "minLon": currentExtent.left,
                        "minLat": currentExtent.bottom,
                        "maxLon": currentExtent.right,
                        "maxLat": currentExtent.top
                    }
                });
            });

            map.events.register('zoomend', map, function(evt) {
                // Basic cleanup for things on the map when zoom changes... can adjust later as needed
                exposed.clearMapSelection({
                    "map": map
                });
                exposed.clearMapPopups({
                    "map": map
                });
            });

            return map;
        },
        addSelector: function(params) {
            var selector = new OpenLayers.Control.SelectFeature([], {
                click: true,
                autoActivate: true
            });

            selector.handlers.feature.stopDown = false;
            params.map.addControl(selector);
        },
        addLayerToSelector: function(params) {
            var selector = params.map.getControlsByClass('OpenLayers.Control.SelectFeature')[0];
            selector.setLayer([params.layer]);
        },
        removeAllSelectors: function(params) {
            var controls = params.map.getControlsByClass('OpenLayers.Control.SelectFeature');
            controls.forEach(function(control) {
                control.destroy();
            });
        },
        resetSelector: function(params) {
            exposed.clearMapSelection({
                "map": params.map
            });
            exposed.clearMapPopups({
                "map": params.map
            });
            exposed.removeAllSelectors({
                "map": params.map
            });
            exposed.addSelector({
                "map": params.map
            });
        },
        clearMapSelection: function(params) {
            var controls = params.map.getControlsByClass('OpenLayers.Control.SelectFeature');
            controls.forEach(function(control) {
                control.unselectAll();
            });
        },
        trackMousePosition: function(params) {
            params.map.events.register('mousemove', params.map, function(e) {
                var position = this.events.getMousePosition(e);
                var latlon = exposed.getMouseLocation({
                    "map": params.map,
                    "position": position
                });
                publisher.publishMousePosition({
                    "lat": latlon.lat,
                    "lon": latlon.lon
                });
            });
        },
        trackMapClick: function(params) {
            params.map.events.register('click', params.map, function(e) {
                var position = this.events.getMousePosition(e);
                var latlon = exposed.getMouseLocation({
                    "map": params.map,
                    "position": position
                });
                publisher.publishMapClick({
                    "lat": latlon.lat,
                    "lon": latlon.lon
                });
            });
        },
        getMouseLocation: function(params) {
            return params.map.getLonLatFromPixel(params.position).transform(params.map.projection, params.map.projectionWGS84);
        },
        clearMapPopups: function(params) {
            while(params.map.popups.length) {
                params.map.removePopup(params.map.popups[0]);
            }

            context.sandbox.stateManager.removeAllIdentifiedFeatures();
        },
        identifyFeature: function(params) {
            var popup,
                map = params.map,
                feature = params.feature,
                anchor,
                bounds;

            anchor = {
                size: new OpenLayers.Size(0, 0),
                offset: new OpenLayers.Pixel(0, -(feature.attributes.height/2))
            };
            popup = new OpenLayers.Popup.FramedCloud(
                'popup',
                OpenLayers.LonLat.fromString(feature.geometry.getCentroid().toShortString()),
                null,
                params.buildInfoWinTemplate(feature),
                anchor,
                true,
                function() {
                    exposed.clearMapSelection({
                        map: map
                    });
                    exposed.clearMapPopups({
                        map: map
                    });
                }
            );

            bounds = feature.geometry.getBounds();
            map.setCenter(bounds.getCenterLonLat());

            feature.popup = popup;
            map.addPopup(popup);

            params.postRenderingAction(feature);

            context.sandbox.stateManager.setIdentifiedFeaturesByLayerId({
                layerId: feature.layer.layerId,
                featureIds:[feature.featureId]
            });
        },
        setVisualMode: function(params) {
            if(params && params.mode) {
                context.sandbox.stateManager.map.visualMode = params.mode;
            }
            exposed.clearMapPopups({
                "map": params.map
            });
        }
    };
    return exposed;
});