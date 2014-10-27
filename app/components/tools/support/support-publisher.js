define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishOpening: function(params){
            context.sandbox.emit('menu.opening', params);
        },
        closeSupport: function() {
            context.sandbox.emit('support.close');
        },
        openSupport: function() {
            context.sandbox.emit('support.open');
        }
    };

    return exposed;
});