define([
    'chai',
    'meridian-config',
    'aura/aura',
    'mocha'
], function(chai, configuration, Aura) {
    //start your test here.
    //mocha needs to see describe globally. If you try putting it in a function, it wont excecute. (Unless my test wasn't good.)
    describe('Defunct Channels', function () {
        var exitBeforeEach,
            meridian;

        //Read up on hooks: there might be a way of doing this outside the describe for a cleaner look.
        beforeEach(function (done) {
            exitBeforeEach = done;//Aura.then() function wont have access to done. I store it here and then call it.
            meridian = Aura({
                appName: configuration.appName,
                sources: {default: 'components'},
                mediator: configuration.mediator,
                version: configuration.version,
                releaseDate: configuration.releaseDate,
                cmapiVersion: configuration.cmapiVersion
            });
            //these extensions have .hbs files being loaded. Unless we host the test/index.html
            //it will throw the following error: Cross origin requests are only supported for protocol schemes.
            meridian.use('extensions/system-configuration-extension/system-configuration-extension')
                .use('extensions/utils-extension/utils-extension')
                .use('extensions/ajax-handler-extension/ajax-handler-extension')
                .use('extensions/session-extension/session-extension')
                .use('test/extensions/test-external-pubsub-extension/test-external-pubsub-extension') // added new
                .use('extensions/state-manager-extension/state-manager-extension')
                .use('extensions/data-storage-extension/data-storage-extension')
                .use('extensions/snapshot-extension/snapshot-extension')
                .use('extensions/map-configuration-extension/map-configuration-extension')
                .use('extensions/user-settings-extension/user-settings-extension')
                .use('extensions/support-configuration-extension/support-configuration-extension')
                .use('extensions/icon-extension/icon-extension')
                .use('extensions/exports/export-utils/export-utils')
                .use('extensions/cmapi-extension/cmapi-extension')  // added for cmapi
                .start({components: 'body'})
                .then(function () {
                    //start test
                    //must wait until aura starts before doing anything test related.
                    //If not, meridian variable will be undefined.
                    exitBeforeEach();
                });//end of then
        });//end of beforeEach

        describe('map.view.center.data', function () {
            //it("Base Test: Map View Center Data - DEFUNCT", function (done) {
            //
            //});

        });//map.view.center.data
        describe('map.view.center.feature', function () {
            it("DEFUNCT: View Center Feature", function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        var map,
                            payload,
                            beforeLayerCreateCount,
                            afterLayerCreateCount,
                            index,
                            plotSuccess = false;
                        expect = chai.expect;
                        if (params.channel == 'map.status.ready') {
                            map = renderer.getMap(),
                                beforeLayerCreateCount = map.layers.length; // layer count prior to the channel emit
                            payload = {
                                "overlayId": "testOverlayId1",
                                "name": "Test Name 1",
                                "format": "geojson",
                                "feature": {
                                    "type": "FeatureCollection",
                                    "features": [
                                        {
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": [
                                                    -10,
                                                    10
                                                ]
                                            },
                                            "properties": {
                                                featureId:'featureId01_',
                                                "p1": "pp1"
                                            },
                                            "style": {
                                                "height": 24,
                                                "width": 24,
                                                "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
                                                "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
                                            }
                                        },
                                        {
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": [
                                                    50,
                                                    -40
                                                ]
                                            },
                                            "properties": {
                                                "p1": "pp1"
                                            },
                                            "style": {
                                                "height": 24,
                                                "width": 24,
                                                "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
                                                "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
                                            }
                                        },
                                        {
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": [
                                                    10,
                                                    50
                                                ]
                                            },
                                            "properties": {
                                                "p1": "pp1"
                                            },
                                            "style": {
                                                "height": 24,
                                                "width": 24,
                                                "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
                                                "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
                                            }
                                        }
                                    ]
                                },
                                "zoom": false,
                                "readOnly": false
                            }
                            map.setCenter([2, 2], 5);
                            // Verify Layer Creation
                            meridian.sandbox.on('map.layer.create', function (params) {
                                afterLayerCreateCount = map.layers.length;
                                //  console.log("On Layer Create:", (map.getLayersBy('layerId', map.layers[9].layerId)[0]).getDataExtent());
                                // EXPECT: Where we expect that our layer count has in fact increased.
                                expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                                index = -1;
                                var searchTerm = "testOverlayId1",
                                    mapLayers = map.layers;
                                for (var i = 0, len = mapLayers.length; i < len; i++) {
                                    if (mapLayers[i].layerId === searchTerm) {
                                        index = i;
                                        break;
                                    }
                                }
                            });
                            // Verify Features Plotted
                            meridian.sandbox.on('map.features.plot', function (params) {
                                plotSuccess = true;
                                //      console.debug(map.layers);
                                //     console.log("Plotted Feature: ", map.layers[index]['features'][0]) // confirm featureId exists / despite not in payload
                                //        console.log ("Converted Coords: ", map.layers[index]['features'][0]['geometry']['bounds'].transform(map.projection, map.projectionWGS84))
                            });
                            //   console.log("After Extent", map.getZoomForExtent());
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.feature.plot',
                                    message: payload
                                }
                            });
                            //meridian.sandbox.external.receiveMessage({
                            //    data: {
                            //        channel: 'map.view.center.overlay', message: {
                            //            "overlayId": "testOverlayId1"
                            //        }
                            //    }
                            //});
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.view.center.feature', message: {
                                        "overlayId": 'testOverlayId1',
                                        "featureId": "featureId01_"
                                    }
                                }
                            });
                            setTimeout(function () {
                                // EXPECT: We wait 500ms, then expect the Zoom and coordinates
                                // to have changed properly to a centered point between the
                                // features on overlay "testOverlayId1".
                                // Note: These values will change depending on the bounds given
                                // for our Map frame's width and height in the Mocha Index.html file.
                                // We also ensure a plot emit registers to begin with via plotSuccess check.
                                var selectedLayer = map.getLayersBy('layerId', 'testOverlayId1')[0],
                                    feat = (selectedLayer.features),
                                    featId = (feat[0].attributes.featureId),
                                    i;
                                // EXPECT: We expect that plotting features from the Payload was successful.


                                //
                                //expect(plotSuccess).to.be.equal(true);
                                //console.log("Selected Layer", selectedLayer);
                                //console.log("Feat", feat);
                                //console.log("FeatId", featId);
                                //console.log("Get Data Extent", selectedLayer.getDataExtent());
                                //bounds = new OpenLayers.Bounds();
                                //bounds.extend(new OpenLayers.LonLat(4,5));
                                //if(feat) {
                                //    for (i=0, len = feat.length; i < len; i++) {
                                //        if(!feat[i].getVisibility() || !feat[i].onScreen()){
                                //            break;
                                //        }
                                //    }
                                //    // EXPECT: We expect that iterating through all existing features does not produce
                                //    // a feature failing to be map visible to the user.
                                //}



                                // EXPECT: We expect that the selected feature is located in the center of the map.
                                // EXPECT: We
                                //        var featureExtent = feature.geometry.getBounds();
                                //       bounds.extend(featureExtent);
                                // EXPECT: That the Data Extent is similar to the actual full map visible extent.
                                //      expect((map.getExtent().containsBounds(selectedLayer.getDataExtent()))).to.be.true;
                            }, 500);
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    meridian.html = $('#fixtures').html;
                    renderer.initialize.call(meridian, meridian);
                    done();
                });
            });//it
        });//map.view.center.feature

        describe('map.feature.plot.batch', function () {
            //it("Base Test: Feature Plot Batch - DEFUNCT", function (done) {
            //
            //});
            //it("Base Test: Feature Plot Batch - DEFUNCT", function (done) {
            //
            //    // This Unit Test (And Channel) might be irrelevant, as it doesn't seem to provide any real advantages
            //    // over the basic map.feature.plot channel. You can plot multiple points there, and also define the
            //    // same amount of data.
            //
            //    require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
            //        meridian.sandbox.external.postMessageToParent = function (params) {
            //            if (params.channel == 'map.status.ready') {
            //
            //                var map = renderer.getMap(),
            //                    payload = {
            //                        //    PROBLEM: It doesn't like "features" being an Array. It expects Features to be an object.
            //                        "features": [
            //                            {
            //                                "type": "Feature",
            //                                "geometry": {
            //                                    "type": "Point",
            //                                    "coordinates": [
            //                                        -10,
            //                                        10
            //                                    ]
            //                                },
            //                                "properties": {
            //                                    "p1": "pp1"
            //                                },
            //                                "style": {
            //                                    "height": 24,
            //                                    "width": 24,
            //                                    "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
            //                                    "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
            //                                }
            //                            },
            //                            {
            //                                "type": "Feature",
            //                                "geometry": {
            //                                    "type": "Point",
            //                                    "coordinates": [
            //                                        50,
            //                                        10
            //                                    ]
            //                                },
            //                                "properties": {
            //                                    "p1": "pp1"
            //                                },
            //                                "style": {
            //                                    "height": 24,
            //                                    "width": 24,
            //                                    "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
            //                                    "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
            //                                }
            //                            },
            //                            {
            //                                "type": "Feature",
            //                                "geometry": {
            //                                    "type": "Point",
            //                                    "coordinates": [
            //                                        10,
            //                                        50
            //                                    ]
            //                                },
            //                                "properties": {
            //                                    "p1": "pp1"
            //                                },
            //                                "style": {
            //                                    "height": 24,
            //                                    "width": 24,
            //                                    "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
            //                                    "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
            //                                }
            //                            }
            //                        ],
            //                        "overlayId": "testOverlayId1",
            //                        "format": "geojson",
            //                        "zoom": false,
            //                        "readOnly": false
            //                },
            //                    beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
            //                    afterLayerCreateCount,
            //                    index;
            //                //test goes here
            //                meridian.sandbox.on('map.layer.create', function(params) {
            //                    afterLayerCreateCount = map.layers.length;
            //                    expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
            //                    index = -1;
            //                    var searchTerm = "testOverlayId1",
            //                        mapLayers = map.layers;
            //                    for(var i= 0, len = mapLayers.length; i < len; i++) {
            //                        if(mapLayers[i].layerId === searchTerm) {
            //                            index = i;
            //                            break;
            //                        }
            //                    }
            //                    expect(index).to.not.equal(-1); // confirms map.feature.plot added a layer and one with the overlayId, 'testOverlayId1'
            //                });
            //                meridian.sandbox.on('map.features.plot', function(params) {
            //                    // PSEUDOCODE: Maybe tick up a "plottedCount" variable.
            //                      done();
            //                });
            //                meridian.sandbox.external.receiveMessage({data:{channel:'map.feature.plot', message: payload }}); // manual publish to the channel
            //                    // PSEUDOCODE: Wait maybe 500ms, then run expectations to see;
            //                    // A. Does the map currently have the proper number of features specified in the Payload?
            //                    // B. Do the coordinates between plotted points and Payload match?
            //            }
            //        };
            //        cmapiMain.initialize.call(meridian, meridian);
            //        var $fixtures = $('#fixtures');
            //        meridian.html = $fixtures.html;
            //        renderer.initialize.call(meridian, meridian);
            //    });
            //});//it

        });//map.feature.plot.batch
        describe('map.feature.hide', function () {
            //it("Base Test: Map Feature Hide - DEFUNCT", function (done) {
            //
            //});

        });//map.feature.hide
        describe('map.feature.show', function () {
            //it("Base Test: Map Feature Show - DEFUNCT", function (done) {
            //
            //});
        });//map.feature.show
    });//describe
});
