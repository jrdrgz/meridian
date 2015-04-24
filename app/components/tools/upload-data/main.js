define([
    'text!./upload-data.css',
    'text!./upload-data.hbs',
    './upload-data',
    './upload-data-publisher',
    './upload-data-subscriber',
    'handlebars'
], function (uploadDataToolCSS, uploadDataToolHBS, uploadDataTool, uploadDataToolPublisher, uploadDataToolSubscriber) {
    return {
        initialize: function() {
            console.log('THIS IN MAIN: ', this);
            this.sandbox.utils.addCSS(uploadDataToolCSS, 'tool-uploadData-component-style');

            var configOptions = this.sandbox.dataServices.upload.configuration,
                uploadDataToolTemplate = Handlebars.compile(uploadDataToolHBS),
                html;

            html = uploadDataToolTemplate({
                classifications: configOptions.classifications,
                filetypes: configOptions.filetypes
            });
            this.html(html);

            uploadDataToolPublisher.init(this);
            uploadDataToolSubscriber.init(this);
            uploadDataTool.init(this);
        }
    };                
});