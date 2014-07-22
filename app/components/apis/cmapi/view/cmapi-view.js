define([
	'./cmapi-view-publisher'
], function (publisher) {
	var context,
        sendError,
        defaultLayerId;

    var exposed = {
        init: function(thisContext, defaultLayer, errorChannel, emit) {
            context = thisContext;
            sendError = errorChannel;
            defaultLayerId = defaultLayer;
            publisher.init(context);
        },
        receive: function(channel, message) {
            if(receiveChannels[channel]) {
                receiveChannels[channel](message);
            } else {
                sendError(channel, message, 'Channel not supported');
            }
        }
    };

    var receiveChannels= {
		"map.view.zoom": function(message) { //TODO verify this is correct
			if('range' in message) {
				// publisher.publishZoom(message); // TODO: support for range in meters doesnt make sense in 2d mapping
			} else if ('direction' in message) { //TODO should we support this?
                if(message.direction === 'in') {
                    //TODO
                } else if (message.direction === 'out') {
                    //TODO
                }
			} else {
                sendError('map.view.zoom', message, 'Must include either "range" or "direction"');
            }
		},
		"map.view.center.overlay": function(message) {
            var params = {};

            if(message === '') {
                params = {
                    "layerId": defaultLayerId
                };
            } else {
                params.layerId = message.overlayId || defaultLayerId;
                params.zoom = null; // TODO: ensure supoort for zoom parameter to overlay (CMAPI calls for using meters or 'auto')
            }
            publisher.publishZoomToLayer(params);
		},
		"map.view.center.feature": function(message) { // TODO: ensure supoort for zoom parameter to overlay (CMAPI calls for using meters or 'auto')
            var newAjax;
            if(message === '' || !message.featureId) {
                sendError('map.view.center.feature', message, 'Must include "featureId"');
                return;
            }

            //Get feature from server, then go to it
            newAjax = context.sandbox.dataStorage.getFeatureById(message, function(data) {
                var extent;

                //If the feature is a point, set center; else, zoom to extent
                if(data.geometry.type === "Point") {
                    publisher.publishSetCenter({
                        "lon": data.geometry.coordinates[1],
                        "lat": data.geometry.coordinates[0]
                    });
                } else {
                    extent = context.sandbox.cmapi.getMaxExtent(data.geometry.coordinates);
                    publisher.publishCenterOnBounds(extent);
                }
            });

            context.sandbox.ajax.addActiveAJAX(newAjax, null); //Keep track of current AJAX calls
		},
		"map.view.center.location": function(message) {
			if('location' in message &&
				'lat' in message.location &&
				'lon' in message.location){
				publisher.publishSetCenter(message.location);
			} else {
                sendError('map.view.center.location', message, 'Requires "location":{"lat", "lon"}');
            }
		},
		"map.view.center.bounds": function(message){
            var bounds;

            if(
                !message.bounds ||
                !message.bounds.northEast || 
                !('lat' in message.bounds.northEast) || 
                !('lon' in message.bounds.northEast) ||
                !message.bounds.southWest || 
                !('lat' in message.bounds.southWest) || 
                !('lon' in message.bounds.southWest)
            ){
                sendError('map.view.center.bounds', message, 'Requires "bounds" with northEast and southWest lat,lon');
                return;
            }

            bounds = {
                "minLon": message.bounds.southWest.lon,
                "minLat": message.bounds.southWest.lat,
                "maxLon": message.bounds.northEast.lon,
                "maxLat": message.bounds.northEast.lat
            };

            publisher.publishCenterOnBounds(bounds);
		},
		"map.view.clicked": function(message){ return; } //This is not supported
    };

    return exposed;
});