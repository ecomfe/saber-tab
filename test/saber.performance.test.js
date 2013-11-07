define(function() {

    var ui = require( 'saber-ui' );
    var Tab = require( 'saber-tab' );
    var task = require( 'performance.test' );
    var $ = function( s ) { return document.querySelector( s ); };

    var wrapper = $( '#setupWrapper' );
    var outputer = $( '#outputer [data-for="saber"]' );

    describe( 'Tab - Saber', function () {

        task({
            ui: ui,
            Tab: Tab,
            wrapper: wrapper,
            outputer: outputer
        });

    });

});
