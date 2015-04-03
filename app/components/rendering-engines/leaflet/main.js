define([], function (){
    var exposed = {
        initialize: function() {
            if(this.sandbox.mapConfiguration.defaultMapEngine === 'Leaflet') {
                requireStuff(this);
            }

            this.sandbox.on('map.renderer.change', function(params) {
                if(params.provider === 'Leaflet') {
                    requireStuff(this);
                } else {
                    // Destroy other Map
                }
            });
        }
    };

    function requireStuff(thisContext) {
        var context = thisContext;
        
        require([
            './components/rendering-engines/leaflet/map/core',
            'text!./components/rendering-engines/leaflet/libs/leaflet.css', 
            'text!./components/rendering-engines/leaflet/leaflet.css', 
            'text!./components/rendering-engines/leaflet/leaflet.hbs',
            './components/rendering-engines/leaflet/map-api-publisher',
            './components/rendering-engines/leaflet/map-api-subscriber',
            'handlebars'
        ], function(
            mapCore,
            leafComponentCSS,
            leafMapRendererCSS,
            leafMapRendererHBS,
            leafMapRendererPublisher,
            leafMapRendererSubscriber
        ){
            context.sandbox.utils.addCSS(leafComponentCSS, 'leaflet-component-style');
            context.sandbox.utils.addCSS(leafMapRendererCSS, 'rendering-engines-leaflet-component-style');

            var leafMapRendererTemplate = Handlebars.compile(leafMapRendererHBS);
            var html = leafMapRendererTemplate();
            context.html(html);

            mapCore.init(context);
            leafMapRendererPublisher.init(context);
            leafMapRendererSubscriber.init(context);
        });
    }

    return exposed;
});
