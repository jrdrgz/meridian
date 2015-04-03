define([
    './../map-api-publisher',
    './../libs/leaflet-src'
], function(publisher) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        zoomIn: function(params) {
            params.map.zoomIn();
        },
        zoomOut: function(params) {
            params.map.zoomOut();
        },
        /**
         * Zoom to bbox
         * @param params
         */
        zoomToExtent: function(params) {
            var southWest = L.latLng(params.minLat, params.minLon),
                northEast = L.latLng(params.maxLat, params.maxLon),
                bounds = L.latLngBounds(southWest, northEast);
            params.map.fitBounds(bounds);
        },
        /**
         * Zoom to extent of layer DATA
         * @param params
         */
        zoomToLayer: function(params) {
            var layer = params.map.getLayersBy('layerId', params.layerId)[0];

            if(layer && layer.getDataExtent()) {
                params.map.zoomToExtent(layer.getDataExtent());
            } else {
                publisher.publishMessage({
                    messageType: 'warning',
                    messageTitle: 'Zoom to Layer',
                    messageText: 'No data in layer to zoom to.'
                });
            }
        },
        /**
         * Zoom to features (all features in array must belong to the same layer)
         * @param params
         */
        zoomToFeatures: function(params) {
            var layer = params.map.getLayersBy('layerId', params.layerId)[0],
                bounds = new OpenLayers.Bounds(),
                featuresFound = false;

            if(layer) {
                // TODO: make it also work in cluster mode (to check through the features in clusters)
                context.sandbox.utils.each(params.featureIds, function(index, featureId) {
                    var feature = layer.getFeatureBy('featureId', featureId),
                        featureExtent;

                    if(feature) {
                        featureExtent = feature.geometry.getBounds();
                        bounds.extend(featureExtent);
                        featuresFound = true;
                    } else {
                        // feature is likely in a cluster
                        context.sandbox.utils.each(layer.features, function(k1, v1) {
                        if(v1.cluster) {
                            context.sandbox.utils.each(v1.cluster, function(k2, singleFeature) {
                                if(singleFeature.featureId === featureId) {
                                    featureExtent = singleFeature.geometry.getBounds();
                                    bounds.extend(featureExtent);
                                    featuresFound = true;
                                }
                            });
                        }
                    });
                    }
                });

                if(featuresFound) {
                   params.map.zoomToExtent(bounds);
                } else {
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Zoom to Features',
                        messageText: 'Features not found.'
                    });
                }
            } else {
                publisher.publishMessage({
                    messageType: 'warning',
                    messageTitle: 'Zoom to Features',
                    messageText: 'Features not found.'
                });
            }
        },
        /**
         * Pan to given point and zoom to zoom-level-8
         * @param params
         */
        setCenter: function(params) {
            var centerPoint,
                lat = params.lat,
                lon = params.lon;

            centerPoint = new OpenLayers.LonLat(lon, lat);
            params.map.setCenter(centerPoint.transform(params.map.projectionWGS84, params.map.projection), 8);
        }
    };
    
    return exposed;
});