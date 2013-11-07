define(function() {

    var ui = require( 'esui' );
    var Tab = require( 'esui/tab' );
    var task = require( 'performance.test' );
    var $ = function( s ) { return document.querySelector( s ); };

    var wrapper = $( '#setupWrapper' );
    var outputer = $( '#outputer [data-for="esui"]' );

    describe( 'Tab - ESUI', function () {

        task({
            ui: ui,
            Tab: Tab,
            wrapper: wrapper,
            outputer: outputer
        });

    });

});
